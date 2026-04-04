using BillGenerator.Api.Contracts;
using BillGenerator.Domain;
using BillGenerator.Domain.Entities;
using BillGenerator.Domain.Enums;
using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BillGenerator.Api.Services;

/// <summary>
/// Bills, lines, finalize with invoice numbers, and CSV export text.
/// </summary>
public class BillService(AppDbContext db, IConfiguration configuration)
{
    private decimal DefaultTaxRate =>
        configuration.GetValue("Billing:DefaultTaxRatePercent", 8.25m);

    public async Task<BillDetailDto> CreateDraftAsync(CreateBillRequest req, CancellationToken ct = default)
    {
        var tax = req.TaxRatePercent ?? DefaultTaxRate;
        var bill = new Bill
        {
            CreatedAtUtc = DateTime.UtcNow,
            Status = BillStatus.Draft,
            DiscountType = DiscountType.None,
            DiscountValue = 0,
            TaxRatePercent = tax,
            Notes = req.Notes
        };
        db.Bills.Add(bill);
        await db.SaveChangesAsync(ct);
        return await GetDetailAsync(bill.Id, ct) ?? throw new InvalidOperationException("Bill not found after insert.");
    }

    public async Task<IReadOnlyList<BillSummaryDto>> ListAsync(
        DateTime? fromUtc,
        DateTime? toUtc,
        BillStatus? status,
        string? search,
        CancellationToken ct = default)
    {
        var q = db.Bills.AsNoTracking().Include(b => b.Lines).AsQueryable();
        if (fromUtc.HasValue) q = q.Where(b => b.CreatedAtUtc >= fromUtc.Value);
        if (toUtc.HasValue) q = q.Where(b => b.CreatedAtUtc <= toUtc.Value);
        if (status.HasValue) q = q.Where(b => b.Status == status.Value);
        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            q = q.Where(b =>
                (b.InvoiceNumber != null && b.InvoiceNumber.Contains(s)) ||
                (b.Notes != null && b.Notes.Contains(s)));
        }

        var list = await q.OrderByDescending(b => b.CreatedAtUtc).ToListAsync(ct);
        return list.Select(b =>
        {
            BillingMath.RefreshLineTotals(b.Lines);
            var sub = BillingMath.Subtotal(b.Lines);
            var disc = BillingMath.DiscountAmount(sub, b.DiscountType, b.DiscountValue);
            var baseTax = BillingMath.TaxableBase(sub, disc);
            var tax = BillingMath.TaxAmount(baseTax, b.TaxRatePercent);
            var grand = BillingMath.GrandTotal(baseTax, tax);
            return new BillSummaryDto
            {
                Id = b.Id,
                InvoiceNumber = b.InvoiceNumber,
                CreatedAtUtc = b.CreatedAtUtc,
                Status = b.Status,
                GrandTotal = grand
            };
        }).ToList();
    }

    public async Task<BillDetailDto?> GetDetailAsync(int id, CancellationToken ct = default)
    {
        var b = await db.Bills.AsNoTracking().Include(x => x.Lines).FirstOrDefaultAsync(x => x.Id == id, ct);
        return b == null ? null : ToDetail(b);
    }

    public async Task<BillDetailDto?> UpdateBillAsync(int id, UpdateBillRequest req, CancellationToken ct = default)
    {
        var b = await db.Bills.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (b == null || b.Status != BillStatus.Draft) return null;

        if (req.DiscountType.HasValue) b.DiscountType = req.DiscountType.Value;
        if (req.DiscountValue.HasValue) b.DiscountValue = req.DiscountValue.Value;
        if (req.TaxRatePercent.HasValue) b.TaxRatePercent = req.TaxRatePercent.Value;
        if (req.Notes != null) b.Notes = req.Notes;

        await db.SaveChangesAsync(ct);
        return await GetDetailAsync(id, ct);
    }

    public async Task<bool> DeleteDraftAsync(int id, CancellationToken ct = default)
    {
        var b = await db.Bills.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (b == null || b.Status != BillStatus.Draft) return false;
        db.Bills.Remove(b);
        await db.SaveChangesAsync(ct);
        return true;
    }

    public async Task<BillDetailDto?> AddLineAsync(int billId, AddBillLineRequest req, CancellationToken ct = default)
    {
        var b = await db.Bills.Include(x => x.Lines).FirstOrDefaultAsync(x => x.Id == billId, ct);
        if (b == null || b.Status != BillStatus.Draft) return null;

        string description;
        decimal unitPrice;
        int? catalogId = req.CatalogItemId;
        var source = req.Source;

        if (req.CatalogItemId.HasValue)
        {
            var cat = await db.CatalogItems.FirstOrDefaultAsync(x => x.Id == req.CatalogItemId.Value && x.IsActive, ct);
            if (cat == null) throw new InvalidOperationException("Catalog item not found or inactive.");
            description = string.IsNullOrWhiteSpace(req.Description) ? cat.Name : req.Description!.Trim();
            unitPrice = req.UnitPrice ?? cat.DefaultPrice;
            // Line source must match the catalog family (ignore client mismatch).
            source = cat.CatalogType switch
            {
                CatalogType.EntranceFee => BillLineSource.Entrance,
                CatalogType.DonationPreset => BillLineSource.Donation,
                CatalogType.SellingPrice => BillLineSource.Selling,
                _ => source
            };
        }
        else
        {
            if (string.IsNullOrWhiteSpace(req.Description))
                throw new InvalidOperationException("Description required for custom lines.");
            if (!req.UnitPrice.HasValue)
                throw new InvalidOperationException("UnitPrice required for custom lines.");
            description = req.Description.Trim();
            catalogId = null;
            unitPrice = req.UnitPrice.Value;
        }

        var line = new BillLine
        {
            BillId = billId,
            Source = source,
            CatalogItemId = catalogId,
            Description = description,
            Quantity = req.Quantity,
            UnitPrice = unitPrice,
            LineTotal = BillingMath.LineTotal(req.Quantity, unitPrice)
        };
        db.BillLines.Add(line);
        await db.SaveChangesAsync(ct);
        return await GetDetailAsync(billId, ct);
    }

    public async Task<BillDetailDto?> UpdateLineAsync(int billId, int lineId, UpdateBillLineRequest req, CancellationToken ct = default)
    {
        var b = await db.Bills.FirstOrDefaultAsync(x => x.Id == billId, ct);
        if (b == null || b.Status != BillStatus.Draft) return null;

        var line = await db.BillLines.FirstOrDefaultAsync(x => x.Id == lineId && x.BillId == billId, ct);
        if (line == null) return null;

        if (req.Description != null) line.Description = req.Description.Trim();
        if (req.Quantity.HasValue) line.Quantity = req.Quantity.Value;
        if (req.UnitPrice.HasValue) line.UnitPrice = req.UnitPrice.Value;
        line.LineTotal = BillingMath.LineTotal(line.Quantity, line.UnitPrice);

        await db.SaveChangesAsync(ct);
        return await GetDetailAsync(billId, ct);
    }

    public async Task<BillDetailDto?> DeleteLineAsync(int billId, int lineId, CancellationToken ct = default)
    {
        var b = await db.Bills.FirstOrDefaultAsync(x => x.Id == billId, ct);
        if (b == null || b.Status != BillStatus.Draft) return null;

        var line = await db.BillLines.FirstOrDefaultAsync(x => x.Id == lineId && x.BillId == billId, ct);
        if (line == null) return null;

        db.BillLines.Remove(line);
        await db.SaveChangesAsync(ct);
        return await GetDetailAsync(billId, ct);
    }

    /// <summary>
    /// Assigns a unique invoice number and locks the bill.
    /// </summary>
    public async Task<BillDetailDto?> FinalizeAsync(int billId, CancellationToken ct = default)
    {
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        var b = await db.Bills.Include(x => x.Lines).FirstOrDefaultAsync(x => x.Id == billId, ct);
        if (b == null || b.Status != BillStatus.Draft) return null;

        BillingMath.RefreshLineTotals(b.Lines);
        foreach (var line in b.Lines)
            db.Entry(line).Property(x => x.LineTotal).IsModified = true;

        var day = DateTime.SpecifyKind(DateTime.UtcNow.Date, DateTimeKind.Utc);
        var counter = await db.DailyInvoiceCounters.FirstOrDefaultAsync(x => x.DateUtc == day, ct);
        if (counter == null)
        {
            counter = new DailyInvoiceCounter { DateUtc = day, LastSequence = 0 };
            db.DailyInvoiceCounters.Add(counter);
        }

        counter.LastSequence++;
        b.InvoiceNumber = $"INV-{day:yyyyMMdd}-{counter.LastSequence:D4}";
        b.Status = BillStatus.Finalized;

        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
        return await GetDetailAsync(billId, ct);
    }

    public async Task<string?> BuildBillCsvAsync(int billId, CancellationToken ct = default)
    {
        var b = await db.Bills.AsNoTracking().Include(x => x.Lines).FirstOrDefaultAsync(x => x.Id == billId, ct);
        if (b == null) return null;

        BillingMath.RefreshLineTotals(b.Lines);
        var sub = BillingMath.Subtotal(b.Lines);
        var disc = BillingMath.DiscountAmount(sub, b.DiscountType, b.DiscountValue);
        var baseTax = BillingMath.TaxableBase(sub, disc);
        var tax = BillingMath.TaxAmount(baseTax, b.TaxRatePercent);
        var grand = BillingMath.GrandTotal(baseTax, tax);

        static string Esc(string? s)
        {
            if (string.IsNullOrEmpty(s)) return "";
            if (s.Contains('"') || s.Contains(',') || s.Contains('\n'))
                return "\"" + s.Replace("\"", "\"\"") + "\"";
            return s;
        }

        var lines = new List<string>
        {
            "Field,Value",
            $"InvoiceNumber,{Esc(b.InvoiceNumber ?? "DRAFT")}",
            $"Status,{b.Status}",
            $"CreatedAtUtc,{b.CreatedAtUtc:O}",
            $"Subtotal,{sub}",
            $"Discount,{disc}",
            $"Tax,{tax}",
            $"GrandTotal,{grand}",
            "",
            "LineId,Source,Description,Quantity,UnitPrice,LineTotal"
        };
        foreach (var l in b.Lines.OrderBy(x => x.Id))
        {
            lines.Add($"{l.Id},{l.Source},{Esc(l.Description)},{l.Quantity},{l.UnitPrice},{l.LineTotal}");
        }

        return string.Join("\n", lines);
    }

    private static BillDetailDto ToDetail(Bill b)
    {
        BillingMath.RefreshLineTotals(b.Lines);
        var sub = BillingMath.Subtotal(b.Lines);
        var disc = BillingMath.DiscountAmount(sub, b.DiscountType, b.DiscountValue);
        var baseTax = BillingMath.TaxableBase(sub, disc);
        var tax = BillingMath.TaxAmount(baseTax, b.TaxRatePercent);
        var grand = BillingMath.GrandTotal(baseTax, tax);

        return new BillDetailDto
        {
            Id = b.Id,
            InvoiceNumber = b.InvoiceNumber,
            CreatedAtUtc = b.CreatedAtUtc,
            Status = b.Status,
            DiscountType = b.DiscountType,
            DiscountValue = b.DiscountValue,
            TaxRatePercent = b.TaxRatePercent,
            Notes = b.Notes,
            Lines = b.Lines.OrderBy(x => x.Id).Select(l => new BillLineDto
            {
                Id = l.Id,
                Source = l.Source,
                CatalogItemId = l.CatalogItemId,
                Description = l.Description,
                Quantity = l.Quantity,
                UnitPrice = l.UnitPrice,
                LineTotal = l.LineTotal
            }).ToList(),
            Totals = new BillTotalsDto
            {
                Subtotal = sub,
                DiscountAmount = disc,
                TaxableBase = baseTax,
                TaxAmount = tax,
                GrandTotal = grand
            }
        };
    }
}

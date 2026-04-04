using BillGenerator.Api.Contracts;
using BillGenerator.Domain;
using BillGenerator.Domain.Enums;
using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BillGenerator.Api.Services;

/// <summary>
/// Aggregated reporting for finalized bills.
/// </summary>
public class ReportService(AppDbContext db)
{
    /// <summary>
    /// Sums all finalized bills whose <see cref="Domain.Entities.Bill.CreatedAtUtc"/> falls on the given UTC date.
    /// </summary>
    public async Task<DailySummaryDto> GetDailySummaryAsync(DateTime dateUtc, CancellationToken ct = default)
    {
        var day = dateUtc.Date;
        var next = day.AddDays(1);

        var bills = await db.Bills.AsNoTracking()
            .Include(b => b.Lines)
            .Where(b => b.Status == BillStatus.Finalized && b.CreatedAtUtc >= day && b.CreatedAtUtc < next)
            .ToListAsync(ct);

        decimal grossSub = 0, totalDisc = 0, totalTax = 0, netGrand = 0;

        foreach (var b in bills)
        {
            BillingMath.RefreshLineTotals(b.Lines);
            var sub = BillingMath.Subtotal(b.Lines);
            var disc = BillingMath.DiscountAmount(sub, b.DiscountType, b.DiscountValue);
            var baseTax = BillingMath.TaxableBase(sub, disc);
            var tax = BillingMath.TaxAmount(baseTax, b.TaxRatePercent);
            var grand = BillingMath.GrandTotal(baseTax, tax);

            grossSub += sub;
            totalDisc += disc;
            totalTax += tax;
            netGrand += grand;
        }

        return new DailySummaryDto
        {
            DateUtc = day,
            FinalizedBillCount = bills.Count,
            GrossSubtotal = Round2(grossSub),
            TotalDiscount = Round2(totalDisc),
            TotalTax = Round2(totalTax),
            NetGrandTotal = Round2(netGrand)
        };
    }

    private static decimal Round2(decimal d) => Math.Round(d, 2, MidpointRounding.AwayFromZero);
}

using BillGenerator.Domain.Enums;

namespace BillGenerator.Domain.Entities;

/// <summary>
/// An invoice/draft: header holds discount, tax snapshot, and optional notes.
/// </summary>
public class Bill
{
    public int Id { get; set; }

    /// <summary>Set when the bill is finalized; unique across the database.</summary>
    public string? InvoiceNumber { get; set; }

    /// <summary>UTC creation time (display in local zone on the client if needed).</summary>
    public DateTime CreatedAtUtc { get; set; }

    public BillStatus Status { get; set; } = BillStatus.Draft;

    public DiscountType DiscountType { get; set; } = DiscountType.None;

    /// <summary>Percent (0–100) when <see cref="DiscountType.Percent"/>; currency when <see cref="DiscountType.FixedAmount"/>.</summary>
    public decimal DiscountValue { get; set; }

    /// <summary>Tax rate captured on the bill so old invoices stay correct if defaults change.</summary>
    public decimal TaxRatePercent { get; set; }

    public string? Notes { get; set; }

    public ICollection<BillLine> Lines { get; set; } = new List<BillLine>();
}

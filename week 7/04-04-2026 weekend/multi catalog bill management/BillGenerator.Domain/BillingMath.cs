using BillGenerator.Domain.Entities;
using BillGenerator.Domain.Enums;

namespace BillGenerator.Domain;

/// <summary>
/// Single place for subtotal, discount, tax, and grand total so API and UI stay aligned.
/// Rule: tax applies to (subtotal − discount), then grand total = taxable base + tax.
/// </summary>
public static class BillingMath
{
    public static decimal LineTotal(int quantity, decimal unitPrice) =>
        Math.Round(quantity * unitPrice, 2, MidpointRounding.AwayFromZero);

    public static decimal Subtotal(IEnumerable<BillLine> lines) =>
        Math.Round(lines.Sum(l => l.LineTotal), 2, MidpointRounding.AwayFromZero);

    public static decimal DiscountAmount(decimal subtotal, DiscountType type, decimal value)
    {
        if (type == DiscountType.None || subtotal <= 0)
            return 0;

        if (type == DiscountType.Percent)
        {
            var pct = Math.Clamp(value, 0, 100);
            return Math.Round(subtotal * (pct / 100m), 2, MidpointRounding.AwayFromZero);
        }

        // Fixed: cannot discount more than subtotal
        return Math.Round(Math.Min(value, subtotal), 2, MidpointRounding.AwayFromZero);
    }

    public static decimal TaxableBase(decimal subtotal, decimal discountAmount) =>
        Math.Max(0, Math.Round(subtotal - discountAmount, 2, MidpointRounding.AwayFromZero));

    public static decimal TaxAmount(decimal taxableBase, decimal taxRatePercent)
    {
        if (taxableBase <= 0 || taxRatePercent <= 0)
            return 0;
        return Math.Round(taxableBase * (taxRatePercent / 100m), 2, MidpointRounding.AwayFromZero);
    }

    public static decimal GrandTotal(decimal taxableBase, decimal taxAmount) =>
        Math.Round(taxableBase + taxAmount, 2, MidpointRounding.AwayFromZero);

    /// <summary>Recomputes each line's LineTotal from quantity × unit price.</summary>
    public static void RefreshLineTotals(IEnumerable<BillLine> lines)
    {
        foreach (var line in lines)
            line.LineTotal = LineTotal(line.Quantity, line.UnitPrice);
    }
}

namespace BillGenerator.Domain.Enums;

/// <summary>
/// How the bill-level discount is applied to the line subtotal.
/// </summary>
public enum DiscountType
{
    None = 0,
    Percent = 1,
    FixedAmount = 2
}

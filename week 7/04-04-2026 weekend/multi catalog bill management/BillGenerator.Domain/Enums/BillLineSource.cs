namespace BillGenerator.Domain.Enums;

/// <summary>
/// Origin of a line: maps to catalog type or fully custom rows (e.g. custom donation amount).
/// </summary>
public enum BillLineSource
{
    Entrance = 0,
    Donation = 1,
    Selling = 2,
    Custom = 3
}

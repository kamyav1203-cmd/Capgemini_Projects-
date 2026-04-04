using BillGenerator.Domain.Enums;

namespace BillGenerator.Domain.Entities;

/// <summary>
/// One charge line: from a catalog item, or a custom description/price.
/// </summary>
public class BillLine
{
    public int Id { get; set; }

    public int BillId { get; set; }
    public Bill Bill { get; set; } = null!;

    public BillLineSource Source { get; set; }

    /// <summary>Optional link to catalog row when the line came from a catalog.</summary>
    public int? CatalogItemId { get; set; }
    public CatalogItem? CatalogItem { get; set; }

    public string Description { get; set; } = string.Empty;

    public int Quantity { get; set; } = 1;

    public decimal UnitPrice { get; set; }

    /// <summary>Stored for audit: typically Quantity * UnitPrice.</summary>
    public decimal LineTotal { get; set; }
}

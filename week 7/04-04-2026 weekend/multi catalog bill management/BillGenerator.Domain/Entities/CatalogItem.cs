using BillGenerator.Domain.Enums;

namespace BillGenerator.Domain.Entities;

/// <summary>
/// A row in one of the three catalogs (managed by staff; seeded with defaults).
/// </summary>
public class CatalogItem
{
    public int Id { get; set; }

    /// <summary>Entrance, donation preset, or selling price catalog.</summary>
    public CatalogType CatalogType { get; set; }

    public string Name { get; set; } = string.Empty;

    /// <summary>Default unit price when added to a bill (still editable per line).</summary>
    public decimal DefaultPrice { get; set; }

    public bool IsActive { get; set; } = true;

    public int SortOrder { get; set; }

    public ICollection<BillLine> BillLines { get; set; } = new List<BillLine>();
}

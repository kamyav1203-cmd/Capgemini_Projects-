namespace BillGenerator.Domain.Enums;

/// <summary>
/// Which catalog a <see cref="CatalogItem"/> belongs to (entrance, donation presets, or sellable goods).
/// </summary>
public enum CatalogType
{
    EntranceFee = 0,
    DonationPreset = 1,
    SellingPrice = 2
}

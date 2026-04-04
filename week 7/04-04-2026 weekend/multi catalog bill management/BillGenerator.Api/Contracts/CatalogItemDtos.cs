using System.ComponentModel.DataAnnotations;
using BillGenerator.Domain.Enums;

namespace BillGenerator.Api.Contracts;

/// <summary>API model for a catalog row.</summary>
public class CatalogItemDto
{
    public int Id { get; set; }
    public CatalogType CatalogType { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal DefaultPrice { get; set; }
    public bool IsActive { get; set; }
    public int SortOrder { get; set; }
}

public class CreateCatalogItemRequest
{
    [Required]
    public CatalogType CatalogType { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [Range(0, 999_999_999)]
    public decimal DefaultPrice { get; set; }

    public int SortOrder { get; set; }
}

public class UpdateCatalogItemRequest
{
    [MaxLength(200)]
    public string? Name { get; set; }
    public decimal? DefaultPrice { get; set; }
    public bool? IsActive { get; set; }
    public int? SortOrder { get; set; }
}

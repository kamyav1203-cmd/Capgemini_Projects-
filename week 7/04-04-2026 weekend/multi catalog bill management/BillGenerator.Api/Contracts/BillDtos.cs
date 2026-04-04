using System.ComponentModel.DataAnnotations;
using BillGenerator.Domain.Enums;

namespace BillGenerator.Api.Contracts;

/// <summary>Computed totals returned with bill detail (matches <see cref="Domain.BillingMath"/>).</summary>
public class BillTotalsDto
{
    public decimal Subtotal { get; set; }
    public decimal DiscountAmount { get; set; }
    public decimal TaxableBase { get; set; }
    public decimal TaxAmount { get; set; }
    public decimal GrandTotal { get; set; }
}

public class BillLineDto
{
    public int Id { get; set; }
    public BillLineSource Source { get; set; }
    public int? CatalogItemId { get; set; }
    public string Description { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal LineTotal { get; set; }
}

public class BillDetailDto
{
    public int Id { get; set; }
    public string? InvoiceNumber { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public BillStatus Status { get; set; }
    public DiscountType DiscountType { get; set; }
    public decimal DiscountValue { get; set; }
    public decimal TaxRatePercent { get; set; }
    public string? Notes { get; set; }
    public List<BillLineDto> Lines { get; set; } = new();
    public BillTotalsDto Totals { get; set; } = new();
}

public class BillSummaryDto
{
    public int Id { get; set; }
    public string? InvoiceNumber { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public BillStatus Status { get; set; }
    public decimal GrandTotal { get; set; }
}

public class CreateBillRequest
{
    /// <summary>Optional override; otherwise server default from configuration.</summary>
    public decimal? TaxRatePercent { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}

public class UpdateBillRequest
{
    public DiscountType? DiscountType { get; set; }
    public decimal? DiscountValue { get; set; }
    public decimal? TaxRatePercent { get; set; }

    [MaxLength(2000)]
    public string? Notes { get; set; }
}

public class AddBillLineRequest
{
    /// <summary>Required for catalog lines; omit for custom.</summary>
    public int? CatalogItemId { get; set; }

    public BillLineSource Source { get; set; }

    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(1, 1_000_000)]
    public int Quantity { get; set; } = 1;

    /// <summary>When adding from catalog, omit to use the catalog default price.</summary>
    public decimal? UnitPrice { get; set; }
}

public class UpdateBillLineRequest
{
    [MaxLength(500)]
    public string? Description { get; set; }

    [Range(1, 1_000_000)]
    public int? Quantity { get; set; }

    [Range(0, 999_999_999)]
    public decimal? UnitPrice { get; set; }
}

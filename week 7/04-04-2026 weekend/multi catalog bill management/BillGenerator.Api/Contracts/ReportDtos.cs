namespace BillGenerator.Api.Contracts;

/// <summary>Aggregates for finalized bills on a single UTC calendar day.</summary>
public class DailySummaryDto
{
    public DateTime DateUtc { get; set; }
    public int FinalizedBillCount { get; set; }
    public decimal GrossSubtotal { get; set; }
    public decimal TotalDiscount { get; set; }
    public decimal TotalTax { get; set; }
    public decimal NetGrandTotal { get; set; }
}

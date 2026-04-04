namespace BillGenerator.Domain.Entities;

/// <summary>
/// One row per calendar day (UTC date) for monotonic invoice sequence: INV-yyyyMMdd-####.
/// </summary>
public class DailyInvoiceCounter
{
    /// <summary>Date part only in UTC (midnight).</summary>
    public DateTime DateUtc { get; set; }

    /// <summary>Last sequence number issued for that day.</summary>
    public int LastSequence { get; set; }
}

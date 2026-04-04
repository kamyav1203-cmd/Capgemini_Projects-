using BillGenerator.Api.Contracts;
using BillGenerator.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace BillGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController(ReportService reportService) : ControllerBase
{
    /// <summary>Daily sales summary for finalized bills (UTC day boundary).</summary>
    [HttpGet("daily-summary")]
    public async Task<ActionResult<DailySummaryDto>> DailySummary([FromQuery] DateTime? dateUtc, CancellationToken ct)
    {
        var anchor = dateUtc ?? DateTime.UtcNow;
        var day = DateTime.SpecifyKind(anchor.Date, DateTimeKind.Utc);
        var summary = await reportService.GetDailySummaryAsync(day, ct);
        return Ok(summary);
    }
}

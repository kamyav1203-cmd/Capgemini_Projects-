using System.Text;
using BillGenerator.Api.Contracts;
using BillGenerator.Api.Services;
using BillGenerator.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BillGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BillsController(BillService billService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<BillSummaryDto>>> List(
        [FromQuery] DateTime? fromUtc,
        [FromQuery] DateTime? toUtc,
        [FromQuery] BillStatus? status,
        [FromQuery] string? search,
        CancellationToken ct)
    {
        var list = await billService.ListAsync(fromUtc, toUtc, status, search, ct);
        return Ok(list);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BillDetailDto>> Get(int id, CancellationToken ct)
    {
        var bill = await billService.GetDetailAsync(id, ct);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpPost]
    public async Task<ActionResult<BillDetailDto>> Create([FromBody] CreateBillRequest? body, CancellationToken ct)
    {
        body ??= new CreateBillRequest();
        var bill = await billService.CreateDraftAsync(body, ct);
        return CreatedAtAction(nameof(Get), new { id = bill.Id }, bill);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<BillDetailDto>> Patch(int id, [FromBody] UpdateBillRequest body, CancellationToken ct)
    {
        var bill = await billService.UpdateBillAsync(id, body, ct);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var ok = await billService.DeleteDraftAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }

    [HttpPost("{id:int}/lines")]
    public async Task<ActionResult<BillDetailDto>> AddLine(int id, [FromBody] AddBillLineRequest body, CancellationToken ct)
    {
        try
        {
            var bill = await billService.AddLineAsync(id, body, ct);
            return bill == null ? NotFound() : Ok(bill);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPatch("{billId:int}/lines/{lineId:int}")]
    public async Task<ActionResult<BillDetailDto>> UpdateLine(int billId, int lineId, [FromBody] UpdateBillLineRequest body, CancellationToken ct)
    {
        var bill = await billService.UpdateLineAsync(billId, lineId, body, ct);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpDelete("{billId:int}/lines/{lineId:int}")]
    public async Task<ActionResult<BillDetailDto>> DeleteLine(int billId, int lineId, CancellationToken ct)
    {
        var bill = await billService.DeleteLineAsync(billId, lineId, ct);
        return bill == null ? NotFound() : Ok(bill);
    }

    [HttpPost("{id:int}/finalize")]
    public async Task<ActionResult<BillDetailDto>> Finalize(int id, CancellationToken ct)
    {
        var bill = await billService.FinalizeAsync(id, ct);
        return bill == null ? NotFound() : Ok(bill);
    }

    /// <summary>Download a single bill as CSV (works for draft or finalized).</summary>
    [HttpGet("{id:int}/export.csv")]
    public async Task<IActionResult> ExportCsv(int id, CancellationToken ct)
    {
        var csv = await billService.BuildBillCsvAsync(id, ct);
        if (csv == null) return NotFound();
        var bytes = Encoding.UTF8.GetBytes(csv);
        return File(bytes, "text/csv", $"bill-{id}.csv");
    }
}

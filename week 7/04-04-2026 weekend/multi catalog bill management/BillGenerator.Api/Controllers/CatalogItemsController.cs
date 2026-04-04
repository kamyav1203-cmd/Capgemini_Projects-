using BillGenerator.Api.Contracts;
using BillGenerator.Api.Services;
using BillGenerator.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace BillGenerator.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CatalogItemsController(CatalogService catalogService) : ControllerBase
{
    /// <summary>List catalog items, optionally filtered by catalog type.</summary>
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<CatalogItemDto>>> List([FromQuery] CatalogType? catalogType, CancellationToken ct)
    {
        var items = await catalogService.ListAsync(catalogType, ct);
        return Ok(items);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CatalogItemDto>> Get(int id, CancellationToken ct)
    {
        var item = await catalogService.GetAsync(id, ct);
        return item == null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<CatalogItemDto>> Create([FromBody] CreateCatalogItemRequest body, CancellationToken ct)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);
        var created = await catalogService.CreateAsync(body, ct);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPatch("{id:int}")]
    public async Task<ActionResult<CatalogItemDto>> Patch(int id, [FromBody] UpdateCatalogItemRequest body, CancellationToken ct)
    {
        var updated = await catalogService.UpdateAsync(id, body, ct);
        return updated == null ? NotFound() : Ok(updated);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        var ok = await catalogService.DeleteAsync(id, ct);
        return ok ? NoContent() : NotFound();
    }
}

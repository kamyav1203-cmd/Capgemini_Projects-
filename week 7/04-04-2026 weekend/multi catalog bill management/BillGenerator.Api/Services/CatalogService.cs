using BillGenerator.Api.Contracts;
using BillGenerator.Domain.Entities;
using BillGenerator.Domain.Enums;
using BillGenerator.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace BillGenerator.Api.Services;

/// <summary>
/// CRUD for catalog items used when building bills.
/// </summary>
public class CatalogService(AppDbContext db)
{
    public async Task<IReadOnlyList<CatalogItemDto>> ListAsync(CatalogType? catalogType, CancellationToken ct = default)
    {
        var q = db.CatalogItems.AsNoTracking().AsQueryable();
        if (catalogType.HasValue)
            q = q.Where(x => x.CatalogType == catalogType.Value);
        var list = await q.OrderBy(x => x.CatalogType).ThenBy(x => x.SortOrder).ThenBy(x => x.Name).ToListAsync(ct);
        return list.Select(Map).ToList();
    }

    public async Task<CatalogItemDto?> GetAsync(int id, CancellationToken ct = default)
    {
        var e = await db.CatalogItems.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        return e == null ? null : Map(e);
    }

    public async Task<CatalogItemDto> CreateAsync(CreateCatalogItemRequest req, CancellationToken ct = default)
    {
        var entity = new CatalogItem
        {
            CatalogType = req.CatalogType,
            Name = req.Name.Trim(),
            DefaultPrice = req.DefaultPrice,
            IsActive = true,
            SortOrder = req.SortOrder
        };
        db.CatalogItems.Add(entity);
        await db.SaveChangesAsync(ct);
        return Map(entity);
    }

    public async Task<CatalogItemDto?> UpdateAsync(int id, UpdateCatalogItemRequest req, CancellationToken ct = default)
    {
        var entity = await db.CatalogItems.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity == null) return null;

        if (req.Name != null) entity.Name = req.Name.Trim();
        if (req.DefaultPrice.HasValue) entity.DefaultPrice = req.DefaultPrice.Value;
        if (req.IsActive.HasValue) entity.IsActive = req.IsActive.Value;
        if (req.SortOrder.HasValue) entity.SortOrder = req.SortOrder.Value;

        await db.SaveChangesAsync(ct);
        return Map(entity);
    }

    /// <summary>
    /// Removes the item if no bill lines reference it; otherwise deactivates it.
    /// </summary>
    public async Task<bool> DeleteAsync(int id, CancellationToken ct = default)
    {
        var entity = await db.CatalogItems.Include(x => x.BillLines).FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity == null) return false;

        if (entity.BillLines.Count > 0)
        {
            entity.IsActive = false;
            await db.SaveChangesAsync(ct);
            return true;
        }

        db.CatalogItems.Remove(entity);
        await db.SaveChangesAsync(ct);
        return true;
    }

    private static CatalogItemDto Map(CatalogItem x) => new()
    {
        Id = x.Id,
        CatalogType = x.CatalogType,
        Name = x.Name,
        DefaultPrice = x.DefaultPrice,
        IsActive = x.IsActive,
        SortOrder = x.SortOrder
    };
}

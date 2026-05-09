using FoodOrdering.Api.Data;
using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Services;

public class FoodService(ApplicationDbContext dbContext, IWebHostEnvironment environment) : IFoodService
{
    public async Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken)
        => await dbContext.Categories.AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new CategoryDto(c.Id, c.Name, c.Description))
            .ToListAsync(cancellationToken);

    public async Task<CategoryDto> CreateCategoryAsync(CategoryUpsertDto dto, CancellationToken cancellationToken)
    {
        var category = new Category { Name = dto.Name.Trim(), Description = dto.Description };
        await dbContext.Categories.AddAsync(category, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task<CategoryDto> UpdateCategoryAsync(int id, CategoryUpsertDto dto, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories.FindAsync([id], cancellationToken) ?? throw new KeyNotFoundException("Category not found.");
        category.Name = dto.Name.Trim();
        category.Description = dto.Description;
        await dbContext.SaveChangesAsync(cancellationToken);
        return new CategoryDto(category.Id, category.Name, category.Description);
    }

    public async Task DeleteCategoryAsync(int id, CancellationToken cancellationToken)
    {
        var category = await dbContext.Categories.Include(c => c.FoodItems).FirstOrDefaultAsync(c => c.Id == id, cancellationToken)
                       ?? throw new KeyNotFoundException("Category not found.");
        if (category.FoodItems.Count > 0)
        {
            throw new InvalidOperationException("Cannot delete a category that still has food items.");
        }

        dbContext.Categories.Remove(category);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<FoodItemDto>> GetFoodItemsAsync(int? categoryId, decimal? maxPrice, string? search, CancellationToken cancellationToken)
    {
        var query = dbContext.FoodItems.AsNoTracking().Include(f => f.Category).Where(f => f.IsAvailable);
        if (categoryId.HasValue)
        {
            query = query.Where(f => f.CategoryId == categoryId.Value);
        }
        if (maxPrice.HasValue)
        {
            query = query.Where(f => f.Price <= maxPrice.Value);
        }
        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(f => f.Name.Contains(search) || f.Description.Contains(search));
        }

        return await query.OrderBy(f => f.Name).Select(f => ToDto(f)).ToListAsync(cancellationToken);
    }

    public async Task<FoodItemDto> GetFoodItemAsync(int id, CancellationToken cancellationToken)
    {
        var food = await dbContext.FoodItems.AsNoTracking().Include(f => f.Category).FirstOrDefaultAsync(f => f.Id == id, cancellationToken)
                   ?? throw new KeyNotFoundException("Food item not found.");
        return ToDto(food);
    }

    public async Task<FoodItemDto> CreateFoodItemAsync(FoodItemUpsertDto dto, CancellationToken cancellationToken)
    {
        await EnsureCategoryExistsAsync(dto.CategoryId, cancellationToken);
        var food = new FoodItem
        {
            Name = dto.Name.Trim(),
            Description = dto.Description.Trim(),
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            CategoryId = dto.CategoryId,
            IsAvailable = dto.IsAvailable
        };
        await dbContext.FoodItems.AddAsync(food, cancellationToken);
        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetFoodItemAsync(food.Id, cancellationToken);
    }

    public async Task<FoodItemDto> UpdateFoodItemAsync(int id, FoodItemUpsertDto dto, CancellationToken cancellationToken)
    {
        await EnsureCategoryExistsAsync(dto.CategoryId, cancellationToken);
        var food = await dbContext.FoodItems.FindAsync([id], cancellationToken) ?? throw new KeyNotFoundException("Food item not found.");
        food.Name = dto.Name.Trim();
        food.Description = dto.Description.Trim();
        food.Price = dto.Price;
        food.ImageUrl = dto.ImageUrl;
        food.CategoryId = dto.CategoryId;
        food.IsAvailable = dto.IsAvailable;
        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetFoodItemAsync(food.Id, cancellationToken);
    }

    public async Task DeleteFoodItemAsync(int id, CancellationToken cancellationToken)
    {
        var food = await dbContext.FoodItems.FindAsync([id], cancellationToken) ?? throw new KeyNotFoundException("Food item not found.");
        dbContext.FoodItems.Remove(food);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task<string> SaveImageAsync(IFormFile file, HttpRequest request, CancellationToken cancellationToken)
    {
        if (file.Length == 0 || !file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException("Only non-empty image files are allowed.");
        }

        var uploadsPath = Path.Combine(environment.WebRootPath ?? "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);
        var fileName = $"{Guid.NewGuid():N}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(uploadsPath, fileName);
        await using var stream = File.Create(filePath);
        await file.CopyToAsync(stream, cancellationToken);
        return $"{request.Scheme}://{request.Host}/uploads/{fileName}";
    }

    private async Task EnsureCategoryExistsAsync(int categoryId, CancellationToken cancellationToken)
    {
        if (!await dbContext.Categories.AnyAsync(c => c.Id == categoryId, cancellationToken))
        {
            throw new KeyNotFoundException("Category not found.");
        }
    }

    private static FoodItemDto ToDto(FoodItem f)
        => new(f.Id, f.Name, f.Description, f.Price, f.ImageUrl, f.CategoryId, f.Category?.Name ?? string.Empty, f.IsAvailable);
}

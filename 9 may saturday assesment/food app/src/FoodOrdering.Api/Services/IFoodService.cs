using FoodOrdering.Api.Dtos;

namespace FoodOrdering.Api.Services;

public interface IFoodService
{
    Task<IReadOnlyList<CategoryDto>> GetCategoriesAsync(CancellationToken cancellationToken);
    Task<CategoryDto> CreateCategoryAsync(CategoryUpsertDto dto, CancellationToken cancellationToken);
    Task<CategoryDto> UpdateCategoryAsync(int id, CategoryUpsertDto dto, CancellationToken cancellationToken);
    Task DeleteCategoryAsync(int id, CancellationToken cancellationToken);
    Task<IReadOnlyList<FoodItemDto>> GetFoodItemsAsync(int? categoryId, decimal? maxPrice, string? search, CancellationToken cancellationToken);
    Task<FoodItemDto> GetFoodItemAsync(int id, CancellationToken cancellationToken);
    Task<FoodItemDto> CreateFoodItemAsync(FoodItemUpsertDto dto, CancellationToken cancellationToken);
    Task<FoodItemDto> UpdateFoodItemAsync(int id, FoodItemUpsertDto dto, CancellationToken cancellationToken);
    Task DeleteFoodItemAsync(int id, CancellationToken cancellationToken);
    Task<string> SaveImageAsync(IFormFile file, HttpRequest request, CancellationToken cancellationToken);
}

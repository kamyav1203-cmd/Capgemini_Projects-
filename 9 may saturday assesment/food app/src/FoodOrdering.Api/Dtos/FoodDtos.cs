using System.ComponentModel.DataAnnotations;

namespace FoodOrdering.Api.Dtos;

public record CategoryDto(int Id, string Name, string? Description);
public record CategoryUpsertDto([Required, MaxLength(80)] string Name, [MaxLength(300)] string? Description);

public record FoodItemDto(
    int Id,
    string Name,
    string Description,
    decimal Price,
    string? ImageUrl,
    int CategoryId,
    string CategoryName,
    bool IsAvailable);

public record FoodItemUpsertDto(
    [Required, MaxLength(120)] string Name,
    [Required, MaxLength(500)] string Description,
    [Range(0.01, 100000)] decimal Price,
    string? ImageUrl,
    [Range(1, int.MaxValue)] int CategoryId,
    bool IsAvailable);

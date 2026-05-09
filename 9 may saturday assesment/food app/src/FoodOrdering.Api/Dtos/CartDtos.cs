using System.ComponentModel.DataAnnotations;

namespace FoodOrdering.Api.Dtos;

public record CartItemDto(int Id, int FoodItemId, string FoodName, decimal UnitPrice, string? ImageUrl, int Quantity, decimal LineTotal);
public record CartDto(IReadOnlyList<CartItemDto> Items, decimal Total);
public record AddCartItemRequest([Range(1, int.MaxValue)] int FoodItemId, [Range(1, 50)] int Quantity);
public record UpdateCartItemRequest([Range(1, 50)] int Quantity);

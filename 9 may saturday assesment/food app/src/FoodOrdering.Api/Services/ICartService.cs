using FoodOrdering.Api.Dtos;

namespace FoodOrdering.Api.Services;

public interface ICartService
{
    Task<CartDto> GetCartAsync(string userId, CancellationToken cancellationToken);
    Task<CartDto> AddItemAsync(string userId, AddCartItemRequest request, CancellationToken cancellationToken);
    Task<CartDto> UpdateItemAsync(string userId, int cartItemId, UpdateCartItemRequest request, CancellationToken cancellationToken);
    Task RemoveItemAsync(string userId, int cartItemId, CancellationToken cancellationToken);
    Task ClearCartAsync(string userId, CancellationToken cancellationToken);
}

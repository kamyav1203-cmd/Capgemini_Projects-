using FoodOrdering.Api.Data;
using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Services;

public class CartService(ApplicationDbContext dbContext) : ICartService
{
    public async Task<CartDto> GetCartAsync(string userId, CancellationToken cancellationToken)
    {
        var items = await dbContext.CartItems.AsNoTracking()
            .Include(c => c.FoodItem)
            .Where(c => c.UserId == userId)
            .OrderBy(c => c.Id)
            .Select(c => new CartItemDto(c.Id, c.FoodItemId, c.FoodItem!.Name, c.FoodItem.Price, c.FoodItem.ImageUrl, c.Quantity, c.Quantity * c.FoodItem.Price))
            .ToListAsync(cancellationToken);

        return new CartDto(items, items.Sum(i => i.LineTotal));
    }

    public async Task<CartDto> AddItemAsync(string userId, AddCartItemRequest request, CancellationToken cancellationToken)
    {
        var food = await dbContext.FoodItems.FirstOrDefaultAsync(f => f.Id == request.FoodItemId && f.IsAvailable, cancellationToken)
                   ?? throw new KeyNotFoundException("Food item not found.");
        var cartItem = await dbContext.CartItems.FirstOrDefaultAsync(c => c.UserId == userId && c.FoodItemId == food.Id, cancellationToken);
        if (cartItem is null)
        {
            await dbContext.CartItems.AddAsync(new CartItem { UserId = userId, FoodItemId = food.Id, Quantity = request.Quantity }, cancellationToken);
        }
        else
        {
            cartItem.Quantity += request.Quantity;
        }

        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetCartAsync(userId, cancellationToken);
    }

    public async Task<CartDto> UpdateItemAsync(string userId, int cartItemId, UpdateCartItemRequest request, CancellationToken cancellationToken)
    {
        var cartItem = await dbContext.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId, cancellationToken)
                       ?? throw new KeyNotFoundException("Cart item not found.");
        cartItem.Quantity = request.Quantity;
        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetCartAsync(userId, cancellationToken);
    }

    public async Task RemoveItemAsync(string userId, int cartItemId, CancellationToken cancellationToken)
    {
        var cartItem = await dbContext.CartItems.FirstOrDefaultAsync(c => c.Id == cartItemId && c.UserId == userId, cancellationToken)
                       ?? throw new KeyNotFoundException("Cart item not found.");
        dbContext.CartItems.Remove(cartItem);
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ClearCartAsync(string userId, CancellationToken cancellationToken)
    {
        var items = await dbContext.CartItems.Where(c => c.UserId == userId).ToListAsync(cancellationToken);
        dbContext.CartItems.RemoveRange(items);
        await dbContext.SaveChangesAsync(cancellationToken);
    }
}

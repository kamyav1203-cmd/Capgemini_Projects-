using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrdering.Api.Controllers;

[ApiController]
[Authorize(Roles = "Customer,Admin")]
[Route("api/[controller]")]
public class CartController(ICartService cartService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CartDto>> GetCart(CancellationToken cancellationToken)
        => Ok(await cartService.GetCartAsync(User.GetUserId(), cancellationToken));

    [HttpPost]
    public async Task<ActionResult<CartDto>> AddItem(AddCartItemRequest request, CancellationToken cancellationToken)
        => Ok(await cartService.AddItemAsync(User.GetUserId(), request, cancellationToken));

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartDto>> UpdateItem(int cartItemId, UpdateCartItemRequest request, CancellationToken cancellationToken)
        => Ok(await cartService.UpdateItemAsync(User.GetUserId(), cartItemId, request, cancellationToken));

    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveItem(int cartItemId, CancellationToken cancellationToken)
    {
        await cartService.RemoveItemAsync(User.GetUserId(), cartItemId, cancellationToken);
        return NoContent();
    }

    [HttpDelete]
    public async Task<IActionResult> Clear(CancellationToken cancellationToken)
    {
        await cartService.ClearCartAsync(User.GetUserId(), cancellationToken);
        return NoContent();
    }
}

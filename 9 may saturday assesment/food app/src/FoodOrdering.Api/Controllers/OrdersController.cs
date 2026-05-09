using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FoodOrdering.Api.Controllers;

[ApiController]
[Authorize(Roles = "Customer,Admin")]
[Route("api/[controller]")]
public class OrdersController(IOrderService orderService) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<OrderDto>> Checkout(CheckoutRequest request, CancellationToken cancellationToken)
        => Ok(await orderService.PlaceOrderAsync(User.GetUserId(), request, cancellationToken));

    [HttpGet("my")]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> MyOrders(CancellationToken cancellationToken)
        => Ok(await orderService.GetUserOrdersAsync(User.GetUserId(), cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<OrderDto>>> AllOrders(CancellationToken cancellationToken)
        => Ok(await orderService.GetAllOrdersAsync(cancellationToken));

    [Authorize(Roles = "Admin")]
    [HttpPut("{orderId:int}/status")]
    public async Task<ActionResult<OrderDto>> UpdateStatus(int orderId, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
        => Ok(await orderService.UpdateStatusAsync(orderId, request, cancellationToken));

    [HttpGet("{orderId:int}/invoice")]
    public async Task<IActionResult> Invoice(int orderId, CancellationToken cancellationToken)
    {
        var isAdmin = User.IsInRole("Admin");
        var html = await orderService.GenerateInvoiceHtmlAsync(orderId, User.GetUserId(), isAdmin, cancellationToken);
        return Content(html, "text/html");
    }
}

using FoodOrdering.Api.Dtos;

namespace FoodOrdering.Api.Services;

public interface IOrderService
{
    Task<OrderDto> PlaceOrderAsync(string userId, CheckoutRequest request, CancellationToken cancellationToken);
    Task<IReadOnlyList<OrderDto>> GetUserOrdersAsync(string userId, CancellationToken cancellationToken);
    Task<IReadOnlyList<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken);
    Task<OrderDto> UpdateStatusAsync(int orderId, UpdateOrderStatusRequest request, CancellationToken cancellationToken);
    Task<string> GenerateInvoiceHtmlAsync(int orderId, string userId, bool isAdmin, CancellationToken cancellationToken);
}

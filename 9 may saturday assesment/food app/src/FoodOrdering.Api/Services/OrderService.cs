using System.Text;
using FoodOrdering.Api.Data;
using FoodOrdering.Api.Dtos;
using FoodOrdering.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FoodOrdering.Api.Services;

public class OrderService(ApplicationDbContext dbContext, ILogger<OrderService> logger) : IOrderService
{
    public async Task<OrderDto> PlaceOrderAsync(string userId, CheckoutRequest request, CancellationToken cancellationToken)
    {
        var cartItems = await dbContext.CartItems
            .Include(c => c.FoodItem)
            .Where(c => c.UserId == userId)
            .ToListAsync(cancellationToken);

        if (cartItems.Count == 0)
        {
            throw new InvalidOperationException("Cart is empty.");
        }

        await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
        var order = new Order
        {
            UserId = userId,
            DeliveryAddress = request.DeliveryAddress,
            PhoneNumber = request.PhoneNumber,
            TotalAmount = cartItems.Sum(c => c.Quantity * c.FoodItem!.Price),
            OrderDetails = cartItems.Select(c => new OrderDetail
            {
                FoodItemId = c.FoodItemId,
                Quantity = c.Quantity,
                UnitPrice = c.FoodItem!.Price
            }).ToList()
        };

        await dbContext.Orders.AddAsync(order, cancellationToken);
        dbContext.CartItems.RemoveRange(cartItems);
        await dbContext.SaveChangesAsync(cancellationToken);
        await transaction.CommitAsync(cancellationToken);
        logger.LogInformation("Created order {OrderId} for user {UserId}", order.Id, userId);
        return await GetOrderAsync(order.Id, cancellationToken);
    }

    public async Task<IReadOnlyList<OrderDto>> GetUserOrdersAsync(string userId, CancellationToken cancellationToken)
        => await ProjectOrders(dbContext.Orders.AsNoTracking().Where(o => o.UserId == userId))
            .ToListAsync(cancellationToken);

    public async Task<IReadOnlyList<OrderDto>> GetAllOrdersAsync(CancellationToken cancellationToken)
        => await ProjectOrders(dbContext.Orders.AsNoTracking()).ToListAsync(cancellationToken);

    public async Task<OrderDto> UpdateStatusAsync(int orderId, UpdateOrderStatusRequest request, CancellationToken cancellationToken)
    {
        var order = await dbContext.Orders.FindAsync([orderId], cancellationToken) ?? throw new KeyNotFoundException("Order not found.");
        order.Status = request.Status;
        await dbContext.SaveChangesAsync(cancellationToken);
        return await GetOrderAsync(orderId, cancellationToken);
    }

    public async Task<string> GenerateInvoiceHtmlAsync(int orderId, string userId, bool isAdmin, CancellationToken cancellationToken)
    {
        var order = await dbContext.Orders.AsNoTracking()
            .Include(o => o.User)
            .Include(o => o.OrderDetails).ThenInclude(od => od.FoodItem)
            .FirstOrDefaultAsync(o => o.Id == orderId && (isAdmin || o.UserId == userId), cancellationToken)
            ?? throw new KeyNotFoundException("Order not found.");

        var rows = new StringBuilder();
        foreach (var item in order.OrderDetails)
        {
            rows.Append($"<tr><td>{item.FoodItem!.Name}</td><td>{item.Quantity}</td><td>{item.UnitPrice:C}</td><td>{item.Quantity * item.UnitPrice:C}</td></tr>");
        }

        return "<html><head>" +
               $"<title>Invoice #{order.Id}</title>" +
               "<style>body{font-family:Arial;margin:32px}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}</style>" +
               "</head><body>" +
               $"<h1>Invoice #{order.Id}</h1><p>Customer: {order.User?.FullName}</p><p>Status: {order.Status}</p><p>Date: {order.CreatedAtUtc:u}</p>" +
               $"<table><thead><tr><th>Item</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>{rows}</tbody></table>" +
               $"<h2>Total: {order.TotalAmount:C}</h2></body></html>";
    }

    private async Task<OrderDto> GetOrderAsync(int id, CancellationToken cancellationToken)
        => await ProjectOrders(dbContext.Orders.AsNoTracking().Where(o => o.Id == id)).FirstAsync(cancellationToken);

    private static IQueryable<OrderDto> ProjectOrders(IQueryable<Order> query)
        => query
            .Include(o => o.OrderDetails).ThenInclude(od => od.FoodItem)
            .OrderByDescending(o => o.CreatedAtUtc)
            .Select(o => new OrderDto(
                o.Id,
                o.Status,
                o.TotalAmount,
                o.DeliveryAddress,
                o.PhoneNumber,
                o.CreatedAtUtc,
                o.OrderDetails.Select(od => new OrderDetailDto(od.FoodItemId, od.FoodItem!.Name, od.Quantity, od.UnitPrice, od.Quantity * od.UnitPrice)).ToList()));
}

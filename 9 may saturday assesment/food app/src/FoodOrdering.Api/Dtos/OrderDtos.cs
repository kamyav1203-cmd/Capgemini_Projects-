using System.ComponentModel.DataAnnotations;
using FoodOrdering.Api.Models;

namespace FoodOrdering.Api.Dtos;

public record CheckoutRequest([Required, MaxLength(500)] string DeliveryAddress, [Required, Phone] string PhoneNumber);
public record OrderDetailDto(int FoodItemId, string FoodName, int Quantity, decimal UnitPrice, decimal LineTotal);
public record OrderDto(int Id, OrderStatus Status, decimal TotalAmount, string DeliveryAddress, string PhoneNumber, DateTime CreatedAtUtc, IReadOnlyList<OrderDetailDto> Items);
public record UpdateOrderStatusRequest(OrderStatus Status);

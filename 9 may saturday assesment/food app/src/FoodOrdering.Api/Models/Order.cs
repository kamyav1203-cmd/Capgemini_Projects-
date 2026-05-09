using System.ComponentModel.DataAnnotations.Schema;

namespace FoodOrdering.Api.Models;

public enum OrderStatus
{
    Pending = 0,
    Preparing = 1,
    Delivered = 2
}

public class Order
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public ApplicationUser? User { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public string DeliveryAddress { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public ICollection<OrderDetail> OrderDetails { get; set; } = new List<OrderDetail>();
}

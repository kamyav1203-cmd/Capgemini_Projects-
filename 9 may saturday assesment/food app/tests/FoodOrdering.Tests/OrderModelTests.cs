using FoodOrdering.Api.Models;

namespace FoodOrdering.Tests;

public class OrderModelTests
{
    [Fact]
    public void Order_total_matches_sum_of_order_details()
    {
        var order = new Order
        {
            TotalAmount = 448,
            OrderDetails =
            {
                new OrderDetail { Quantity = 1, UnitPrice = 299 },
                new OrderDetail { Quantity = 1, UnitPrice = 149 }
            }
        };

        var calculatedTotal = order.OrderDetails.Sum(item => item.Quantity * item.UnitPrice);

        Assert.Equal(order.TotalAmount, calculatedTotal);
    }

    [Theory]
    [InlineData(OrderStatus.Pending)]
    [InlineData(OrderStatus.Preparing)]
    [InlineData(OrderStatus.Delivered)]
    public void Supported_order_statuses_are_defined(OrderStatus status)
    {
        Assert.True(Enum.IsDefined(status));
    }
}

OrderProcessor order = new OnlineOrder();
order.OrderId = "ORD-001";
order.Amount = 299.99m;

order.DisplayOrderDetails();
order.ProcessPayment();
order.GenerateInvoice();
order.SendNotification();

abstract class OrderProcessor
{
    public string OrderId { get; set; }
    public decimal Amount { get; set; }

    public abstract void ProcessPayment();
    public abstract void GenerateInvoice();
    public abstract void SendNotification();

    public void DisplayOrderDetails()
    {
        Console.WriteLine("=== Order Details ===");
        Console.WriteLine($"Order ID: {OrderId}");
        Console.WriteLine($"Amount: ${Amount:F2}");
        Console.WriteLine();
    }
}

class OnlineOrder : OrderProcessor
{
    public override void ProcessPayment()
    {
        Console.WriteLine("Processing online payment...");
        Console.WriteLine($"Payment of ${Amount:F2} processed successfully via online payment gateway.");
        Console.WriteLine();
    }

    public override void GenerateInvoice()
    {
        Console.WriteLine("Generating digital invoice...");
        Console.WriteLine($"Digital invoice created for Order ID: {OrderId}");
        Console.WriteLine($"Invoice Amount: ${Amount:F2}");
        Console.WriteLine();
    }

    public override void SendNotification()
    {
        Console.WriteLine("Sending email notification...");
        Console.WriteLine($"Email sent successfully for Order ID: {OrderId}");
        Console.WriteLine("Notification includes order confirmation and invoice details.");
        Console.WriteLine();
    }
}

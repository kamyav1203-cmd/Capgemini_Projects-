
delegate void NotificationSender(string message);
class Notifiers
{
    public void SendEmail(string message)
    {
        Console.WriteLine($"Email sent: {message}");
    }

    public void SendSMS(string message)
    {
        Console.WriteLine($"SMS sent: {message}");
    }

    public void SendPushNotification(string message)
    {
        Console.WriteLine($"Push Notification sent: {message}");
    }
}
class NotificationManager
{
    public void NotifyUser(string message, NotificationSender sender)
    {
        sender(message);
    }
}
class Program
{
    static void Main()
    {
        NotificationManager manager = new NotificationManager();
        Notifiers notifiers = new Notifiers();

        Console.WriteLine("Notification System ");

        manager.NotifyUser("Welcome to our service!", notifiers.SendEmail);
        manager.NotifyUser("Your order has been shipped.", notifiers.SendSMS);
        manager.NotifyUser("You have a new message.", notifiers.SendPushNotification);
    }
}

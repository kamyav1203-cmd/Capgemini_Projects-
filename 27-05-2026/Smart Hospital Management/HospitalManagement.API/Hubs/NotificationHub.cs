using Microsoft.AspNetCore.SignalR;

namespace HospitalManagement.API.Hubs
{
    /*
        SignalR Hub handles realtime communication.

        Examples:
        - Appointment notifications
        - Emergency alerts
        - Doctor availability updates
    */

    public class NotificationHub : Hub
    {
        /*
            Called when client connects.
        */
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        /*
            Send notification to all connected users.
        */
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync(
                "ReceiveNotification",
                message
            );
        }
    }
}
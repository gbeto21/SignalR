using Microsoft.AspNetCore.SignalR;

namespace SignalR.Server.Hubs
{
    public class ViewHub : Hub
    {
        public static int ViewCount { get; set; } = 0;

        public override async Task OnConnectedAsync()
        {
            await Clients.All.SendAsync("ReceiveMessage", $"{Context.ConnectionId} has joined");
        }

        public async Task NotifyWatching()
        {
            ViewCount++;

            //notify EVERYONE
            await Clients.All.SendAsync("viewCountUpdate", ViewCount);
        }

        public string GetFullName(string firstName, string lastName)
        {
           return $"{firstName} {lastName}";
        }

    }
}

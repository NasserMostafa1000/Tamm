using Microsoft.AspNetCore.SignalR;

namespace TammBackendProject.Controllers
{
    public class coinHub:Hub
    {
        public async Task JoinShippingGroup()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "ShippingPage");
        }

        public async Task LeaveShippingGroup()
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, "ShippingPage");
        }

    }
}

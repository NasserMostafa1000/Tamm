using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;
using System.Security.Claims;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

public class ChatHub : Hub
{
    private static ConcurrentDictionary<string, string> userConnections = new();

    private readonly IChatService _chatService;

    public ChatHub(IChatService chatService)
    {
        _chatService = chatService;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            userConnections[userId] = Context.ConnectionId;
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var userId = Context.UserIdentifier;
        if (!string.IsNullOrEmpty(userId))
        {
            userConnections.TryRemove(userId, out _);
        }
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(int toUserId, string message, int? listingId=null)
    {
        try
        {
            var fromUserIdStr = Context.UserIdentifier;

            if (!int.TryParse(fromUserIdStr, out int fromUserId))
            {
                throw new Exception("Invalid UserIdentifier from context.");
            }

            await _chatService.InsertMessageAsync(fromUserId, toUserId, listingId, message);

            // 🔴 إرسال الرسالة للطرف الآخر إن كان متصل
            if (userConnections.TryGetValue(toUserId.ToString(), out string recipientConnectionId))
            {
                await Clients.Client(recipientConnectionId).SendAsync("ReceiveMessage", new
                {
                    fromUserId,
                    toUserId,
                    message,
                    listingId,
                    sentAt = DateTime.UtcNow
                });

                await Clients.Client(recipientConnectionId).SendAsync("UpdateContacts");
            }

            // 🟢 تأكيد الإرسال للطرف المرسل
            await Clients.Caller.SendAsync("MessageSent", new
            {
                toUserId,
                status = "success"
            });

            // 🔄 تحديث واجهة الرسائل للمرسل
            if (userConnections.TryGetValue(fromUserId.ToString(), out string senderConnectionId))
            {
                await Clients.Client(senderConnectionId).SendAsync("UpdateContacts");
            }
        }
        catch (Exception ex)
        {
            throw  new Exception(ex.Message.ToString());
        }
    }

}

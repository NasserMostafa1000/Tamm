using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TammbusinessLayer.Factories;
using TammbusinessLayer.Interfaces;
using TammDataLayer;
using TammDataLayer.Chat;
using TammDataLayer.Users;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly NotificationsFactory _notificationsFactory;
        private readonly IChatService _chatService;

        public NotificationsController(IHubContext<ChatHub> hubContext, NotificationsFactory notificationsFactory, IChatService chatService)
        {
            _hubContext = hubContext;
            _notificationsFactory = notificationsFactory;
            _chatService= chatService;
        }
        public class NotificationRequest
        {
            public string EmailOrUserId { get; set; }  // ممكن إيميل أو يوزر آي دي حسب نظامك
            public string Subject { get; set; }
            public string Body { get; set; }
            public string NotificationProvider { get; set; }  // مثلا "gmail" أو "chathub"
        }

        [HttpPost("SendNotification")]
        public async Task<IActionResult> SendNotification([FromBody] NotificationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.EmailOrUserId) ||
                string.IsNullOrWhiteSpace(request.Body) ||
                string.IsNullOrWhiteSpace(request.NotificationProvider))
            {
                return BadRequest("Email/UserId, Body and NotificationProvider are required.");
            }

            try
            {
                if (request.NotificationProvider.Equals("tamm", StringComparison.OrdinalIgnoreCase))
                {
                    // إرسال رسالة عبر SignalR Hub (الشات هب) مباشرة من الكونترولر
                    await _hubContext.Clients.User(request.EmailOrUserId)
                        .SendAsync("ReceiveNotification", request.Subject, request.Body);
                  await  _chatService.InsertMessageAsync(Settings.AdminId,await UsersQueriesDAL.GetUserIdByPersonId(int.Parse(request.EmailOrUserId)), null, request.Subject + "\n" + request.Body);
                    return Ok("Notification sent via ChatHub successfully.");
                }
                else
                {
                    // بعت الرسالة عن طريق الـ Factory (Gmail أو غيره)
                    INotification notifier = _notificationsFactory.GetNotificationSender(request.NotificationProvider);
                    await notifier.SendNotificationAsync(request.EmailOrUserId, request.Subject, request.Body);

                    return Ok("Notification sent successfully.");
                }
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

    }
}

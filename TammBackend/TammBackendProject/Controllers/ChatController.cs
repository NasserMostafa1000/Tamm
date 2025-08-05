using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }
        [HttpGet("contacts")]
        [Authorize]
        public async Task<IActionResult> GetUserChatContacts()
        {
            try
            {
                // نجيب الـ UserId من التوكن
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                    return Unauthorized();

                var contacts = await _chatService.GetUserChatContactsWithLastMessageAsync(userId);

                return Ok(contacts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpGet("messages")]
        public async Task<IActionResult> GetMessages(int currentUserId, int contactUserId)
        {
            if (currentUserId <= 0 || contactUserId <= 0)
                return BadRequest("Invalid user IDs.");

            try
            {
                var messages = await _chatService.GetAndMarkMessagesAsReadAsync(currentUserId, contactUserId);
                return Ok(messages);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message.ToString()}");
            }
        }

        [HttpGet("UnreadCount")]
        [Authorize] // لازم يكون المستخدم مسجل دخول
        public async Task<ActionResult> GetUnreadMessagesCount()
        {
            try
            {

                var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
                int UserId = int.Parse(userIdStr);
                if (UserId == null)
                    return Unauthorized("User ID not found in token.");


                var count = await _chatService.GetUnreadMessagesCountAsync(UserId);
                return Ok(new  { TotalMessages = count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error retrieving unread messages count: {ex.Message}");
            }
        }
    }
}

    


using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersCommands _UsersCommand;
        private readonly IUserQueries _UsersQueries;

        public UsersController(IUsersCommands usersCommand, IUserQueries UsersQueries)
        {
            _UsersCommand = usersCommand;
            _UsersQueries = UsersQueries;
        }
        [HttpPost("BlockPerson")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> BlockPerson(int personId)
        {
            try
            {
                bool success = await _UsersCommand.BlockPersonAsync(personId);
                if (!success)
                    return NotFound("User not found or already blocked.");

                return Ok("User blocked successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal error: {ex.Message}");
            }
        }

        [HttpGet("GetAllEmails")]
        [Authorize (Roles ="Admin")]
        public async Task<ActionResult<List<string>>> GetAllEmails()
        {
            try
            {
                var emails = await _UsersQueries.GetAllUserEmailsAsync();
                return Ok(emails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error fetching emails: {ex.Message}");
            }
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            try
            {
                if(request.NotificationProvider=="gmail")
                {

                int result = await _UsersCommand.UpdatePasswordWithEmailAsync(
                    email: request.Email,
                    notifierId: request.NotifierId,               // إيميل المستخدم أو رقم الموبايل
                    language: request.Language ,
                    NotificationSender: request.NotificationProvider
                );

                if (result > 0)
                {
                    return Ok(new
                    {
                        Success = true,
                        Message = request.Language == "ar"
                            ? "تم إعادة تعيين كلمة المرور وإرسالها للمستخدم."
                            : "Password has been reset and sent to the user."
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        Success = false,
                        Message = request.Language == "ar"
                            ? "المستخدم غير موجود."
                            : "User not found."
                    });
                }
                }
                else
                {
                    //start sms recet
                    return NotFound(new
                    {
                        Success = false,
                        Message = request.Language == "ar"
                       ? "المستخدم غير موجود."
                       : "User not found."
                    });
                }
            }
            catch (System.Exception ex)
            {
                return BadRequest(new
                {
                    Success = false,
                    Message = ex.Message
                });
            }
        }
    }

    // DTO
    public class ResetPasswordRequest
    {
        public string Email { get; set; }
        public string NotifierId { get; set; } // إيميل أو موبايل
        public string Language { get; set; }   // "ar" أو "en"
        public string NotificationProvider { get; set; } // "gmail" أو "sms"
    }
}


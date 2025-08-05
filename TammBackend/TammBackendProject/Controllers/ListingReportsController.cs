using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TammbusinessLayer.Interfaces;
using TammDataLayer;
using TammDataLayer.Chat;
using static TammDataLayer.ListingReports.ListingReportsDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingReportsController : ControllerBase
    {
        private readonly IListingReportReasonsQueries _listingReportReasonsQueries;
        private readonly IListingReportsCommands _listingReportsCommands;
        private readonly IListingReportQueries _listingReportsQueries;
        private readonly IListingCommands _ListingCommand;
        private readonly IHubContext<ChatHub> _chatHub;
        public ListingReportsController(IListingReportQueries listingReportsQueries, IListingReportReasonsQueries listingReportReasonsQueries, IHubContext<ChatHub> chatHub, IListingReportsCommands listingReportsCommands,IListingCommands ListingCommand)
        {
            _listingReportReasonsQueries = listingReportReasonsQueries;
            _listingReportsCommands = listingReportsCommands;
            _chatHub = chatHub;
            _listingReportsQueries = listingReportsQueries;
            _ListingCommand= ListingCommand;

        }
        [HttpGet("GetReasons")]
        public async Task<ActionResult<List<ReasonDto>>> GetReasons([FromQuery] string lang = "en")
        {
            try
            {
                var reasons = await _listingReportReasonsQueries.GetReportReasonsAsync(lang);
                return Ok(reasons);
            }
            catch(Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving report reasons." + ex.Message.ToString());
            }
        }

        // POST: api/ListingReports/Insert
        [HttpPost("Insert")]
        public async Task<IActionResult> InsertReport([FromBody] ReportRequestDto request)
        {
            try
            {
                string message =
                   "تم استلام بلاغك بشأن هذا الإعلان، وسنتعامل معه في أقرب وقت ممكن.\n" +
                   "We have received your report regarding this listing and will review it shortly.";

                int TheUserThatApplyTheReport = request.UserId;
                await _chatHub.Clients.User(request.UserId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId, // مسؤول النظام
                    toUserId = TheUserThatApplyTheReport,
                    message = message,
                    sentAt = DateTime.UtcNow
                });

                await _chatHub.Clients.User(request.UserId.ToString()).SendAsync("UpdateContacts");

                await _listingReportsCommands.InsertListingReportAsync(request.UserId, request.ListingId, request.ReasonId);
                return Ok(new { success = true, message = "Report submitted successfully." });
            }
            catch(Exception ex)
            {
                return StatusCode(500, "An error occurred while submitting the report."+ex.Message.ToString());
            }
        }
        [HttpGet("GetListingReports")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetListingReports([FromQuery] string lang = "en")
        {
            try
            {
                var reports = await _listingReportsQueries.GetListingReportsDetailsAsync(lang);
                return Ok(reports);
            }
            catch (Exception ex)
            {
                // لو حصل أي خطأ داخلي، رجع رسالة مفهومة للمستخدم أو المطور
                return StatusCode(500, new { message = "An error occurred while retrieving the reports.", error = ex.Message });
            }
        }

        [HttpPost("RejectReport")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectReport(int reportId)
        {
            try
            {
                var usersInfo = await _listingReportsQueries.GetListingReportsWithUsersInfoAsync(reportId);

                if (usersInfo == null)
                    return NotFound("Report info not found.");

                await _listingReportsCommands.RejectListingReportLAsync(reportId);
         
                string messageAr = "تم رفض البلاغ المُقدَّم بشأن الإعلان، ولم يتم اتخاذ أي إجراء.";
                string messageEn = "The report you submitted has been rejected and no action has been taken.";
                string finalMessage = messageAr + "\n" + messageEn;
                var time = DateTime.UtcNow;
                
               await ChatDAL.InsertMessageAsync(Settings.AdminId, usersInfo.ReporterUserId,usersInfo.ListingId , finalMessage);
                

                // إرسال رسالة للمُبلّغ
                await _chatHub.Clients.User(usersInfo.ReporterUserId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId,
                    toUserId = usersInfo.ReporterUserId,
                    message = finalMessage,
                    sentAt = time
                });
                await _chatHub.Clients.User(usersInfo.ReporterUserId.ToString()).SendAsync("UpdateContacts");


                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }
        [HttpPost("ApproveReportAndDeleteAd")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveReportAndDeleteAd(int adId, int reportId)
        {
            try
            {
                var usersInfo = await _listingReportsQueries.GetListingReportsWithUsersInfoAsync(reportId);

                if (usersInfo == null)
                    return NotFound("Report info not found.");

                await _ListingCommand.DeleteListingAndImagesAsync(adId);
                await _listingReportsCommands.ApproveReportAndDeleteAdAsync(adId, reportId);

                string messageAr = "شكرًا لإبلاغك. بعد مراجعة البلاغ المُقدَّم، تأكدنا من مخالفته وتم حذف الإعلان من النظام.";
                string messageEn = "Thank you for your report. After reviewing the submitted report, we confirmed a violation and the listing has been removed.";
                string reporterMessage = $"{messageAr}\n{messageEn}";


                string messageAr0 = "نود إعلامك بأنه تم حذف إعلانك بعد مراجعة البلاغ المُقدَّم بشأنه، وذلك لمخالفته سياسات المنصة.";
                string messageEn1 = "We would like to inform you that your listing has been removed after reviewing the submitted report due to a violation of our platform policies.";
                string ownerMessage = $"{messageAr0}\n{messageEn1}";
                var time = DateTime.UtcNow;

                // حفظ الرسائل أولًا
                await ChatDAL.InsertMessageAsync(Settings.AdminId, usersInfo.ReporterUserId, usersInfo.ListingId, reporterMessage);
                if (usersInfo.ReporterUserId != usersInfo.ListingOwnerUserId)
                {
                    await ChatDAL.InsertMessageAsync(Settings.AdminId, usersInfo.ListingOwnerUserId, usersInfo.ListingId, ownerMessage);
                }

                // إرسال للمبلّغ
                await _chatHub.Clients.User(usersInfo.ReporterUserId.ToString()).SendAsync("ReceiveMessage", new
                {
                    fromUserId = Settings.AdminId,
                    toUserId = usersInfo.ReporterUserId,
                    message = reporterMessage,
                    sentAt = time
                });
                await _chatHub.Clients.User(usersInfo.ReporterUserId.ToString()).SendAsync("UpdateContacts");

                // إرسال لصاحب الإعلان (إن لم يكن هو نفس المبلّغ)
                if (usersInfo.ReporterUserId != usersInfo.ListingOwnerUserId)
                {
                    await _chatHub.Clients.User(usersInfo.ListingOwnerUserId.ToString()).SendAsync("ReceiveMessage", new
                    {
                        fromUserId = Settings.AdminId,
                        toUserId = usersInfo.ListingOwnerUserId,
                        message = ownerMessage,
                        sentAt = time
                    });
                    await _chatHub.Clients.User(usersInfo.ListingOwnerUserId.ToString()).SendAsync("UpdateContacts");
                }

                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred: " + ex.Message);
            }
        }




    }
}


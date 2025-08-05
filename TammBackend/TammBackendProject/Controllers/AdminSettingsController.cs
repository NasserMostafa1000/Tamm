using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TammbusinessLayer.Interfaces;
using TammDataLayer;
using static TammDataLayer.AdminContacts.AdminContactsDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminSettingsController : ControllerBase
    {
        private readonly IHubContext<coinHub> _hubContext1;
        private readonly IAdminContactQueries _AdminContactQueries;
        private readonly IAdminContactCommands _adminContactCommands;
        public AdminSettingsController(IHubContext<coinHub>hubContext, IAdminContactCommands adminContactCommands, IAdminContactQueries adminContactQueries)
        {
            _hubContext1 = hubContext;
            _adminContactCommands = adminContactCommands;
            _AdminContactQueries = adminContactQueries;
        }
        [HttpPost("UpdateCoinRate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCoinRate([FromBody] decimal newValue)
        {
            await Settings.UpdateCoinRateAsync(newValue);
            await _hubContext1.Clients.Group("ShippingPage").SendAsync("ReceiveUpdatedPrices", new { coinRate = newValue });

            return Ok("Coin rate updated.");
        }

        [HttpGet("GetContactUs")]
        public async Task<ActionResult<ContactUsDto>> GetContactUs()
        {
            var result = await _AdminContactQueries.GetContactUsAsync();
            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPut("UpdateContactUs")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> UpdateContactUs([FromBody] ContactUsDto dto)
        {
            if (dto == null || dto.Id <= 0)
                return BadRequest("Invalid data");

            var updated = await _adminContactCommands.UpdateContactUsAsync(dto);
            if (!updated)
                return StatusCode(500, "Failed to update contact information.");

            return Ok(new { message = "Contact information updated successfully." });
        }

        [HttpPost("UpdateAdPrice")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAdPrice([FromBody] decimal newAmount)
        {
            await Settings.UpdateAdPostingPriceAsync(newAmount);
            return Ok("Ad price updated.");
        }
        [HttpGet("GetCoinRate")]
        public async Task<IActionResult> GetCoinRate()
        {
            try
            {
                var rate = await Settings.GetCoinRate();
                return Ok(rate);
            }
            catch
            {
                return StatusCode(500, "خطأ أثناء جلب سعر العملة");
            }
        }

        [HttpGet("GetAdPrice")]
        public async Task<IActionResult> GetAdPrice()
        {
            try
            {
                var price = await Settings.GetAdPrice();
                return Ok(price);
            }
            catch
            {
                return StatusCode(500, "خطأ أثناء جلب سعر الإعلان");
            }
        }
    }
}

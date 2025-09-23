using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdsVerficationsHistoryController : ControllerBase
    {
        private readonly IAdVerficationHistoriyQueries _adVerficationHistoriyQueries;

        public AdsVerficationsHistoryController(IAdVerficationHistoriyQueries adVerficationHistoriy)
        {
            _adVerficationHistoriyQueries = adVerficationHistoriy;
        }

        // GET api/AdsVerficationsHistory?listingId=5
        [HttpGet]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> Get([FromQuery] int? listingId = null)
        {
            try
            {
                var history = await _adVerficationHistoriyQueries.GetAdVerificationHistoryAsync(listingId);
                return Ok(history);
            }
            catch (Exception ex)
            {
                // ممكن تعمل logging هنا
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
            }
        }
    }
}

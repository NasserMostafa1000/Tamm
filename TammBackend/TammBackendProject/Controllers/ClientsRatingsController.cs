using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ClientsRatings; // لو محتاج DTOs
using System.Threading.Tasks;
using System.Security.Claims;
using TammDataLayer.Users;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
   
    public class ClientsRatingsController : ControllerBase
    {
        private readonly IClientRatingCommands _clientsRatingCommands;
        private readonly IClientRatingQueries _clientsRatingQueries;
        private readonly IUserQueries _userQueries;


        public ClientsRatingsController(
            IClientRatingQueries clientsRatingQueries,
            IClientRatingCommands clientsRatingCommands,
            IUserQueries userQueries)
        {
            _clientsRatingCommands = clientsRatingCommands;
            _clientsRatingQueries = clientsRatingQueries;
            _userQueries = userQueries;
        }


        [HttpPost("upsert")]
        [ProducesResponseType(StatusCodes.Status200OK)]   // نجاح العملية
        [ProducesResponseType(StatusCodes.Status400BadRequest)] // خطأ في البيانات
        [ProducesResponseType(StatusCodes.Status401Unauthorized)] // غير مصرح
        [Authorize]
        public async Task<IActionResult> UpsertRating( int toUserId, int ratingValue)
        {

            var fromUserIdstr = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            int FromUserId = int.Parse(fromUserIdstr);
            int FromPersonId =await _userQueries.GetPersonIdByUserId(FromUserId);
            int ToPerosnId = await _userQueries.GetPersonIdByUserId(toUserId);
            if (FromPersonId == ToPerosnId)
                return BadRequest("Cannot rate yourself.");
            await _clientsRatingCommands.UpsertCustomerRatingAsync(FromPersonId, ToPerosnId, ratingValue);
            return Ok("Rating saved successfully.");
        }

      
        [HttpGet("{toUserId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetCustomerRating(int toUserId)
        {
            int ToPersonId =await  _userQueries.GetPersonIdByUserId(toUserId);
            var summary = await _clientsRatingQueries.GetCustomerAverageRating(ToPersonId);
            if (summary == null)
                return NotFound();

            return Ok(summary);
        }
    }
}

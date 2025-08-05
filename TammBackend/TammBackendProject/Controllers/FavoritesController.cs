using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;

namespace TammApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FavoritesController : ControllerBase
    {
        private readonly IFavoriteCommands _favoritesService;
        private readonly IFavoriteQueries _FavoritesQueriesServices;
        public FavoritesController(IFavoriteCommands favoritesService, IFavoriteQueries FavoritesQueriesServices)
        {
            _favoritesService = favoritesService;
            _FavoritesQueriesServices = FavoritesQueriesServices;
        }

        [HttpPost("Add")]
        [Authorize(Roles = "Admin,Client")]  
        public async Task<IActionResult> AddToFavorites(int listingId)
        {
            // جبت ال UserId من الـ Claims بتاع اليوزر (لو بتستخدم JWT)
            var userIdStr = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int UserId = int.Parse(userIdStr);
            if (UserId == null )
            {
                return Unauthorized(new { message = "User not identified." });
            }

            if (UserId <= 0 || listingId <= 0)
                return BadRequest(new { message = "Invalid data." });

            try
            {
                await _favoritesService.InsertInfoFavoritesAsync(UserId, listingId);
                return Ok(new { message = "Added to favorites successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred.", error = ex.Message });
            }
        }

        [HttpDelete("Delete/{favoriteId}")]
        [Authorize]
        public async Task<IActionResult> DeleteFavorite(int favoriteId)
        {
            var success = await _favoritesService.DeleteFavoriteAsync(favoriteId);
            if (success)
                return Ok(new { message = "Deleted successfully" });
            else
                return NotFound(new { message = "Favorite not found" });
        }
        [HttpGet("GetUserFavorites")]
       [Authorize]
        public async Task<IActionResult> GetUserFavorites(string lang)
        {
           var subClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (subClaim == null || !int.TryParse(subClaim, out int userId))
            {
                return Unauthorized(new { message = "Invalid or missing token" });
            }
         
            var favorites = await _FavoritesQueriesServices.GetFavoriteListingsAsync(userId,lang);
            return Ok(favorites);
        }
    }
    }

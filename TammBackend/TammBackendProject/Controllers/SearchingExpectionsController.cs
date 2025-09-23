using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SearchingExpectionsController : ControllerBase
    {
        private readonly TammbusinessLayer.Interfaces.ISearchingExpectionsCommands _searchingExpectionsCommands;
        private readonly TammbusinessLayer.Interfaces.ISearchingExpectionsQueries _searchingExpectionsQueries;
        public SearchingExpectionsController(TammbusinessLayer.Interfaces.ISearchingExpectionsCommands searchingExpectionsCommands,
            TammbusinessLayer.Interfaces.ISearchingExpectionsQueries searchingExpectionsQueries)
        {
            _searchingExpectionsCommands = searchingExpectionsCommands;
            _searchingExpectionsQueries = searchingExpectionsQueries;
        }
        [HttpPost("AddOrUpdateUserSearch")]
        public async Task<IActionResult> AddOrUpdateUserSearchAsync([FromQuery] string userUUID, [FromQuery] int ListingId)
        {
            try
            {
                await _searchingExpectionsCommands.AddOrUpdateUserSearchAsync(userUUID, ListingId);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("GetUserLastCategory")]
        public async Task<IActionResult> GetUserLastCategoryAsync([FromQuery] string userUUID)
        {
            try
            {
                var category = await _searchingExpectionsQueries.GetUserLastCategoryAsync(userUUID);
                return Ok(category);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

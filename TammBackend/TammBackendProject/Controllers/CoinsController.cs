using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using static TammDataLayer.Coins.CoinsDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoinsController : ControllerBase
    {
        private readonly ICoinQueries _coinQueries1;
        private readonly ICoinCommands _coinCommands1;
        public CoinsController(ICoinQueries coinQueries, ICoinCommands coinCommands)
        {
            _coinCommands1 = coinCommands;
            _coinQueries1 = coinQueries;
        }
        [HttpGet("GetAll")]
        public async Task<ActionResult<List<CoinPriceDto>>> GetAll()
        {
            var packages = await _coinQueries1.GetAllCoinPackagesAsync();
            return Ok(packages);
        }
        [HttpPost("Add")]
        [Authorize(Roles ="Admin")]
        public async Task<ActionResult> Add([FromBody] CoinPriceDto dto)
        {
            if (dto.CoinsAmount <= 0 || dto.CoinPrice <= 0)
                return BadRequest("Invalid data");

            bool added = await _coinCommands1.AddCoinPackageAsync(dto.CoinsAmount, dto.CoinPrice);
            if (added)
                return Ok(new { message = "Coin package added successfully" });

            return StatusCode(500, "Something went wrong");
        }
        [HttpPut("Update")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Update([FromBody] CoinPriceDto dto)
        {
            if (dto.CoinId <= 0 || dto.CoinsAmount <= 0 || dto.CoinPrice <= 0)
                return BadRequest("Invalid data");

            bool updated = await _coinCommands1.UpdateCoinPackageAsync(dto.CoinId, dto.CoinsAmount, dto.CoinPrice);
            if (updated)
                return Ok(new { message = "Coin package updated successfully" });

            return StatusCode(500, "Something went wrong");
        }
        [HttpDelete("Delete/{coinId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> Delete(int coinId)
        {
            if (coinId <= 0)
                return BadRequest("Invalid CoinId");

            bool deleted = await _coinCommands1.DeleteCoinPackageAsync(coinId);
            if (deleted)
                return Ok(new { message = "Coin package deleted successfully" });

            return NotFound(new { message = "Coin package not found" });
        }
        [HttpGet("GetCoinsForUser/{userId}")]
        [Authorize]
        public async Task<ActionResult<UserCoinsDto>> GetCoinsForUser(int userId)
        {
            var result = await _coinQueries1.GetCoinsForSpecificUserAsync(userId);
            if (result == null)
                return NotFound("User not found or has no coins.");

            return Ok(result);
        }
    }
}

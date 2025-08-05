using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.ListingAddresses;
using TammDataLayer.ListingsAddresses;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsAddressesController : ControllerBase
    {
        private readonly IListingAddressCommand _service;

        public ListingsAddressesController(IListingAddressCommand service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> InsertListingAddress([FromBody] ListingsAddressesDtos.InsertListingAddressDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                int newId = await _service.InsertListingAddressAsync(dto);
                return Ok(new { ListingAddressId = newId });
            }
            catch (Exception ex)
            {
                // ممكن تطبع اللوج هنا لو عندك logging
                return StatusCode(500, new { error = "Internal Server Error", message = ex.Message });
            }
        }
    }
}


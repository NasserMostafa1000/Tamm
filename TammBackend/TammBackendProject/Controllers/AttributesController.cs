using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Attributes;
using static TammDataLayer.ListingsAttributes.ListingAttributesDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/Attributes")]
    [ApiController]
    public class AttributesController : ControllerBase
    {
        private readonly IAttributeQueries _attributesQuery;
        private readonly  IListingAttributeCommand _ListingAttributesCommands;
        private readonly IAttributeCommand _attributesCommands;


        public AttributesController(IAttributeQueries attributesQuery, IListingAttributeCommand ListingAttributesCommands, IAttributeCommand attributesCommands)
        {
            _attributesQuery = attributesQuery;
            _ListingAttributesCommands = ListingAttributesCommands;
            _attributesCommands = attributesCommands;
        }

        [HttpGet("GetAttributesByCategory")]
        public async Task<IActionResult> GetAttributesByCategory(int categoryId, string lang = "en")
        {
            var result = await _attributesQuery.GetAttributesForCategoryAsync(categoryId, lang);
            return Ok(result);
        }

        [HttpPost("AddListingAttribute")]
        public async Task<IActionResult> AddListingAttribute([FromBody] List<ListingAttributeDto> DTOs)
        {
            await _ListingAttributesCommands.AddListingAttribute(DTOs);
            return Ok("Attribute inserted.");
        }
        [HttpPost("AddAttribute")]
        [Authorize(Roles ="Admin")]
        public async Task<IActionResult> AddAttribute([FromBody] AttributesDTOs.PostAttributeDto attributeDto)
        {
            

            try
            {
               await _attributesCommands.InsertAttributeAsync(attributeDto);
                return Ok(new { message = "Attribute added successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while adding the attribute.", details = ex.Message });
            }
        }
    }
}

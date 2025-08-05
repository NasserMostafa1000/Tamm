using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Categories;
using static TammDataLayer.Categories.CategoriesDTOs;

namespace TammBackendProject.Controllers
{
    [Route("api/Categories")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {

        private readonly ICategoriesQueries _categoriesQueries;
        private readonly ICategoryCommands _categoryCommands;

        public CategoriesController(ICategoriesQueries service, ICategoryCommands categoryCommands)
        {
            _categoriesQueries = service;
            _categoryCommands = categoryCommands;
        }

        [HttpGet("Parents")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]

     
        public async Task<IActionResult> GetParentCategories([FromQuery] string lang)
        {
            if (lang != "en" && lang != "ar")
            {
                return BadRequest(new { Message = "Invalid language. Please use 'en' or 'ar'." });
            }
            try
            {
                var categories = await _categoriesQueries.GetParentCategoriesAsync(lang);

                return Ok(new
                {
                    Message = "Categories retrieved successfully.",
                    Data = categories
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Error = "Failed to retrieve categories.",
                    Details = ex.Message
                });
            }
        }
        [HttpGet("Subs")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<GetSubCategoryDTO>>> GetSubCategories([FromQuery] string lang, [FromQuery] string parentName)
        {

            if (string.IsNullOrEmpty(parentName))
                return BadRequest("Parent category name is required.");

            var result = await _categoriesQueries.GetSubCategoriesAsync(lang, parentName);
            return Ok(result);
        }

        // في Controller أو Service
        [HttpPost("AddSubCategory")]
        public async Task<IActionResult> AddSubCategory([FromBody] PostSubCategoryDTO category)
        {
            try
            {
                int newId = await _categoryCommands.InsertSubCategoryAsync(category);
                return Ok(new { success = true, categoryId = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }
        [HttpPost("AddParentCategory")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> AddParentCategory([FromBody] PostParentCategoryDTO category)
        {
            try
            {
                int newId = await _categoryCommands.InsertParentCategoryAsync(category);
                return Ok(new { success = true, categoryId = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = ex.Message });
            }
        }


    }
}


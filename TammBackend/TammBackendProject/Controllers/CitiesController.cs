using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Cities;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {

        private readonly ICityQueries _cityService;

        public CitiesController(ICityQueries cityService)
        {
            _cityService = cityService;
        }

        /// <summary>
        /// Get all cities with names based on selected language.
        /// </summary>
        /// <param name="lang">Language code: 'en' or 'ar'</param>
        /// <returns>List of emarates city names</returns>
        [HttpGet]
        [ProducesResponseType(typeof(List<CitiesDTOs.GetCitiesNamesDto>), 200)]
        [ProducesResponseType(typeof(string), 400)]
        [ProducesResponseType(typeof(string), 500)]
        public async Task<IActionResult> GetCities([FromQuery] string lang)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(lang) || (lang.ToLower() != "en" && lang.ToLower() != "ar"))
                {
                    return BadRequest(new { message = "Invalid language. Please use 'en' or 'ar'." });
                }

                var result = await _cityService.GetCitiesNames(lang.ToLower());
                return Ok(result);
            }
            catch (Exception)
            {
                // ممكن لاحقًا تسجل الـ ex.Message في لوج
                return StatusCode(500, "An error occurred while processing your request.");
            }
        }
        }
}

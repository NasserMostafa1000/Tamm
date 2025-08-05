using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammbusinessLayer.Interfaces;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CountriesController : ControllerBase
    {
        private readonly ICountryQueries _dataLayer;

        public CountriesController(ICountryQueries dataLayer)
        {
            _dataLayer = dataLayer;
        }

        [HttpGet]
        public async Task<IActionResult> GetCountries()
        {
            try
            {
                var countries = await _dataLayer.GetCountriesAsync();
                return Ok(countries);
            }
            catch (System.Exception ex)
            {
                // ممكن تسجل الخطأ هنا
                return StatusCode(500, new { message = "حدث خطأ في جلب البيانات", details = ex.Message });
            }
        }
    }
}

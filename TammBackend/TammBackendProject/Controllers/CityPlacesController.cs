using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static TammDataLayer.CitiesPlaces.CitiesPlacesDtos;
using TammbusinessLayer.Interfaces;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CityPlacesController : ControllerBase
    {
        private readonly ICityPlacesQueries _QueriesServices;
        private readonly ICitiesPlacesCommands _CommandsService;

        public CityPlacesController(ICityPlacesQueries service, ICitiesPlacesCommands CommandsService)
        {
            _QueriesServices = service;
            _CommandsService = CommandsService;
        }

        [HttpGet("GetAll")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCityPlacesByCityName([FromQuery] string lang, [FromQuery] string cityName)
        {
            try
            {
                var places = await _QueriesServices.GetCityPlacesByCityNameAsync(lang, cityName);

                if (places == null || places.Count == 0)
                {
                    return Ok(new
                    {
                        Message = "No places found for the specified city.",
                        Data = new List<GetCityPlaceDTO>()
                    });
                }

                return Ok(new
                {
                    Message = "Places retrieved successfully",
                    Data = places
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Error = "Something went wrong while fetching places.",
                    Details = ex.Message
                });
            }
        }

        [HttpPost("Add")]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> AddCityPlace([FromBody] AddCityPlaceDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                int newPlaceId = await _CommandsService.AddCityPlaceAsync(dto);

                return Ok(new
                {
                    Message = "City place added successfully.",
                    NewPlaceId = newPlaceId
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    Error = "Failed to add city place.",
                    Details = ex.Message
                });
            }
        }
    }
}

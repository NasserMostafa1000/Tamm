using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.CitiesPlaces.CitiesPlacesDtos;
using TammDataLayer.Cities;
using TammDataLayer.CitiesPlaces;
using static TammDataLayer.CitiesPlaces.CitiesPlacesQueries;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.CitiesPlacesServices
{
    public class CitiesPlacesQueries:ICityPlacesQueries
    {
        public async Task<List<GetCityPlaceDTO>> GetCityPlacesByCityNameAsync(string language, string cityName)
        {
            try
            {

            if (string.IsNullOrWhiteSpace(language) || string.IsNullOrWhiteSpace(cityName))
                throw new ArgumentException("Language and CityName must be provided");

            return await TammDataLayer.CitiesPlaces.CitiesPlacesQueries.GetAllCityPlacesByName_Async(language, cityName);
            }
            catch(Exception)
            {
                throw;
            }
        }

    }

}

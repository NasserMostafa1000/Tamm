using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.CitiesPlaces.CitiesPlacesDtos;
using TammDataLayer.Cities;

namespace TammbusinessLayer.Interfaces
{
    public interface ICityPlacesQueries
    {
        Task<List<GetCityPlaceDTO>> GetCityPlacesByCityNameAsync(string language, string cityName);

    }
}

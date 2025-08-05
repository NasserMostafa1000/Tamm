using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.CitiesPlaces;

namespace TammbusinessLayer.Interfaces
{
    public interface ICitiesPlacesCommands
    {
        Task<int> AddCityPlaceAsync(CitiesPlacesDtos.AddCityPlaceDTO dto);
    }
}

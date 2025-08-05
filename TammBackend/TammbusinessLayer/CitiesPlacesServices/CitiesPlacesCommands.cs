using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.CitiesPlaces;

namespace TammbusinessLayer.CitiesPlacesServices
{
    public class CitiesPlacesCommands:ICitiesPlacesCommands
    {
        public async Task<int> AddCityPlaceAsync(CitiesPlacesDtos.AddCityPlaceDTO dto)
        {
            try
            {
                 return await  TammDataLayer.CitiesPlaces.CitiesPlacesCommands.AddCityPlaceAsync(dto);
            }catch(Exception)
            {
                throw;
            }
        }
    }
}

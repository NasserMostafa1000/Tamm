using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Cities;

namespace TammbusinessLayer.CitiesServices
{
    public class CitiesQueriesServices :ICityQueries
    {
        public async Task<List<CitiesDTOs.GetCitiesNamesDto>> GetCitiesNames(string Lang)
        {
            try
            {
                return await CitiesQueries.GetAllCitiesAsync(Lang);
            }
            catch(Exception)
            {
                throw;
            }
        }

  
    }
}

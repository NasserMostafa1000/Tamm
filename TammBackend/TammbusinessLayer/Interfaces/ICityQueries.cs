using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.Cities;

namespace TammbusinessLayer.Interfaces
{
    public interface ICityQueries
    {
         Task<List<CitiesDTOs.GetCitiesNamesDto>> GetCitiesNames(string Lang);
    }
}

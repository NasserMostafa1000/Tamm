using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Countries.CountriesDto;

namespace TammbusinessLayer.Interfaces
{
    public interface ICountryQueries
    {
        Task<List<CountryDto>> GetCountriesAsync();
    }
}

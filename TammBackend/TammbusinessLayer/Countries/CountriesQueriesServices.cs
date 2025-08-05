using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Countries;

namespace TammbusinessLayer.Countries
{
    public class CountriesQueriesServices : ICountryQueries
    {
        public async Task<List<CountriesDto.CountryDto>> GetCountriesAsync()
        {
            try
            {
                return await TammDataLayer.Countries.CountryQueries.GetCountriesAsync();
            }catch(Exception)
            {
                throw;
            }
        }
    }
}

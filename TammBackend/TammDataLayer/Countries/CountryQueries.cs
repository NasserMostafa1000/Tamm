using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Countries.CountriesDto;

namespace TammDataLayer.Countries
{
    public static class CountryQueries
    {
        public static async Task<List<CountryDto>> GetCountriesAsync()
        {
            var countries = new List<CountryDto>();

            using (var connection = new SqlConnection(Settings._ProductionConnectionString))
            using (var command = new SqlCommand("GetCountries", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                await connection.OpenAsync();
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        countries.Add(new CountryDto
                        {
                            CountryId = reader.GetInt32(reader.GetOrdinal("CountryId")),
                            CountryName = reader.GetString(reader.GetOrdinal("CountryName")),
                            CountryCode = reader.GetString(reader.GetOrdinal("CountryCode"))
                        });
                    }
                }
            }

            return countries;
        }

    }
}

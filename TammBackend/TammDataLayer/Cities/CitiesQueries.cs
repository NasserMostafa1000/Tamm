using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Cities.CitiesDTOs;

namespace TammDataLayer.Cities
{
    public static class CitiesQueries
    {
        public static async Task<List<GetCitiesNamesDto>> GetAllCitiesAsync(string language)
        {
            var result = new List<GetCitiesNamesDto>();

            try
            {
                using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
                using (SqlCommand cmd = new SqlCommand("GetCities", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@Language", language);

                    await conn.OpenAsync();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new GetCitiesNamesDto
                            {
                                Id = reader.GetInt32(reader.GetOrdinal("CityId")),
                                Name = reader.GetString(reader.GetOrdinal("CityName")),
                            });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error while fetching cities: " + ex.Message);
            }

            return result;
        }
    }
}

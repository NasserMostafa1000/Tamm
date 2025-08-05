using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.CitiesPlaces.CitiesPlacesDtos;

namespace TammDataLayer.CitiesPlaces
{
    public class CitiesPlacesQueries
    {
        public static async Task<List<GetCityPlaceDTO>> GetAllCityPlacesByName_Async(string language, string cityName)
        {
            var result = new List<GetCityPlaceDTO>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetAllCityPlaces", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Language", language);
                cmd.Parameters.AddWithValue("@CityName", cityName);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result.Add(new GetCityPlaceDTO
                        {
                            CityPlaceId = reader.GetInt32(reader.GetOrdinal("CityPlaceId")),
                            CityId = reader.GetInt32(reader.GetOrdinal("CityId")),
                            CityName = reader.GetString(reader.GetOrdinal("CityName")),
                            PlaceName = reader.GetString(reader.GetOrdinal("PlaceName"))
                        });
                    }
                }
            }

            return result;
        }

    }
}

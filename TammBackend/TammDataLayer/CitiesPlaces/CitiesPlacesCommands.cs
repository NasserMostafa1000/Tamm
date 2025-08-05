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
    public class CitiesPlacesCommands
    {
        public static async Task<int> AddCityPlaceAsync(AddCityPlaceDTO dto)
        {
            int newPlaceId = 0;

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("InsertCityPlace", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CityId", dto.CityId);
                cmd.Parameters.AddWithValue("@PlaceNameEn", dto.PlaceNameEn);
                cmd.Parameters.AddWithValue("@PlaceNameAr", dto.PlaceNameAr);

                await conn.OpenAsync();

                // ExecuteScalarAsync ستعيد أول قيمة من أول صف في نتيجة SELECT
                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int id))
                {
                    newPlaceId = id;
                }
            }

            return newPlaceId;
        }

    }
}

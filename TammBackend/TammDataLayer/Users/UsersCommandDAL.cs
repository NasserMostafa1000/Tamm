using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.Users
{
    public static class UsersCommandDAL
    {

        public static async Task<bool> BlockPersonAsync(int personId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("BlockPerson", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PersonId", personId);

                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync()) // 👈 استخدم Reader
                {
                    if (await reader.ReadAsync())
                    {
                        int rowsAffected = reader.GetInt32(0); // 👈 اقرأ RowsAffected
                        return rowsAffected > 0;
                    }
                }

                return false;
            }
        }
        public class ImageObject
        {
            public string ImageUrl { get; set; }
        }

        public static async Task<List<string>> DeletePersonAndAddressesAndGetImagePathsAsync(int personId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("DeletePersonAndAddressesIndividually", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PersonId", personId);

                await conn.OpenAsync();

                var jsonResult = await cmd.ExecuteScalarAsync() as string;

                if (string.IsNullOrEmpty(jsonResult))
                {
                    return new List<string>();
                }

                var imageObjects = JsonSerializer.Deserialize<List<ImageObject>>(jsonResult);

                var imageUrls = imageObjects?.Select(img => img.ImageUrl).ToList() ?? new List<string>();

                return imageUrls;
            }
        }

    }

}


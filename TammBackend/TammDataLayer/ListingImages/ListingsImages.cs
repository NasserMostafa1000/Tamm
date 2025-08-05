using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.ListingImages
{
    public class ListingsImages
    {
        public static async Task InsertListingImage(int listingId, string imagePath)
        {
            string query = "INSERT INTO ListingImages (ListingId, ImageUrl) VALUES (@ListingId, @ImageUrl);";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@ListingId", listingId);
                    cmd.Parameters.AddWithValue("@ImageUrl", imagePath);

                    await conn.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();
                }
            }
        }
    }


    }


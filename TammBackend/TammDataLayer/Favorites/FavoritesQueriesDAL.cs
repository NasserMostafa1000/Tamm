using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Favorites.FavoritesDTOs;

namespace TammDataLayer.Favorites
{
    public class FavoritesQueriesDAL
    {
        public static async Task<List<FavoriteListingDto>> GetFavoriteListingsAsync(int userId, string lang)
        {
            var results = new List<FavoriteListingDto>();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetFavoriteListings", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@Lang", lang);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        results.Add(new FavoriteListingDto
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId")),
                            FavoriteId = reader.GetInt32(reader.GetOrdinal("FavoriteId")),
                            TitleAr = reader["TitleAr"] as string,
                            ImageUrl = reader["ImageUrl"] as string,
                            TitleEn = reader["TitleEn"] as string,
                            DescriptionAr = reader["DescriptionAr"] as string,
                            DescriptionEn = reader["DescriptionEn"] as string,
                            Price = reader.GetDecimal(reader.GetOrdinal("Price")),
                            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                            CityNameAr = reader["CityNameAr"] as string,
                            CityNameEn = reader["CityNameEn"] as string,
                            PlaceNameAr = reader["PlaceNameAr"] as string,
                            PlaceNameEn = reader["PlaceNameEn"] as string,
                            SubCategoryAr = reader["SubCategoryAr"] as string,
                            SubCategoryEn = reader["SubCategoryEn"] as string
                        });
                    }
                }
            }

            return results;
        }
    

    }
}

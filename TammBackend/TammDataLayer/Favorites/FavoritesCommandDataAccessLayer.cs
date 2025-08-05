using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using TammDataLayer;

namespace TammDataLayer.Favorites
{
    public static class FavoritesCommandDataAccessLayer
    {
        public static async Task InsertInfoFavorites(int userId, int listingId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("InsertIntoFavorites", conn)) // تأكد من اسم الـ Procedure
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@ListingId", listingId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public static async Task<bool> DeleteFavoriteAsync(int favoriteId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("DeleteFavorite", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@FavoriteId", favoriteId);

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
         

        }
    }

}

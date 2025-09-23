using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.SearchingExpections
{
    public static class SearchingExpectionsCommands
    {
        /// <summary>
        /// إضافة أو تحديث الكاتيجوري بناءً على UUID
        /// </summary>
        public static async Task AddOrUpdateUserSearchAsync(string userUUID, int ListingId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString)) 
            using (SqlCommand cmd = new SqlCommand("AddOrUpdateUserSearch", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserUUID", userUUID);
                cmd.Parameters.AddWithValue("@ListingId", ListingId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }
}

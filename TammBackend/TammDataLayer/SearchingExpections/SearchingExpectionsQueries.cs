using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.SearchingExpections
{
    public static  class SearchingExpectionsQueries
    {
        /// <summary>
        /// جلب آخر كاتيجوري (اسم) بناءً على UUID
        /// </summary>
        public static async Task<string> GetUserLastCategoryAsync(string userUUID)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetUserLastCategory", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserUUID", userUUID);

                await conn.OpenAsync();
                var result = await cmd.ExecuteScalarAsync();
                return result != null ? result.ToString() : null;
            }
        }
    }
}

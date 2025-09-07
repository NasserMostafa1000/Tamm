using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.ClientsRatings.RatingsDTOS;

namespace TammDataLayer.ClientsRatings
{
    public static class ClientsRatingCommandsDAL
    {
        //up=>update - sert=>insert
        //if the fromCustomerId is new for the toCustomerId will insert if not will update
        public static async Task UpsertCustomerRatingAsync(int fromPersonId, int toPersonId, int ratingValue)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpsertCustomerRating", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@FromCustomerId", fromPersonId);
                cmd.Parameters.AddWithValue("@ToCustomerId", toPersonId);
                cmd.Parameters.AddWithValue("@RatingValue", ratingValue);

                await conn.OpenAsync().ConfigureAwait(false);
                await cmd.ExecuteNonQueryAsync().ConfigureAwait(false);
            }
        }
    }
}

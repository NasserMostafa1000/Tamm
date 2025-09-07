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
    public class ClientsRatingQueriesDAL
    {
        public static async Task<CustomerRatingSummaryDto> GetCustomerAverageRating(int toPersonIdId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetCustomerAverageRating", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ToCustomerId", toPersonIdId);

                await conn.OpenAsync().ConfigureAwait(false);

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync().ConfigureAwait(false))
                {
                    if (await reader.ReadAsync().ConfigureAwait(false))
                    {
                        return new CustomerRatingSummaryDto
                        {
                            CustomerId = (int)reader["CustomerId"],
                            AverageRating = (decimal)reader["AverageRating"],
                            TotalRatings = (int)reader["TotalRatings"]
                        };
                    }
                }
            }

            return null;
        }
    }
}

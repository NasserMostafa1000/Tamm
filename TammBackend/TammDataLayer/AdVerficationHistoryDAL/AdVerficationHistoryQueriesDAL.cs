using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.AdVerficationHistoryDAL.AdVerficationHistoryDTOs;

namespace TammDataLayer.AdVerficationHistoryDAL
{
    public static class AdVerficationHistoryQueriesDAL
    {
        public static async Task<List<AdVerificationHistoryDto>> GetAdVerificationHistoryAsync(int? listingId = null)
        {
            var result = new List<AdVerificationHistoryDto>();

            await using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            await using (SqlCommand cmd = new SqlCommand("GetAdVerificationHistory", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                if (listingId.HasValue)
                    cmd.Parameters.AddWithValue("@ListingId", listingId.Value);
                else
                    cmd.Parameters.AddWithValue("@ListingId", DBNull.Value);

                await conn.OpenAsync();
                await using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var dto = new AdVerificationHistoryDto
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId")),
                            CaseName = reader.GetString(reader.GetOrdinal("CaseName")),
                            DateAndTime = reader.GetDateTime(reader.GetOrdinal("DateAndTime")),
                            UserId = reader.GetInt32(reader.GetOrdinal("UserId")),
                            FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                            LastName = reader.GetString(reader.GetOrdinal("LastName")),
                            RoleName = reader.GetString(reader.GetOrdinal("RoleName"))
                        };
                        result.Add(dto);
                    }
                }
            }

            return result;
        }
    }
}



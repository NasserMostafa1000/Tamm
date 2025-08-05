using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.ListingReports.ListingReportsDTOs;

namespace TammDataLayer.ListingReports
{
    public class ListingReportsQueries
    {
        public static async Task<List<ReportDetailsDto>> GetListingReportsDetails(string lang)
        {
            var results = new List<ReportDetailsDto>();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetListingReportsDetails", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                // تأكد من القيمة المرسلة آمنة ومناسبة
                cmd.Parameters.Add("@Lang", SqlDbType.VarChar, 2).Value = lang ?? "en";

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        results.Add(new ReportDetailsDto
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId")),
                            ReasonText = reader["ReasonText"].ToString(),
                            ReportId = reader.GetInt32(reader.GetOrdinal("ReportId"))
                        });
                    }
                }
            }

            return results;
        }
        public static async Task<ListingReportUsersDto> GetListingReportsWithUsersInfoAsync(int reportId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetListingReportsWithUsersInfo", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ReportId", reportId);

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new ListingReportUsersDto
                        {
                            ListingId = Convert.ToInt32(reader["ListingId"]),
                            ReporterUserId = Convert.ToInt32(reader["ReporterUserId"]),
                            ListingOwnerUserId = Convert.ToInt32(reader["ListingOwnerUserId"])
                        };
                    }
                }
            }

            return null;
        }
    }
}


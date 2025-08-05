using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.ListingReports.ListingReportsDTOs;

namespace TammDataLayer.ListingReports.ListingReportReasons
{
    public static class ListingReportsReasons
    {
        public static async Task<List<ReasonDto>> GetReportReasonsAsync(string lang)
        {
            List<ReasonDto> reasons = new List<ReasonDto>();

            using SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString);
            using SqlCommand cmd = new SqlCommand("SELECT Id, ReasonNameEn, ReasonNameAr FROM Reasons", conn);

            await conn.OpenAsync();
            using SqlDataReader reader = await cmd.ExecuteReaderAsync();

            while (await reader.ReadAsync())
            {
                reasons.Add(new ReasonDto
                {
                    Id = reader.GetInt32(0),
                    ReasonName = lang == "ar" ? reader.GetString(2) : reader.GetString(1)
                });
            }

            return reasons;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.ListingReports
{
    public static class ListingReportsCommandsDAL
    {
        public static async Task InsertListingReportAsync(int userId, int listingId, int reasonId)
        {
            try
            {

            using SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString);
            using SqlCommand cmd = new SqlCommand("InsertListingReport", conn)
            {
                CommandType = CommandType.StoredProcedure
            };
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@ListingId", listingId);
            cmd.Parameters.AddWithValue("@ReasonId", reasonId);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
            }catch(Exception ex)
            {
                throw new Exception(ex.Message.ToString());
            }
        }
        public static async Task ApproveReportAndDeleteAdAsync(int adId, int reportId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("ApproveReportAndDeleteAd", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@AdId", adId);
                cmd.Parameters.AddWithValue("@ReportId", reportId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public static async Task RejectListingReportAsync(int reportId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("RejectReport", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ReportId", reportId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }

    }
}

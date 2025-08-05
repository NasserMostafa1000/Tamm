using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer
{
    public static class Settings
    {
         public static string _ProductionConnectionString = "Data Source=SQL1004.site4now.net;Initial Catalog=db_abc1c6_tammuae;User Id=db_abc1c6_tammuae_admin;Password=Naser0120#";
         public static string _ProductionBackendServerPath = "https://tammuae-001-site1.qtempurl.com/";

       // public static string _EnvConnectionString = "Server=localhost;Database=TammDB;User Id=Sa;Password=Naser0120#;TrustServerCertificate=True;";

//        public static string _EnvBackendServerPath = "https://localhost:7244/";


        public static byte AdminId = 23;
        public static async Task UpdateCoinRateAsync(decimal newValue)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpdateCoinRate", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@NewValue", newValue);
                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public static async Task UpdateAdPostingPriceAsync(decimal newAmount)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpdateAdPostingPrice", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@NewAmount", newAmount);
                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public  static async Task<decimal> GetCoinRate()
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("SELECT TOP 1 CoinPrice FROM CoinPrice", conn))
            {
                conn.Open();
                var result = cmd.ExecuteScalar();
                return result != null ? Convert.ToDecimal(result) : 0;
            }
        }

        public  static async Task<decimal> GetAdPrice()
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("SELECT TOP 1 CoinAmount FROM AdPostingPrice", conn))
            {
                conn.Open();
                var result = cmd.ExecuteScalar();
                return result != null ? Convert.ToDecimal(result) : 0;
            }
        }
        public static string _ProductionFrontendServerPath = "https://tamm-uae.netlify.app/";


    }
}

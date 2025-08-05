using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Coins.CoinsDTOs;

namespace TammDataLayer.Coins
{
    public static  class CoinsCommandsDAL
    {
        // ✅ Add Coin Package
        public static async Task<bool> AddCoinPackageAsync(int coinsAmount, decimal coinPrice)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("AddCoinPackage", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CoinsAmount", coinsAmount);
                cmd.Parameters.AddWithValue("@CoinPrice", coinPrice);

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
        }
        public static async Task<bool> UpdateCoinPackageAsync(int coinId, int coinsAmount, decimal coinPrice)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpdateCoinPackage", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CoinId", coinId);
                cmd.Parameters.AddWithValue("@CoinsAmount", coinsAmount);
                cmd.Parameters.AddWithValue("@CoinPrice", coinPrice);

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
        }
        public static async Task<bool> DeleteCoinPackageAsync(int coinId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("DeleteCoinPackage", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CoinId", coinId);

                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();

                return rowsAffected > 0;
            }
        }


    }
}


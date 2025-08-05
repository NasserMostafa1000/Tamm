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
    public static class CoinsQueriesDAL
    {
        public static async Task<List<CoinPriceDto>> GetAllCoinPackagesAsync()
        {
            var result = new List<CoinPriceDto>();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetAllCoinPackages", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result.Add(new CoinPriceDto
                        {
                            CoinId = Convert.ToInt32(reader["CoinId"]),
                            CoinsAmount = Convert.ToInt32(reader["CoinsAmount"]),
                            CoinPrice = Convert.ToDecimal(reader["CoinPrice"])
                        });
                    }
                }
            }

            return result;
        }
        public static async Task<UserCoinsDto> GetCoinsForSpecificUserAsync(int userId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetCoinsForSpecificUser", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new UserCoinsDto
                        {
                            Coins = reader.GetDecimal(reader.GetOrdinal("Coins"))
                        };
                    }
                }
            }

            return null; // أو ممكن ترجع صفر لو حبيت
        }

    }
}


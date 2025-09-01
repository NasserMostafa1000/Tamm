using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.Payments
{
    public static class PendingPayments
    {
        public class PendingOrder
        {
            public string PayPalOrderId { get; set; } 
            public int ClientId { get; set; }
            public int AmountOfCoins { get; set; }
            public int PaymentMethodId { get; set; }
            public decimal TotalCostAED { get; set; }
        }

        public static async Task AddPendingOrderAsync(PendingOrder order)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("AddPendingOrder", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PayPalOrderId", order.PayPalOrderId);
                cmd.Parameters.AddWithValue("@ClientId", order.ClientId);
                cmd.Parameters.AddWithValue("@AmountOfCoins", order.AmountOfCoins);
                cmd.Parameters.AddWithValue("@PaymentMethodId", order.PaymentMethodId);
                cmd.Parameters.AddWithValue("@TotalCostUsd", order.TotalCostAED);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }

        // ✅ Get Pending Order by PayPalOrderId
        public static async Task<PendingOrder?> GetPendingOrderByIdAsync(string payPalOrderId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetPendingOrderByPayPalOrderId", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PayPalOrderId", payPalOrderId);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return new PendingOrder
                        {
                            PayPalOrderId = reader["PayPalOrderId"].ToString(),
                            ClientId = Convert.ToInt32(reader["ClientId"]),
                            AmountOfCoins = Convert.ToInt32(reader["amountOfCoins"]),
                            PaymentMethodId = Convert.ToInt32(reader["paymentMethodId"]),
                            TotalCostAED = Convert.ToDecimal(reader["totalCostUsd"])
                        };
                    }
                }
            }

            return null; // لو مش لاقي
        }

        // ✅ Delete Pending Order by PayPalOrderId
        public static async Task DeletePendingOrderByIdAsync(string payPalOrderId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("DeletePendingOrderByPayPalOrderId", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PayPalOrderId", payPalOrderId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
    }

}


using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.Payments
{
    public static class PaymentsCommandsDAL
    {
        public static async Task<bool> AddPaymentAsync(int clientId, int amountOfCoins, int paymentMethodId, decimal totalCost,string PayPalOrderId)
        {
            using (SqlConnection connection = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand command = new SqlCommand("AddPayment", connection))
            {
                command.CommandType = CommandType.StoredProcedure;

                command.Parameters.AddWithValue("@ClientId", clientId);
                command.Parameters.AddWithValue("@AmountOfCoins", amountOfCoins);
                command.Parameters.AddWithValue("@PaymentMethodId", paymentMethodId);
                command.Parameters.AddWithValue("@TotalCost", totalCost);
                command.Parameters.AddWithValue("@PayPalOrderId", PayPalOrderId);


                try
                {
                    await connection.OpenAsync();
                    int result = await command.ExecuteNonQueryAsync();

                    return result > 0;
                }
                catch (Exception ex)
                {
                    // اختياري: سجل الخطأ في ملف أو سيرفر لوج
                    Console.WriteLine("خطأ أثناء تسجيل الدفع: " + ex.Message);
                    return false;
                }
            
        }
    }
}
}

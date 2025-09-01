using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Payments
{
    public class PaymentsCommandsServices : IPayments
    {
        public async Task<bool> AddPaymentAsync(int clientId, int amountOfCoins, int paymentMethodId, decimal totalCost, string PayPalOrderId)
        {
            try
            {
              return  await  TammDataLayer.Payments.PaymentsCommandsDAL.AddPaymentAsync(clientId,amountOfCoins,paymentMethodId,totalCost, PayPalOrderId);
            }catch
            {
                throw;
            }
        }
    }
}

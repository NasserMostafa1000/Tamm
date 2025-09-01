using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Payments
{
    public class PendingPayments : IPendingPayments
    {
        public async Task AddPendingOrderAsync(TammDataLayer.Payments.PendingPayments.PendingOrder order)
        {
            try
            {
                  await TammDataLayer.Payments.PendingPayments.AddPendingOrderAsync(order);
            }
            catch
            {
                throw;
            }
        }

        public async Task DeletePendingOrderByIdAsync(string payPalOrderId)
        {
            try
            {
                 await  TammDataLayer.Payments.PendingPayments.DeletePendingOrderByIdAsync(payPalOrderId);
            }
            catch
            {
                throw;
            }
        }

        public async Task<TammDataLayer.Payments.PendingPayments.PendingOrder?> GetPendingOrderByIdAsync(string payPalOrderId)
        {
            try
            {
              var PaymentsOrder= await  TammDataLayer.Payments.PendingPayments.GetPendingOrderByIdAsync(payPalOrderId);
                return PaymentsOrder == null ? null : PaymentsOrder;
            }
            catch
            {
                throw;
            }
        }
    }
}

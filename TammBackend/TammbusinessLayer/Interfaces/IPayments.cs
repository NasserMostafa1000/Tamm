using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    public interface IPayments
    {
        Task<bool> AddPaymentAsync(int clientId, int amountOfCoins, int paymentMethodId, decimal totalCost,string PayPalOrderId);
    }
}

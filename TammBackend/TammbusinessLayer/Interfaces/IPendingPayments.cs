using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Payments.PendingPayments;

namespace TammbusinessLayer.Interfaces
{
    public interface IPendingPayments
    {
        Task AddPendingOrderAsync(PendingOrder order);
        Task<PendingOrder?> GetPendingOrderByIdAsync(string payPalOrderId);
        Task DeletePendingOrderByIdAsync(string payPalOrderId);
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    public interface ICoinCommands
    {
        Task<bool> AddCoinPackageAsync(int coinsAmount, decimal coinPrice);
        Task<bool> UpdateCoinPackageAsync(int coinId, int coinsAmount, decimal coinPrice);
        Task<bool> DeleteCoinPackageAsync(int coinId);
    }
}

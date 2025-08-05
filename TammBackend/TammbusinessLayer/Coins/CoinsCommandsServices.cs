using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Coins
{
    public class CoinsCommandsServices : ICoinCommands
    {
        public  async Task<bool> AddCoinPackageAsync(int coinsAmount, decimal coinPrice)
        {
            try
            {
                return await TammDataLayer.Coins.CoinsCommandsDAL.AddCoinPackageAsync(coinsAmount, coinPrice);
            }catch
            {
                throw;
            }
        }

        public async Task<bool> DeleteCoinPackageAsync(int coinId)
        {
            try
            {
                return await  TammDataLayer.Coins.CoinsCommandsDAL.DeleteCoinPackageAsync(coinId);
            }
            catch
            {
                throw;
            }
        }

        public async Task<bool> UpdateCoinPackageAsync(int coinId, int coinsAmount, decimal coinPrice)
        {
            try
            {
                return await  TammDataLayer.Coins.CoinsCommandsDAL.UpdateCoinPackageAsync(coinId, coinsAmount, coinPrice);
            }catch
            {
                throw;
            }
        }
    }
}

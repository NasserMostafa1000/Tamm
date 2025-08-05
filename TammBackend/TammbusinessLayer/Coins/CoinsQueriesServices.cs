using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Coins;

namespace TammbusinessLayer.Coins
{
    public class CoinsQueriesServices : ICoinQueries
    {
        public async Task<List<CoinsDTOs.CoinPriceDto>> GetAllCoinPackagesAsync()
        {
            try
            {
                return await TammDataLayer.Coins.CoinsQueriesDAL.GetAllCoinPackagesAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<CoinsDTOs.UserCoinsDto> GetCoinsForSpecificUserAsync(int userId)
        {
            try
            {
                return await TammDataLayer.Coins.CoinsQueriesDAL.GetCoinsForSpecificUserAsync(userId);
            }catch
            {
                throw;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Coins.CoinsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface ICoinQueries
    {
        Task<List<CoinPriceDto>> GetAllCoinPackagesAsync();
         Task<UserCoinsDto> GetCoinsForSpecificUserAsync(int userId);
    }
}

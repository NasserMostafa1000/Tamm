using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Coins
{
    public class CoinsDTOs
    {
        public class CoinPriceDto
        {
            public int CoinId { get; set; }
            public int CoinsAmount { get; set; }
            public decimal CoinPrice { get; set; }
        }
        public class UserCoinsDto
        {
            public decimal Coins { get; set; }
        }


    }
}

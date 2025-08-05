using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Favorites.FavoritesDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IFavoriteQueries
    {
        Task<List<FavoriteListingDto>> GetFavoriteListingsAsync(int userId, string lang);
    }
}

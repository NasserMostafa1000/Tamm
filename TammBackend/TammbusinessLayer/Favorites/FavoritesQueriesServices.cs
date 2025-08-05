using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Favorites;

namespace TammbusinessLayer.Favorites
{
    public class FavoritesQueriesServices : IFavoriteQueries
    {
        public Task<List<FavoritesDTOs.FavoriteListingDto>> GetFavoriteListingsAsync(int userId, string lang)
        {
            try
            {
                return TammDataLayer.Favorites.FavoritesQueriesDAL.GetFavoriteListingsAsync(userId, lang);
            }catch
            {
                throw;
            }
        }
    }
}

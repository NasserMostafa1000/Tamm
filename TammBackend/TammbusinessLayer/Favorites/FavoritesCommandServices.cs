using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Favorites
{
    public class FavoritesCommandServices : IFavoriteCommands
    {
        public async Task<bool> DeleteFavoriteAsync(int favoriteId)
        {
           try
            {
                return await TammDataLayer.Favorites.FavoritesCommandDataAccessLayer.DeleteFavoriteAsync(favoriteId);
            }
            catch
            {
                throw;
            }
        }

        public async Task InsertInfoFavoritesAsync(int userId, int listingId)
        {
            try
            {
                await TammDataLayer.Favorites.FavoritesCommandDataAccessLayer.InsertInfoFavorites(userId, listingId);
            }catch(Exception)
            {
                throw;
            }
        }
    }
}

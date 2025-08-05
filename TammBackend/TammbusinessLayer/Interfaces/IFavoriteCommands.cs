using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    public interface IFavoriteCommands
    {
        Task InsertInfoFavoritesAsync(int userId, int listingId);
        Task<bool> DeleteFavoriteAsync(int favoriteId);
    }
}

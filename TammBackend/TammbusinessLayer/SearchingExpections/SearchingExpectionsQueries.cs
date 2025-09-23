using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.SearchingExpections
{
    public class SearchingExpectionsQueries : ISearchingExpectionsQueries
    {
        public async Task<string> GetUserLastCategoryAsync(string userUUID)
        {
            try
            {
                return await TammDataLayer.SearchingExpections.SearchingExpectionsQueries.GetUserLastCategoryAsync(userUUID);
            }catch
            {
                throw;
            }
        }
    }
}

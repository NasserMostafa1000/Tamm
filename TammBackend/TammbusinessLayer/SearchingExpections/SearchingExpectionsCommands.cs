using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.SearchingExpections
{
    public class SearchingExpectionsCommands : ISearchingExpectionsCommands
    {
        public Task AddOrUpdateUserSearchAsync(string userUUID, int ListingId)
        {
            try
            {
                return TammDataLayer.SearchingExpections.SearchingExpectionsCommands.AddOrUpdateUserSearchAsync(userUUID, ListingId);
            }catch
            {
                throw;
            }
        }
    }
}

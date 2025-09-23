namespace TammbusinessLayer.Interfaces
{
    public interface ISearchingExpectionsCommands
    {
        Task AddOrUpdateUserSearchAsync(string userUUID, int ListingId);
      
    }
}

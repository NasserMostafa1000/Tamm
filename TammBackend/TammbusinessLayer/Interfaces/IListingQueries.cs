using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ListingReports.ListingReportsDTOs;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingQueries
    {
        Task<List<ListingPreviewDtoV2>> GetClientsListingsPreviewByPersonIdAsync(string lang, int UserId);
        Task<FullListingForEditDTO?> GetFullListingForEditAsync(int listingId);
        Task<(List<ListingPreviewDto> Listings, int TotalCount)> SearchOnTammAsync(string lang, string filterWith, int pageNumber, int pageSize,decimal min ,decimal max);
        Task<List<ListingPreviewDto>> GetListingPreviewByLangAsync(string lang, string filterWith, string currentPlace);
        Task<ListingDetailsDto> FindById(string lang, int listingId);
        Task<List<ListingPreviewDto>> GetListingsPreviewByPersonIdAsync(string lang, int UserId);
        Task<List<unApprovedListings>> GetUnapprovedListingsAsync();
         Task<ListingDetailsDto> GetListingByIdForAdminAsync(string lang, int listingId);
        Task<PriceRangeDto> GetMinAndMaxPricesForSubcategory(string subCategoryName);

    }
}

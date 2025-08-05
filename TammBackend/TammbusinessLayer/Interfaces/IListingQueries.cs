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
        Task<(List<ListingPreviewDto> Listings, int TotalCount)> SearchOnTammAsync(string lang, string filterWith, int pageNumber, int pageSize);
        Task<List<ListingPreviewDto>> GetListingPreviewByLangAsync(string lang, string filterWith, string currentPlace);
        Task<ListingDetailsDto> FindById(string lang, int listingId);
        Task<List<ListingPreviewDto>> GetListingsPreviewByPersonIdAsync(string lang, int UserId);
        Task<List<unApprovedListings>> GetUnapprovedListingsAsync();
         Task<ListingDetailsDto> GetListingByIdForAdminAsync(string lang, int listingId);

    }
}

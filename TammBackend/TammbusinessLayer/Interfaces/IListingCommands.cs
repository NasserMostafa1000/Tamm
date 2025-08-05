using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.Listings;
using static TammDataLayer.ListingReports.ListingReportsDTOs;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingCommands
    {
        Task<int> InsertListingAsync(ListingsDtos.PostListingDTO dto);

        Task DeleteListingAndImagesAsync(int listingId);
        Task ApproveListingReportAsync(int listingId);



    }
}

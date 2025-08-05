using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ListingReports;
using TammDataLayer.Listings;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammbusinessLayer.Listings
{
    public class ListingQueriesServices:IListingQueries
    {
        public async Task<(List<ListingPreviewDto> Listings, int TotalCount)> SearchOnTammAsync(string lang, string filterWith, int pageNumber, int pageSize)
        {
            try
            {
                return await TammDataLayer.Listings.ListingQueriesDAL.SearchOnTammAsync(lang, filterWith, pageNumber, 10);
            }
            catch
            {
                throw;
            }
        }
        public async Task<List<ListingPreviewDto>> GetListingPreviewByLangAsync(string lang, string filterWith,string CurrentPlace)
        {
            try
            {
                return await ListingQueriesDAL.GetListingPreviewByLangAsync(lang, filterWith, CurrentPlace);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ListingDetailsDto> FindById(string lang, int listingId)
        {
            try
            {
                return await TammDataLayer.Listings.ListingQueriesDAL.GetListingByIdAsync(lang, listingId);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<ListingPreviewDto>> GetListingsPreviewByPersonIdAsync(string lang, int UserId)
        {
            try
            {
                return await TammDataLayer.Listings.ListingQueriesDAL.GetListingsPreviewByPersonIdAsync(lang, UserId);
            }catch(Exception)
            {
                throw;
            }
        }

        public async Task<List<unApprovedListings>> GetUnapprovedListingsAsync()
        {
            try
            {
             return await  TammDataLayer.Listings.ListingQueriesDAL.GetUnapprovedListingsIdsAsync();
            }
            catch
            {
                throw;
            }
        }

        public async Task<ListingDetailsDto> GetListingByIdForAdminAsync(string lang, int listingId)
        {
            try
            {
                return await  TammDataLayer.Listings.ListingQueriesDAL.GetListingByIdForAdminAsync(lang, listingId);
            }catch(Exception)
            {
                throw;
            }
        }

    }
}

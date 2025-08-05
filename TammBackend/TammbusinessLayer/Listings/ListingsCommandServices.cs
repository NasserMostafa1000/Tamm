using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Listings;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammbusinessLayer.Listings
{
    public class ListingsCommandServices:IListingCommands
    {
        public async Task ApproveListingReportAsync(int listingId)
        {
            try
            {
                await TammDataLayer.Listings.ListingsCommands.ApproveListingAsync(listingId);   
            }catch
            {
                throw;
            }
        }

        public async Task DeleteListingAndImagesAsync(int listingId)
        {
            try
            {
                 await TammDataLayer.Listings.ListingsCommands.DeleteListingAndImagesAsync(listingId);
            }catch(Exception)
            {
                throw;
            }
        }

        public async Task<int> InsertListingAsync(ListingsDtos.PostListingDTO dto)
        {
            try
            {
                return await ListingsCommands.AddListingAsync(dto);
            }
            catch 
            {
                throw;
            }
        }

    }
}

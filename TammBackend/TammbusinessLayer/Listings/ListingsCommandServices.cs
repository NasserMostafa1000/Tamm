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
        public async Task ApproveListingReportAsync(int listingId,int CurrentEmployee)
        {
            try
            {
                await TammDataLayer.Listings.ListingsCommands.ApproveListingAsync(listingId, CurrentEmployee);   
            }catch
            {
                throw;
            }
        }

        public async Task DeleteListingAndImagesAsync(int listingId, int CurrentEmployee)
        {
            try
            {
                 await TammDataLayer.Listings.ListingsCommands.DeleteListingAndImagesAsync(listingId, CurrentEmployee);
            }catch(Exception)
            {
                throw;
            }
        }

        public async Task EditListingReasonAsync(int listingId, string reason,int CurrentEmployee)
        {
           try
            {
              await  TammDataLayer.Listings.ListingsCommands.EditListingReasonAsync(listingId, reason, CurrentEmployee);
            }catch(Exception ex)
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

        public async Task UpdateListingFullAsync(UpdateListingFullDTO dto)
        {
           try
            {
               await TammDataLayer.Listings.ListingsCommands.UpdateListingFullAsync(dto);
                // حذف الصور القديمة فعلياً من wwwroot/AdImages
              

            }
            catch
            {
                throw;
            }
        }
    }
}

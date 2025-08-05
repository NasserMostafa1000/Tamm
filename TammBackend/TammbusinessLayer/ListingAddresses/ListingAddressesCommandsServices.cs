using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ListingsAddresses;

namespace TammbusinessLayer.ListingAddresses
{
    public class ListingAddressesCommandsServices : IListingAddressCommand
    {
        public async Task<int> InsertListingAddressAsync(ListingsAddressesDtos.InsertListingAddressDto dto)
        {
            try
            {
              return await ListingsAddressesCommands.InsertListingAddressAsync(dto);
            }catch(Exception)
            {
                throw;
            }
        }
    }
}

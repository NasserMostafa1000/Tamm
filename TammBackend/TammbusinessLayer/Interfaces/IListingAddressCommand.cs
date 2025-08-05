using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ListingsAddresses.ListingsAddressesDtos;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingAddressCommand
    {
            Task<int> InsertListingAddressAsync(InsertListingAddressDto dto);
        
    }
}

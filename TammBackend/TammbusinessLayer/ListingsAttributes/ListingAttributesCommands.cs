using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using static TammDataLayer.ListingsAttributes.ListingAttributesDTOs;
using static TammDataLayer.ListingsAttributes.ListingsAttributesCommands;

namespace TammbusinessLayer.ListingsAttributes
{
    public class ListingAttributesCommands:IListingAttributeCommand
    {
        public  async Task AddListingAttribute(List<ListingAttributeDto> DTOs)
        {
            if (DTOs == null || DTOs.Count == 0)
                throw new ArgumentNullException(nameof(DTOs), "The list of attributes is empty.");

            foreach (var dto in DTOs)
            {
                if (dto.ListingId <= 0 || dto.AttributeId <= 0)
                    throw new ArgumentException("ListingId and AttributeId must be valid for each attribute.");

                await ListingAttributesData.InsertListingAttribute(dto);
            }
        }

    }
}

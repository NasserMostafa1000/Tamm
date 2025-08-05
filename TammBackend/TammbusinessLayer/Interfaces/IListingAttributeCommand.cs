using static TammDataLayer.ListingsAttributes.ListingAttributesDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingAttributeCommand
    {
        Task AddListingAttribute(List<ListingAttributeDto> DTOs);
    }
}
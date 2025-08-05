using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.ListingsAddresses
{
    public class ListingsAddressesDtos
    {
        public class InsertListingAddressDto
        {
            public int CityPlaceId { get; set; }
            public decimal? Longitude { get; set; }
            public decimal? Latitude { get; set; }
            public string? MoreDetailsEn { get; set; }
            public string? MoreDetailsAr { get; set; }
        }
    }
}

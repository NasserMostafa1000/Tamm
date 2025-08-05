using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.ListingsAttributes
{
    public class ListingAttributesDTOs
    {
        public class ListingAttributeDto
        {
            public int ListingId { get; set; }
            public int AttributeId { get; set; }
            public string Value { get; set; } = null!;
        }

    }
}

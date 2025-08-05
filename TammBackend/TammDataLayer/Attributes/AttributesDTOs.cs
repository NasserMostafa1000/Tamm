using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Attributes
{
    public class AttributesDTOs
    {
        public class GetAttributesForCategoryDto
        {
            public int AttributeId { get; set; }
            public int CategoryId { get; set; }
            public string AttributeName { get; set; } = string.Empty;
            public string? Unit { get; set; }
        }
        public class PostAttributeDto
        {
            public int CategoryId { get; set; }
            public string AttributeNameEn { get; set; } = null!;
            public string AttributeNameAR { get; set; } = null!;
            public string? UnitEn { get; set; } 
            public string? UnitAr { get; set; }
        }

    }

}

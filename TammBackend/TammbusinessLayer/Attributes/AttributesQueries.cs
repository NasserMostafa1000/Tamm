using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using static TammDataLayer.Attributes.AttributesDTOs;

namespace TammbusinessLayer.Attributes
{
    public class AttributesQueries:IAttributeQueries
    {
        public async Task<List<GetAttributesForCategoryDto>> GetAttributesForCategoryAsync(int categoryId, string lang)
        {
            try
            {
                return await TammDataLayer.Attributes.AttributesQueries.GetAttributesForCategoryAsync(categoryId, lang);
            }
            catch
            {
                throw;
            }
        }
    }
}

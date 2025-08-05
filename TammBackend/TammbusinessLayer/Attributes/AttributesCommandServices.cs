using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using static TammDataLayer.Attributes.AttributesDTOs;

namespace TammbusinessLayer.Attributes
{
    public class AttributesCommandServices:IAttributeCommand
    {
        public async Task InsertAttributeAsync(PostAttributeDto DTO)
        {
            try
            {
                await   TammDataLayer.Attributes.AttributesCommandsDAL.InsertAttribute(DTO);
            }
            catch(Exception)
            {
                throw;
            }
        }
    }
}

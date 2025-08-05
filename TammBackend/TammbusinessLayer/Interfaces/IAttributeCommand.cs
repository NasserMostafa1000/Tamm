using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Attributes.AttributesDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IAttributeCommand
    {
        Task InsertAttributeAsync(PostAttributeDto DTO);
    }
}

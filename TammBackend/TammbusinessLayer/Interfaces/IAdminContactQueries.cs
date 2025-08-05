using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.AdminContacts.AdminContactsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IAdminContactQueries
    {
        Task<ContactUsDto> GetContactUsAsync();
    }
}

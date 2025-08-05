using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.AdminContacts;

namespace TammbusinessLayer.AdminContacts
{
    public class AdminContactsCommandsServices : IAdminContactCommands
    {
        public async Task<bool> UpdateContactUsAsync(AdminContactsDTOs.ContactUsDto dto)
        {
            try
            {
                return await TammDataLayer.AdminContacts.AdminContactsCommandsDAL.UpdateContactUsAsync(dto);
            }catch
            {
                throw;
            }
        }
    }
}

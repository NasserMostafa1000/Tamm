using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.AdminContacts;

namespace TammbusinessLayer.AdminContacts
{
    public class AdminContactsQueriesServices : IAdminContactQueries
    {
        public async Task<AdminContactsDTOs.ContactUsDto> GetContactUsAsync()
        {
            try
            {
                return await TammDataLayer.AdminContacts.AdminContactsQueriesDAL.GetContactUsAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}

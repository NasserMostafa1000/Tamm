using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Users
{
    public class UsersQueriesServices : IUserQueries
    {
        public async Task<List<string>> GetAllUserEmailsAsync()
        {
            try
            {
                return await TammDataLayer.Users.UsersQueriesDAL.GetAllUserEmailsAsync();
            }
            catch
            {
                throw;
            }
        }
    }
}

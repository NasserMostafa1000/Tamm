using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Users;

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

        public async Task<string> GetLoginProviderNameAsync(int personId)
        {
            try
            {
                return await  UsersQueriesDAL.GetLoginProviderNameAsync(personId);
            }catch
            {
                throw;
            }
        }

        public async Task<string> GetLoginProviderNameByEmailAsync(string email)
        {
            try
            {
                return await UsersQueriesDAL.GetLoginProviderNameByEmailAsync(email);
            }
            catch
            {
                throw;
            }
        }

        public async Task<int> GetPersonIdByUserId(int userId)
        {
            try
            {
                return await UsersQueriesDAL.GetPersonIdByUserId(userId);
            }catch
            {
                throw;
            }
        }
    }
}

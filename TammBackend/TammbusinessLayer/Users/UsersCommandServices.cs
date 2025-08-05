using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.Users
{
    public class UsersCommandServices : IUsersCommands
    {
        public async Task<bool> BlockPersonAsync(int personId)
        {
           try
            {
                return await TammDataLayer.Users.UsersCommandDAL.BlockPersonAsync(personId);
            }catch
            {
                throw;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.ClientsDAL;
using TammDataLayer.Helper;

namespace TammDataLayer.Registration
{
    public class TammRegistration : IRegister
    {
        public async Task<int> RegisterAsync(ClientsDTOs.AddClientDTO dto)
        {
            try
            {
                //password at tamm registration can not be null here
              dto.HashedPassword=  PasswordHelper.HashPassword(dto.HashedPassword);
            return  int.Parse(await ClientsDAL.clsClientsCommand.AddAsync(dto));   
            }catch(Exception)
            {
                throw;
            }
        }

    }
}

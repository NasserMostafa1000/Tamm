using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.ClientsDAL;

namespace TammDataLayer.Registration
{
    public class AppleRegistration : IRegister
    {
        public Task<int> RegisterAsync(ClientsDTOs.AddClientDTO dto)
        {
            throw new NotImplementedException();
        }
    }
}

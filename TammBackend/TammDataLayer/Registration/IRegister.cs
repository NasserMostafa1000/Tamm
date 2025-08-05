using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.ClientsDAL;

namespace TammDataLayer.Registration
{
    public interface IRegister
    {
        Task<int> RegisterAsync(ClientsDTOs.AddClientDTO dto);
    }
}

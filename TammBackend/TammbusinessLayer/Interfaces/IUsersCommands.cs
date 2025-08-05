using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    public interface IUsersCommands
    {
        Task<bool> BlockPersonAsync(int personId);
    }
}

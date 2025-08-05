using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.ClientsDAL;
using static TammDataLayer.ClientsDAL.ClientsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IClientQueries
    {
        Task<ClientsDTOs.ClientData> GetUserDetailsByIdAsync(int userId);
        Task<string> TryLoginAsync(string email, string plainPassword, string Lang);
         Task<string?> GetImageUrlByUserIdAsync(int userId);
        Task<PagedClientsResultDto> GetClientsPagedAsync(int pageNumber, int pageSize);
    }
}

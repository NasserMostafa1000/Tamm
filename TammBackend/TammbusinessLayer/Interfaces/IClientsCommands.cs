using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using TammDataLayer.ClientsDAL;
using static TammDataLayer.ClientsDAL.ClientsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public  interface IClientsCommands
    {
        Task<string> RegisterAsync(ClientsDTOs.AddClientDTO dto);
        Task UpdateUserProfileAsync(UpdateClientProfileDto dto);
        Task<bool> UpdatePersonImageByUserIdAsync(int userId, string imageUrl);
        Task<bool> DeletePersonAndAddressesAndGetImagePathsAsync(int personId);
    }
}

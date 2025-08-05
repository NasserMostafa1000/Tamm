using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.ClientsDAL;

namespace TammDataLayer.Registration
{
    public class GoogleRegistration : IRegister
    {
        public async Task<int> RegisterAsync(ClientsDTOs.AddClientDTO dto)
        {
            try
            {
                string clientId = await ClientsDAL.clsClientsCommand.AddAsync(dto);
                return int.Parse(clientId);
            }
            catch (Exception ex)
            {
                string errorMessage = ex.Message;

                if (errorMessage.Contains("البريد الإلكتروني مستخدم من قبل. من فضلك استخدم بريدًا آخر")||errorMessage== "This email already exists. Please use another one." || errorMessage== "البريد الإلكتروني مستخدم من قبل. من فضلك استخدم بريدًا آخر" || errorMessage.Contains("This email already exists.")) 
                {
                    int clientId = await clsClientsQueries.GetClientIdByEmail(dto.Email);
                    return clientId;
                }
                else
                {
                    throw (new Exception(ex.Message.ToString()));
                }
            }
        }
    }
}

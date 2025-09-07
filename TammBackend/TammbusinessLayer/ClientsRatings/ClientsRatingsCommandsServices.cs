using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ClientsRatings;

namespace TammbusinessLayer.ClientsRatings
{
    public class ClientsRatingsCommandsServices : IClientRatingCommands
    {

        public async Task UpsertCustomerRatingAsync(int fromPersonId, int toPersonId, int ratingValue)
        {
           try
            {
                 await TammDataLayer.ClientsRatings.ClientsRatingCommandsDAL.UpsertCustomerRatingAsync(fromPersonId, toPersonId, ratingValue);
            }catch
            {
                throw;
            }
        }
    }
}

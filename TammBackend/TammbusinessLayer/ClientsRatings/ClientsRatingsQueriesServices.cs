using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ClientsRatings;

namespace TammbusinessLayer.ClientsRatings
{
    public class ClientsRatingsQueriesServices : IClientRatingQueries
    {
        public async Task<RatingsDTOS.CustomerRatingSummaryDto> GetCustomerAverageRating(int toPersonId)
        {

            try
            {
                return await TammDataLayer.ClientsRatings.ClientsRatingQueriesDAL.GetCustomerAverageRating(toPersonId);
            }catch
            {
                throw;
            }
        }
    }
}

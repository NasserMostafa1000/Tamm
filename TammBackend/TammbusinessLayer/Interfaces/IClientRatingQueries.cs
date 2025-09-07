using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ClientsRatings.RatingsDTOS;

namespace TammbusinessLayer.Interfaces
{
    public interface IClientRatingQueries
    {
        Task<CustomerRatingSummaryDto> GetCustomerAverageRating(int toPersonId);
    }
}

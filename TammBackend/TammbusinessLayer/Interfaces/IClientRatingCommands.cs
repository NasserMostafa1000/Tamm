using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ClientsRatings.RatingsDTOS;

namespace TammbusinessLayer.Interfaces
{
    public interface IClientRatingCommands
    {
        Task UpsertCustomerRatingAsync(int fromPersonId, int toPersonId, int ratingValue);
    }
}

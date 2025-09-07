using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.ClientsRatings
{
    public class RatingsDTOS
    {
        public class CustomerRatingDto
        {
            public int RatingId { get; set; }
            public int FromCustomerId { get; set; }
            public int ToCustomerId { get; set; }
            public int RatingValue { get; set; }
        }

        public class CustomerRatingSummaryDto
        {
            public int CustomerId { get; set; }
            public decimal AverageRating { get; set; }
            public int TotalRatings { get; set; }
        }
    }
}

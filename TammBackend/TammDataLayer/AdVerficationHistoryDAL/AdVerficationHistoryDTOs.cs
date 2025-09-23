using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.AdVerficationHistoryDAL
{
    public class AdVerficationHistoryDTOs
    {
        public class AdVerificationHistoryDto
        {
            public int ListingId { get; set; }
            public string CaseName { get; set; }
            public DateTime DateAndTime { get; set; }
            public int UserId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string RoleName { get; set; }
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.ListingReports
{
    public class ListingReportsDTOs
    {
        public class ReasonDto
        {
            public int Id { get; set; }
            public string ReasonName { get; set; }
        }
        public class ReportRequestDto
        {
            public int UserId { get; set; }
            public int ListingId { get; set; }
            public int ReasonId { get; set; }
        }
        public class ReportDetailsDto
        {
            public int ListingId { get; set; }
            public string ReasonText { get; set; } = null!;
            public int ReportId { get; set; }
        }
        public class ListingReportUsersDto
        {
            public int ListingId { get; set; }
            public int ReporterUserId { get; set; }
            public int ListingOwnerUserId { get; set; }
        }


    }
}

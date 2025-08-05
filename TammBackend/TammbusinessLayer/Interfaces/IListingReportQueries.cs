using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ListingReports.ListingReportsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingReportQueries
    {
       Task<List<ReportDetailsDto>> GetListingReportsDetailsAsync(string lang);
        Task<ListingReportUsersDto> GetListingReportsWithUsersInfoAsync(int reportId);

    }
}

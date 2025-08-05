using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ListingReports;

namespace TammbusinessLayer.ListingReports
{
    public class ListingReportsQueriesServices : IListingReportQueries
    {
        public async Task< List<ListingReportsDTOs.ReportDetailsDto>> GetListingReportsDetailsAsync(string lang)
        {
            try
            {
                return await TammDataLayer.ListingReports.ListingReportsQueries.GetListingReportsDetails(lang);
            }catch
            {
                throw;
            }
        }

        public async Task<ListingReportsDTOs.ListingReportUsersDto> GetListingReportsWithUsersInfoAsync(int reportId)
        {
            try
            {
             return   await TammDataLayer.ListingReports.ListingReportsQueries.GetListingReportsWithUsersInfoAsync(reportId);
            }catch
            {
                throw;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ListingReports;

namespace TammbusinessLayer.ListingReports.ListingReportsReasons
{
    public class ListingReportReasonsQueries : IListingReportReasonsQueries
    {
        public async Task<List<ListingReportsDTOs.ReasonDto>> GetReportReasonsAsync(string lang)
        {
            try
            {
                return await TammDataLayer.ListingReports.ListingReportReasons.ListingReportsReasons.GetReportReasonsAsync(lang);
            }
            catch
            {
                throw;
            }
        }
    }
}

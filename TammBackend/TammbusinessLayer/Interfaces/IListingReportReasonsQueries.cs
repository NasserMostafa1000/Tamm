using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.ListingReports.ListingReportsDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingReportReasonsQueries
    {
        Task<List<ReasonDto>> GetReportReasonsAsync(string lang);
    }
}

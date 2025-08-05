using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    public interface IListingReportsCommands
    {
        Task InsertListingReportAsync(int userId, int listingId, int reasonId);
        Task ApproveReportAndDeleteAdAsync(int adId, int reportId);
        Task RejectListingReportLAsync(int reportId);

    }
}

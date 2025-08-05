using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.ListingReports;

namespace TammbusinessLayer.ListingReports
{
    public  class ListingReportCommandsServices : IListingReportsCommands
    {

        public async Task ApproveReportAndDeleteAdAsync(int adId, int reportId)
        {
            try
            {
                await TammDataLayer.ListingReports.ListingReportsCommandsDAL.ApproveReportAndDeleteAdAsync(adId, reportId);
            }
            catch
            {
                throw;
            }
        }

        public async Task InsertListingReportAsync(int userId, int listingId, int reasonId)
        {
            try
            {
              await  TammDataLayer.ListingReports.ListingReportsCommandsDAL.InsertListingReportAsync(userId, listingId, reasonId);
            }catch
            {
                throw;
            }
        }
        public async Task RejectListingReportLAsync(int reportId)
        {
            try
            {
                await TammDataLayer.ListingReports.ListingReportsCommandsDAL.RejectListingReportAsync(reportId);
            }
            catch
            {
                throw;
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.AdVerficationHistoryDAL;

namespace TammbusinessLayer.AdVerficationHistory
{
    public class AdsVerficationsHistoriesQueriesServices : IAdVerficationHistoriyQueries
    {
        public async Task<List<AdVerficationHistoryDTOs.AdVerificationHistoryDto>> GetAdVerificationHistoryAsync(int? listingId = null)
        {
            try
            {
                return await TammDataLayer.AdVerficationHistoryDAL.AdVerficationHistoryQueriesDAL.GetAdVerificationHistoryAsync(listingId);
            }catch
            {
                throw;
            }
        }
    }
}

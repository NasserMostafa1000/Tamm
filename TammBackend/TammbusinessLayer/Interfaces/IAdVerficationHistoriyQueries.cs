using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.AdVerficationHistoryDAL.AdVerficationHistoryDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface IAdVerficationHistoriyQueries
    {
        Task<List<AdVerificationHistoryDto>> GetAdVerificationHistoryAsync(int? listingId = null);
    }
}

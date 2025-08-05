using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.ListingsAddresses.ListingsAddressesDtos;

namespace TammDataLayer.ListingsAddresses
{
    public static class ListingsAddressesCommands
    {
        public static async Task<int> InsertListingAddressAsync(InsertListingAddressDto dto)
        {
            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("InsertListingAddress", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CityPlaceId", dto.CityPlaceId);
                cmd.Parameters.AddWithValue("@Longitude", (object?)dto.Longitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Latitude", (object?)dto.Latitude ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MoreDetailsEn", (object?)dto.MoreDetailsEn ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@MoreDetailsAr", (object?)dto.MoreDetailsAr ?? DBNull.Value);

                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            }
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.ListingsAttributes.ListingAttributesDTOs;

namespace TammDataLayer.ListingsAttributes
{
    public static class ListingsAttributesCommands
    {
        public static class ListingAttributesData
        {
            public static async Task InsertListingAttribute(ListingAttributeDto dto)
            {
                using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
                {
                    using (SqlCommand cmd = new SqlCommand("InsertListingsAttributes", conn))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        cmd.Parameters.AddWithValue("@ListingId", dto.ListingId);
                        cmd.Parameters.AddWithValue("@AttributeId", dto.AttributeId);
                        cmd.Parameters.AddWithValue("@Value", string.IsNullOrEmpty(dto.Value) ? DBNull.Value : (object)dto.Value);

                        await conn.OpenAsync();
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
        }

    }
}

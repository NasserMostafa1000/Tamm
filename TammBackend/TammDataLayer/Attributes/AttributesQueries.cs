using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Attributes.AttributesDTOs;

namespace TammDataLayer.Attributes
{
    public  static class AttributesQueries
    {
     
        public static async Task<List<GetAttributesForCategoryDto>> GetAttributesForCategoryAsync(int categoryId, string lang)
        {
            List<GetAttributesForCategoryDto> attributes = new();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("GetAttributesForSpecificCategory", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@CategoryId", categoryId);
                    cmd.Parameters.AddWithValue("@Lang", lang);

                    await conn.OpenAsync();
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            attributes.Add(new GetAttributesForCategoryDto
                            {
                                AttributeId = Convert.ToInt32(reader["AttributeId"]),
                                CategoryId = Convert.ToInt32(reader["CategoryId"]),
                                AttributeName = reader["AttributeName"].ToString(),
                                Unit = reader["Unit"] == DBNull.Value ? null : reader["Unit"].ToString()
                            });
                        }
                    }
                }
            }

            return attributes;
        }
    }

}

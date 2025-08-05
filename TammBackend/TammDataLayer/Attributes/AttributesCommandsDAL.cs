using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.Attributes
{
    public static class AttributesCommandsDAL
    {
        public static async Task InsertAttribute(AttributesDTOs.PostAttributeDto attribute)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(Settings._ProductionConnectionString))
                {
                    using (SqlCommand command = new SqlCommand("InsertAttribute", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@CategoryId", attribute.CategoryId);
                        command.Parameters.AddWithValue("@AttributeNameEn", attribute.AttributeNameEn);
                        command.Parameters.AddWithValue("@AttributeNameAR", attribute.AttributeNameAR);
                        command.Parameters.AddWithValue("@UnitEn", (object)attribute.UnitEn ?? DBNull.Value);
                        command.Parameters.AddWithValue("@UnitAr", (object)attribute.UnitAr ?? DBNull.Value);

                        await connection.OpenAsync();
                        await command.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                // سجل الخطأ أو أعِد رميه
                Console.WriteLine($"Error in InsertAttribute: {ex.Message}");
                throw;
            }
        }

    }
}


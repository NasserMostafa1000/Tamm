using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Categories.CategoriesDTOs;

namespace TammDataLayer.Categories
{
    public class CategoriesQueries
    {

        public static async Task<List<GetParentsCategoriesDTO>> GetTopLevelCategoriesAsync(string language)
        {
            var result = new List<GetParentsCategoriesDTO>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetParentsCategories", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Language", language);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result.Add(new GetParentsCategoriesDTO
                        {
                            CategoryId = reader.GetInt32(reader.GetOrdinal("CategoryId")),
                            CategoryName = reader.GetString(reader.GetOrdinal("CategoryName")),
                            ParentCategoryId = reader.IsDBNull(reader.GetOrdinal("ParentCategoryId"))
                                ? null
                                : reader.GetString(reader.GetOrdinal("ParentCategoryId"))
                        });
                    }
                }
            }

            // ترتيب مخصص: عقارات/Real Estate = 0، سيارات/Cars = 1، الباقي = 2
            return result
                .OrderBy(x =>
                    x.CategoryName == "عقارات" || x.CategoryName.ToLower() == "real estate" ? 0 :
                    x.CategoryName == "سيارات" || x.CategoryName.ToLower() == "cars" ? 1 : 2)
                .ThenBy(x => x.CategoryName)
                .ToList();
        }



        public static async Task<List<GetSubCategoryDTO>> GetSubCategoriesByParentNameAsync(string language, string parentCategoryName)
        {
            var result = new List<GetSubCategoryDTO>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetSubCategoriesByParentName", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Language", language);
                cmd.Parameters.AddWithValue("@ParentCategoryName", parentCategoryName);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result.Add(new GetSubCategoryDTO
                        {
                            CategoryId = reader.GetInt32(reader.GetOrdinal("CategoryId")),
                            CategoryName = reader.GetString(reader.GetOrdinal("CategoryName")),
                            ParentCategoryId = reader.IsDBNull(reader.GetOrdinal("ParentCategoryId"))
                                ? (int?)null
                                : reader.GetInt32(reader.GetOrdinal("ParentCategoryId"))
                        });
                    }
                }
            }

            return result;
        }
    }
}



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
    public static class CategoriesCommandsDAL
    {
        public static async Task<int> InsertSubCategoryAsync(PostSubCategoryDTO category)
        {
            int newCategoryId = 0;

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertSubCategory", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@ParentCategoryId", category.ParentCategoryId);
                    cmd.Parameters.AddWithValue("@CategoryNameEn", category.CategoryNameEn);
                    cmd.Parameters.AddWithValue("@CategoryNameAr", category.CategoryNameAr);

                    // Output Parameter
                    SqlParameter outputIdParam = new SqlParameter("@NewCategoryId", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };
                    cmd.Parameters.Add(outputIdParam);

                    await conn.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    newCategoryId = (int)outputIdParam.Value;
                    return newCategoryId;
                }
            }
        }
        public static async Task<int> InsertParentCategoryAsync(PostParentCategoryDTO category)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand("InsertParentCategory", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@CategoryNameEn", category.CategoryNameEn);
                    cmd.Parameters.AddWithValue("@CategoryNameAr", category.CategoryNameAr);

                    await conn.OpenAsync();
                    object result = await cmd.ExecuteScalarAsync();

                    return Convert.ToInt32(result); // هذا هو الـ ID الجديد
                }
            }
        }

    }
}

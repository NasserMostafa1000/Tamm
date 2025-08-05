using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Categories;

namespace TammbusinessLayer.Categories
{
    public class CategoriesCommandsServices : ICategoryCommands
    {
        public async Task<int> InsertSubCategoryAsync(CategoriesDTOs.PostSubCategoryDTO dto)
        {
            try
            {
                return await CategoriesCommandsDAL.InsertSubCategoryAsync(dto);
            }catch(Exception)
            {
                throw;
            }
            
        }
        public async Task<int> InsertParentCategoryAsync(CategoriesDTOs.PostParentCategoryDTO dto)
        {
            try
            {
                return await CategoriesCommandsDAL.InsertParentCategoryAsync(dto);
            }
            catch (Exception)
            {
                throw;
            }

        }
    }
}

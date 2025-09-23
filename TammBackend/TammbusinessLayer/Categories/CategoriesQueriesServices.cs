using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Categories;

namespace TammbusinessLayer.Categories
{
    public class CategoriesQueriesServices : ICategoriesQueries
    {
        public async Task<string> GetCategoriesWithChildrenAsync(string lang)
        {
            try
            {
                return await TammDataLayer.Categories.CategoriesQueries.GetCategoriesWithChildrenAsync(lang);
            } catch
            {
                throw;
                    }

        }

        public async Task<List<CategoriesDTOs.GetParentsCategoriesDTO>> GetParentCategoriesAsync(string language)
        {
            try
            {
                return await CategoriesQueries.GetTopLevelCategoriesAsync(language);
            }
            catch (Exception)
            {
                throw;
            }

        }
        public async Task<List<CategoriesDTOs.GetSubCategoryDTO>> GetSubCategoriesAsync(string language, string parentCategoryName)
        {
            try
            {
                return await CategoriesQueries.GetSubCategoriesByParentNameAsync(language, parentCategoryName);
            }
            catch (Exception)
            {
                throw;
            }
        }

    }
}

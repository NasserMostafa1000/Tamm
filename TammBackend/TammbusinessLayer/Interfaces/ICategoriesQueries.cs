using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.Categories;
using static TammDataLayer.Categories.CategoriesDTOs;

namespace TammbusinessLayer.Interfaces
{
    public interface ICategoriesQueries
    {
        Task<List<GetParentsCategoriesDTO>> GetParentCategoriesAsync(string language);
        Task<List<CategoriesDTOs.GetSubCategoryDTO>> GetSubCategoriesAsync(string language, string parentCategoryName);
    }
}

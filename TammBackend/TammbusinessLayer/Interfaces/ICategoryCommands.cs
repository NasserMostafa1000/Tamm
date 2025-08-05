using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammDataLayer.Categories;

namespace TammbusinessLayer.Interfaces
{
    public interface ICategoryCommands
    {
      Task<int> InsertSubCategoryAsync(CategoriesDTOs.PostSubCategoryDTO dto);
        Task<int> InsertParentCategoryAsync(CategoriesDTOs.PostParentCategoryDTO dto);

    }
}

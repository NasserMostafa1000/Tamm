using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Categories
{
    public class CategoriesDTOs
    {
        public class GetParentsCategoriesDTO
        {
            public int CategoryId { get; set; }
            public string CategoryName { get; set; } = null!;
            public string? ParentCategoryId { get; set; }
        }
        public class GetSubCategoryDTO
        {
            public int CategoryId { get; set; }
            public string CategoryName { get; set; } = string.Empty;
            public int? ParentCategoryId { get; set; }
        }
        public class PostSubCategoryDTO
        {
            public int ParentCategoryId { get; set; }
            public string CategoryNameEn { get; set; } = null!;
            public string CategoryNameAr { get; set; } = null!;
        }
        public class PostParentCategoryDTO
        {
            public string CategoryNameEn { get; set; } = null!;
            public string CategoryNameAr { get; set; } = null!;
        }


    }
}

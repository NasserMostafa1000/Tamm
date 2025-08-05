using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Favorites
{
    public class FavoritesDTOs
    {
        public class FavoriteListingDto
        {
            public int ListingId { get; set; }
            public int FavoriteId { get; set; }
            public string ImageUrl { get; set; }
            public string TitleAr { get; set; }
            public string TitleEn { get; set; }
            public string DescriptionAr { get; set; }
            public string DescriptionEn { get; set; }
            public decimal Price { get; set; }
            public DateTime CreatedAt { get; set; }
            public string CityNameAr { get; set; }
            public string CityNameEn { get; set; }
            public string PlaceNameAr { get; set; }
            public string PlaceNameEn { get; set; }
            public string SubCategoryAr { get; set; }
            public string SubCategoryEn { get; set; }
        }

    }
}

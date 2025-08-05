using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Listings
{
    public class ListingsDtos
    {
        //command
        public class PostListingDTO
        {
            public int PersonId { get; set; }
            public int SubCategoryId { get; set; }
            public string TitleEn { get; set; } = string.Empty;
            public string TitleAr { get; set; } = string.Empty;
            public string? DescriptionEn { get; set; }
            public string? DescriptionAr { get; set; }
            public decimal? Price { get; set; }
            public int ListingAddressId { get; set; }
        }

        //[query]
        public class ListingPreviewDto
        {
            public int ListingId { get; set; }

            public string Title { get; set; } = "";
            public string Description { get; set; } = "";
            public decimal? Price { get; set; }
            public DateTime CreatedAt { get; set; }
            public string CityName { get; set; } = "";
            public string PlaceName { get; set; } = "";
            public string? ImageUrl { get; set; }

            // أول اتنين Attributes
            public string? FirstAttributeName { get; set; }
            public string? FirstAttributeValue { get; set; }
            public string? SecondAttributeName { get; set; }
            public string? SecondAttributeValue { get; set; }
        }


        public class ListingDetailsDto
        {
            public int ListingId { get; set; }
            public int UserId { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public decimal Price { get; set; }
            public DateTime CreatedAt { get; set; }
            public string? UserImageUrl { get; set; }
            public string CityName { get; set; }
            public string PlaceName { get; set; }

            public string OwnerName { get; set; }
            public int PersonId { get; set; }

            public List<ImageDto> Images { get; set; }
            public List<AttributeDto> Attributes { get; set; }
        }
        public class ListingSitemapDto
        {
            public int ListingId { get; set; }
            public DateTime CreatedAt { get; set; }
        }

        public class ImageDto
        {
            public string ImageUrl { get; set; }
        }
        public class AttributeDto
        {
            public int AttributeId { get; set; }
            public string AttributeName { get; set; }
            public string Value { get; set; }
        }
        public class unApprovedListings
            {
            public int ListingId { get; set; }
            }

    }
}

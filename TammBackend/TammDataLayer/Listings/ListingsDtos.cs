using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
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
            public string? WhatssAppNumber { get; set; }
            public string? EmailAddress { get; set; }

        }
        public class PriceRangeDto
        {
            public decimal MinPrice { get; set; }
            public decimal MaxPrice { get; set; }
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

        public class ListingPreviewDtoV2
        {
            public int ListingId { get; set; }
            public string? IsAbleToiditedReason { get; set; }
            public string IsApproved { get; set; } = null!;
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
            public string? WhastappNumber { get; set; }
            public string? EmailAddress { get; set; }
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
        public class UpdateListingFullDTO
        {
            public List<string> ExistingImageUrls { get; set; } = new(); // الصور القديمة اللي المستخدم محتفظ بيها

            public int ListingId { get; set; }
            public int PersonId { get; set; }
            public int SubCategoryId { get; set; }
            public string TitleEn { get; set; } = "";
            public string TitleAr { get; set; } = "";
            public string? DescriptionEn { get; set; }
            public string? DescriptionAr { get; set; }
            public decimal? Price { get; set; }
            public int ListingAddressId { get; set; }
            public string Email { get; set; } = "";
            public string PhoneNumber { get; set; } = "";
            public int CityPlaceId { get; set; }

            public List<string> ImageUrls { get; set; } = new List<string>();
            public List<ListingAttributeWithAttributesNamesDTO> Attributes { get; set; } = new List<ListingAttributeWithAttributesNamesDTO>();
        }

        public class ListingAttributeDTO
        {
            public int AttributeId { get; set; }
            public string Value { get; set; } = "";
        }
        public class FullListingForEditDTO
        {
            // بيانات الإعلان الأساسية
            [JsonPropertyName("listingId")]
            public int ListingId { get; set; }

            [JsonPropertyName("titleEn")]
            public string TitleEn { get; set; } = "";

            [JsonPropertyName("titleAr")]
            public string TitleAr { get; set; } = "";

            [JsonPropertyName("descriptionEn")]
            public string? DescriptionEn { get; set; }

            [JsonPropertyName("descriptionAr")]
            public string? DescriptionAr { get; set; }

            [JsonPropertyName("price")]
            public decimal? Price { get; set; }

            [JsonPropertyName("email")]
            public string Email { get; set; } = "";

            [JsonPropertyName("phoneNumber")]
            public string PhoneNumber { get; set; } = "";

            [JsonPropertyName("createdAt")]
            public DateTime CreatedAt { get; set; }

            // المدينة والمكان
            [JsonPropertyName("cityNameEn")]
            public string CityNameEn { get; set; } = "";

            [JsonPropertyName("cityNameAr")]
            public string CityNameAr { get; set; } = "";

            [JsonPropertyName("placeNameEn")]
            public string PlaceNameEn { get; set; } = "";

            [JsonPropertyName("placeNameAr")]
            public string PlaceNameAr { get; set; } = "";

            // الصور
            [JsonPropertyName("imageUrls")]
            public List<string> ImageUrls { get; set; } = new List<string>();

            // صاحب الإعلان
            [JsonPropertyName("ownerName")]
            public string OwnerName { get; set; } = "";

            [JsonPropertyName("userImageUrl")]
            public string UserImageUrl { get; set; } = "";

            [JsonPropertyName("personId")]
            public int PersonId { get; set; }

            [JsonPropertyName("userId")]
            public int UserId { get; set; }

            // الخصائص
            [JsonPropertyName("attributes")]
            public List<ListingAttributeWithAttributesNamesDTO> Attributes { get; set; } = new List<ListingAttributeWithAttributesNamesDTO>();
        }

        public class ListingAttributeWithAttributesNamesDTO
        {
            public int AttributeId { get; set; }
            public string AttributeNameEn { get; set; } = "";
            public string AttributeNameAr { get; set; } = "";
            public string Value { get; set; } = "";
            public string? UnitEn { get; set; } // nullable
            public string? UnitAr { get; set; } // nullable
        }
    }
}

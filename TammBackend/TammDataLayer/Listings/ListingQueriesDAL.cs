using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Newtonsoft.Json;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammDataLayer.Listings
{
    public static class ListingQueriesDAL
    {
        public static async Task<(List<ListingPreviewDto> Listings, int TotalCount)> SearchOnTammAsync(string lang, string filterWith, int pageNumber, int pageSize)
        {
            var listings = new List<ListingPreviewDto>();
            int totalCount = 0;
            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("searchOnTammV2", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lang", lang);
                cmd.Parameters.AddWithValue("@FilterWith", (object?)filterWith ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
                cmd.Parameters.AddWithValue("@PageSize", pageSize);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var dto = new ListingPreviewDto
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId")),
                            Title = reader.GetString(reader.GetOrdinal("Title")),
                            Description = reader.GetString(reader.GetOrdinal("Description")),
                            Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? null : reader.GetDecimal(reader.GetOrdinal("Price")),
                            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                            CityName = reader.GetString(reader.GetOrdinal("CityName")),
                            PlaceName = reader.GetString(reader.GetOrdinal("PlaceName")),
                            ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),
                            FirstAttributeName = reader.IsDBNull(reader.GetOrdinal("FirstAttributeName")) ? null : reader.GetString(reader.GetOrdinal("FirstAttributeName")),
                            FirstAttributeValue = reader.IsDBNull(reader.GetOrdinal("FirstAttributeValue")) ? null : reader.GetString(reader.GetOrdinal("FirstAttributeValue")),
                            SecondAttributeName = reader.IsDBNull(reader.GetOrdinal("SecondAttributeName")) ? null : reader.GetString(reader.GetOrdinal("SecondAttributeName")),
                            SecondAttributeValue = reader.IsDBNull(reader.GetOrdinal("SecondAttributeValue")) ? null : reader.GetString(reader.GetOrdinal("SecondAttributeValue")),
                        };

                        listings.Add(dto);

                        if (totalCount == 0 && !reader.IsDBNull(reader.GetOrdinal("TotalCount")))
                        {
                            totalCount = reader.GetInt32(reader.GetOrdinal("TotalCount"));
                        }
                    }
                }
            }

            return (listings, totalCount);
        }
        public static async Task<List<ListingPreviewDto>> GetListingPreviewByLangAsync(string lang, string filterWith,string CurrentPlace)
        {
            var listings = new List<ListingPreviewDto>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetListingsPreviewByLang", conn)) // ✅
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lang", lang);
                cmd.Parameters.AddWithValue("@FilterWith", filterWith);
                cmd.Parameters.AddWithValue("@CurrentPlace", CurrentPlace);


                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        listings.Add(new ListingPreviewDto
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId")),
                            Title = reader.GetString(reader.GetOrdinal("Title")),
                            Description = reader.GetString(reader.GetOrdinal("Description")),
                            Price = reader.IsDBNull(reader.GetOrdinal("Price")) ? null : reader.GetDecimal(reader.GetOrdinal("Price")),
                            CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt")),
                            CityName = reader.GetString(reader.GetOrdinal("CityName")),
                            PlaceName = reader.GetString(reader.GetOrdinal("PlaceName")),
                            ImageUrl = reader.IsDBNull(reader.GetOrdinal("ImageUrl")) ? null : reader.GetString(reader.GetOrdinal("ImageUrl")),

                            FirstAttributeName = reader.IsDBNull(reader.GetOrdinal("FirstAttributeName")) ? null : reader.GetString(reader.GetOrdinal("FirstAttributeName")),
                            FirstAttributeValue = reader.IsDBNull(reader.GetOrdinal("FirstAttributeValue")) ? null : reader.GetString(reader.GetOrdinal("FirstAttributeValue")),
                            SecondAttributeName = reader.IsDBNull(reader.GetOrdinal("SecondAttributeName")) ? null : reader.GetString(reader.GetOrdinal("SecondAttributeName")),
                            SecondAttributeValue = reader.IsDBNull(reader.GetOrdinal("SecondAttributeValue")) ? null : reader.GetString(reader.GetOrdinal("SecondAttributeValue")),
                        });
                    }
                }
            }

            return listings;
        }
        public static async Task<ListingDetailsDto> GetListingByIdForAdminAsync(string lang, int listingId)
        {
            var listing = new ListingDetailsDto();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetListingById", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lang", lang);
                cmd.Parameters.AddWithValue("@ListingId", listingId);
                cmd.Parameters.AddWithValue("@Admin", 1);


                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        listing.ListingId = reader.GetInt32(reader.GetOrdinal("ListingId"));
                        listing.UserId = reader.GetInt32(reader.GetOrdinal("UserId"));
                        listing.Title = reader["Title"].ToString();
                        listing.Description = reader["Description"].ToString();
                        listing.Price = reader.GetDecimal(reader.GetOrdinal("Price"));
                        listing.CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
                        listing.CityName = reader["CityName"].ToString();
                        listing.PlaceName = reader["PlaceName"].ToString();
                        listing.OwnerName = reader["OwnerName"].ToString();
                        listing.PersonId = Convert.ToInt32(reader["PersonId"]);
                        listing.UserImageUrl = reader["UserImageurl"].ToString();
                        // تفريغ الصور من JSON
                        var imagesJson = reader["ImagesJson"].ToString();
                        listing.Images = JsonConvert.DeserializeObject<List<ImageDto>>(imagesJson);

                        // تفريغ الخصائص من JSON
                        var attributesJson = reader["AttributesJson"].ToString();
                        listing.Attributes = JsonConvert.DeserializeObject<List<AttributeDto>>(attributesJson);
                    }
                }
            }

            return listing;
        }
        public static async Task<ListingDetailsDto> GetListingByIdAsync(string lang, int listingId)
        {
            //this only use for read the un approve ads
            var listing = new ListingDetailsDto();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("GetListingById", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Lang", lang);
                cmd.Parameters.AddWithValue("@ListingId", listingId);


                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        listing.ListingId = reader.GetInt32(reader.GetOrdinal("ListingId"));
                        listing.UserId = reader.GetInt32(reader.GetOrdinal("UserId"));
                        listing.Title = reader["Title"].ToString();
                        listing.Description = reader["Description"].ToString();
                        listing.Price = reader.GetDecimal(reader.GetOrdinal("Price"));
                        listing.CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
                        listing.CityName = reader["CityName"].ToString();
                        listing.PlaceName = reader["PlaceName"].ToString();
                        listing.OwnerName = reader["OwnerName"].ToString();
                        listing.PersonId = Convert.ToInt32(reader["PersonId"]);
                        listing.UserImageUrl = reader["UserImageurl"].ToString();
                        // تفريغ الصور من JSON
                        var imagesJson = reader["ImagesJson"].ToString();
                        listing.Images = JsonConvert.DeserializeObject<List<ImageDto>>(imagesJson);

                        // تفريغ الخصائص من JSON
                        var attributesJson = reader["AttributesJson"].ToString();
                        listing.Attributes = JsonConvert.DeserializeObject<List<AttributeDto>>(attributesJson);
                    }
                }
            }

            return listing;
        }

        public static async Task<List<ListingPreviewDto>> GetListingsPreviewByPersonIdAsync(string lang, int UserId)
        {
            var listings = new List<ListingPreviewDto>();

            using (var connection = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (var command = new SqlCommand("GetListingsPreviewByPersonId", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Lang", lang);
                    command.Parameters.AddWithValue("@UserId", UserId);

                    await connection.OpenAsync();
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var listing = new ListingPreviewDto
                            {
                                ListingId = Convert.ToInt32(reader["ListingId"]),
                                Title = reader["Title"]?.ToString(),
                                Description = reader["Description"]?.ToString(),
                                Price = Convert.ToDecimal(reader["Price"]),
                                CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                                CityName = reader["CityName"]?.ToString(),
                                PlaceName = reader["PlaceName"]?.ToString(),
                                ImageUrl = reader["ImageUrl"]?.ToString(),
                                FirstAttributeName = reader["FirstAttributeName"]?.ToString(),
                                FirstAttributeValue = reader["FirstAttributeValue"]?.ToString(),
                                SecondAttributeName = reader["SecondAttributeName"]?.ToString(),
                                SecondAttributeValue = reader["SecondAttributeValue"]?.ToString(),
                            };
                            listings.Add(listing);
                        }
                    }
                }
            }

            return listings;
        }
        public static async Task<List<unApprovedListings>> GetUnapprovedListingsIdsAsync()
        {
            var listings = new List<unApprovedListings>();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetUnapprovedListings", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        listings.Add(new unApprovedListings
                        {
                            ListingId = reader.GetInt32(reader.GetOrdinal("ListingId"))
                        });
                    }
                }
            }

            return listings;
        }
        public static async Task<List<ListingSitemapDto>> GetApprovedListingIdsAsync()
        {
            var listings = new List<ListingSitemapDto>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("SELECT ListingId, CreatedAt FROM Listings WHERE IsApproved = 1", conn))
            {
                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        listings.Add(new ListingSitemapDto
                        {
                            ListingId = reader.GetInt32(0),
                            CreatedAt = reader.GetDateTime(1)
                        });
                    }
                }
            }

            return listings;
        }

    }
}


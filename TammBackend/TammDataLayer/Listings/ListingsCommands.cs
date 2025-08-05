using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Listings.ListingsDtos;

namespace TammDataLayer.Listings
{
    public static class ListingsCommands
    {
        private static readonly string _connectionString = Settings._ProductionConnectionString;
        private static readonly string _imagesRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "AdImages");

        public static async Task<int> AddListingAsync(PostListingDTO dto)
        {
            int newListingId = 0;

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("InsertListing", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@PersonId", dto.PersonId);
                cmd.Parameters.AddWithValue("@SubCategoryId", dto.SubCategoryId);
                cmd.Parameters.AddWithValue("@TitleEn", dto.TitleEn);
                cmd.Parameters.AddWithValue("@TitleAr", dto.TitleAr);
                cmd.Parameters.AddWithValue("@DescriptionEn", (object?)dto.DescriptionEn ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DescriptionAr", (object?)dto.DescriptionAr ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Price", (object?)dto.Price ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ListingAddressId", dto.ListingAddressId);

                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int id))
                    newListingId = id;
            }

            return newListingId;
        }

        public static async Task DeleteListingAndImagesAsync(int listingId)
        {
            List<string> imageUrls = new();

            // 1. Get Image URLs from DB
            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("GetListingImagesPaths", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ListingId", listingId);

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        string? imageUrl = reader["ImageUrl"]?.ToString();
                        if (!string.IsNullOrWhiteSpace(imageUrl))
                            imageUrls.Add(imageUrl);
                    }
                }
            }

            // 2. Delete physical image files
            foreach (var imageUrl in imageUrls)
            {
                try
                {
                    // تأكد من إن الرابط URL فعلي
                    if (Uri.TryCreate(imageUrl, UriKind.Absolute, out var uri))
                    {
                        var fileName = Path.GetFileName(uri.LocalPath); // هيجيب الجزء الأخير بعد /
                        var filePath = Path.Combine(_imagesRootPath, fileName);

                        if (File.Exists(filePath))
                        {
                            File.Delete(filePath);
                        }
                        else
                        {
                            Console.WriteLine($"Image file not found: {filePath}");
                        }
                    }
                }
                catch (Exception ex)
                {
                }
            }

            // 3. Delete listing and related records
            using (SqlConnection conn = new SqlConnection(_connectionString))
            using (SqlCommand cmd = new SqlCommand("DeleteListingById", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ListingId", listingId);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }

        public static async Task ApproveListingAsync(int listingId)
        {
            using (var connection = new SqlConnection(Settings._ProductionConnectionString))
            using (var command = new SqlCommand("ApproveListing", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@ListingId", listingId);

                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();
            }
        }

    }
}

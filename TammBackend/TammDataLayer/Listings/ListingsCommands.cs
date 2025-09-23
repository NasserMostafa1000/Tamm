using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
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
                cmd.Parameters.AddWithValue("@Email", dto.EmailAddress);
                cmd.Parameters.AddWithValue("@PhoneNumber", dto.WhatssAppNumber);
                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();

                if (result != null && int.TryParse(result.ToString(), out int id))
                    newListingId = id;
            }

            return newListingId;
        }

        public static async Task DeleteListingAndImagesAsync(int listingId,int @CurrentEmployee)
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
                cmd.Parameters.AddWithValue("@@CurrentEmployee", CurrentEmployee);


                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public static async Task ApproveListingAsync(int listingId,int CurrentEmployee)
        {
            using (var connection = new SqlConnection(Settings._ProductionConnectionString))
            using (var command = new SqlCommand("ApproveListing", connection))
            {
                command.CommandType = CommandType.StoredProcedure;
                command.Parameters.AddWithValue("@ListingId", listingId);
                command.Parameters.AddWithValue("@CurrentEmployee", CurrentEmployee);


                await connection.OpenAsync();
                await command.ExecuteNonQueryAsync();
            }
        }
        public static async Task EditListingReasonAsync(int listingId, string reason, int CurrentEmployee)
        {
            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("EditYourListingToApproveItInOurSystem", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ListingId", listingId);
                cmd.Parameters.AddWithValue("@CurrentEmployee", CurrentEmployee);
                cmd.Parameters.AddWithValue("@Reason", reason);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }
        public static async Task UpdateListingFullAsync(UpdateListingFullDTO dto)
        {
            // حذف الصور القديمة اللي تم مسحها فقط
            await DeleteListingImagesAsync(dto.ListingId, dto.ExistingImageUrls);

            using (var conn = new SqlConnection(_connectionString))
            using (var cmd = new SqlCommand("UpdateListingFull", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@ListingId", dto.ListingId);
                cmd.Parameters.AddWithValue("@PersonId", dto.PersonId);
                cmd.Parameters.AddWithValue("@SubCategoryId", dto.SubCategoryId);
                cmd.Parameters.AddWithValue("@TitleEn", dto.TitleEn);
                cmd.Parameters.AddWithValue("@TitleAr", dto.TitleAr);
                cmd.Parameters.AddWithValue("@DescriptionEn", (object?)dto.DescriptionEn ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@DescriptionAr", (object?)dto.DescriptionAr ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@Price", (object?)dto.Price ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@ListingAddressId", dto.ListingAddressId);
                cmd.Parameters.AddWithValue("@Email", dto.Email);
                cmd.Parameters.AddWithValue("@PhoneNumber", dto.PhoneNumber);
                cmd.Parameters.AddWithValue("@CityPlaceId", dto.CityPlaceId);

                // JSON يحتوي على كل الصور الموجودة (القديمة اللي محتفظ بيها + الصور الجديدة)
                string imagesJson = JsonSerializer.Serialize(dto.ImageUrls);
                cmd.Parameters.AddWithValue("@ImagesJson", imagesJson);

                string attributesJson = JsonSerializer.Serialize(dto.Attributes);
                cmd.Parameters.AddWithValue("@AttributesJson", attributesJson);

                await conn.OpenAsync();
                await cmd.ExecuteNonQueryAsync();
            }
        }

        private static async Task DeleteListingImagesAsync(int listingId, List<string> imagesToKeep)
        {
            var oldImages = await TammDataLayer.Listings.ListingQueriesDAL.GetListingImagesAsync(listingId);

            foreach (var imageUrl in oldImages)
            {
                if (!imagesToKeep.Contains(imageUrl))
                {
                    try
                    {
                        var fileName = Path.GetFileName(new Uri(imageUrl).LocalPath);
                        var filePath = Path.Combine(_imagesRootPath, fileName);
                        if (File.Exists(filePath))
                            File.Delete(filePath);

                        // حذف من DB
                        using (var conn = new SqlConnection(_connectionString))
                        using (var cmd = new SqlCommand("DELETE FROM ListingImages WHERE ListingId=@ListingId AND ImageUrl=@ImageUrl", conn))
                        {
                            cmd.Parameters.AddWithValue("@ListingId", listingId);
                            cmd.Parameters.AddWithValue("@ImageUrl", imageUrl);
                            await conn.OpenAsync();
                            await cmd.ExecuteNonQueryAsync();
                        }
                    }
                    catch { }
                }
            }
        }
    }
}
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using static TammDataLayer.ClientsDAL.ClientsDTOs;
namespace TammDataLayer.ClientsDAL
{
    public static  class clsClientsCommand 
    {


        public static async Task<string> AddAsync(ClientsDTOs.AddClientDTO client)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
                using (SqlCommand cmd = new SqlCommand("AddClient", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;

                    cmd.Parameters.AddWithValue("@Lang", client.Lang);
                    cmd.Parameters.AddWithValue("@FirstName", client.FirstName);
                    cmd.Parameters.AddWithValue("@LastName", client.LastName);
                    cmd.Parameters.AddWithValue("@ImageUrl", (object?)client.ImageUrl ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@Nationality", (object?)client.Nationality ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@DateOfBirth", string.IsNullOrEmpty(client.DateOfBirth) ? DBNull.Value : DateTime.Parse(client.DateOfBirth));
                    cmd.Parameters.AddWithValue("@Gender", client.Gender == 0 ? DBNull.Value : (object)client.Gender);
                    cmd.Parameters.AddWithValue("@Email", client.Email);
                    cmd.Parameters.AddWithValue("@HashedPassword", (object?)client.HashedPassword ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@LoginProviderName", (object?)client.LoginProviderName ?? DBNull.Value);
                    cmd.Parameters.AddWithValue("@RoleId", client.RoleId);

                    await conn.OpenAsync();

                    object result = await cmd.ExecuteScalarAsync();
                    return result?.ToString(); // 👈 رجع النتيجة كـ string
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public static async Task UpdateClientProfileAsync(UpdateClientProfileDto dto)
        {
            using (SqlConnection connection = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand command = new SqlCommand("UpdateUserProfile", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", dto.UserId);
                    command.Parameters.AddWithValue("@FirstName", dto.FirstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@LastName", dto.LastName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@ClientPhone", dto.ClientPhone ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@NationalityId", dto.NationalityId);
                    command.Parameters.AddWithValue("@DateOfBirth", dto.DateOfBirth ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@GenderId", dto.GenderId ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@HashedPassword", string.IsNullOrWhiteSpace(dto.HashedPassword) ? (object)DBNull.Value : dto.HashedPassword);

                    await connection.OpenAsync();
                    await command.ExecuteNonQueryAsync();
                }
            }


        }
        public static async Task<bool> UpdatePersonImageByUserIdAsync(int userId, string imageUrl)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpdatePersonImageByUserId", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@ImageUrl", imageUrl);
                await conn.OpenAsync();
                int rowsAffected = await cmd.ExecuteNonQueryAsync();
                return rowsAffected > 0;
            }
        }

    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.Users
{
    public static class UsersQueriesDAL
    {
        public static async Task<string?> GetHashedPasswordByEmailAsync(string email)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetHashedPasswordByEmail", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", email);

                await conn.OpenAsync();
                var result = await cmd.ExecuteScalarAsync();
                return result != DBNull.Value ? result?.ToString() : null;
            }
        }
        public static async Task<int> GetPersonIdByUserId(int userId)
        {
            int personId = 0;
            string query = "SELECT PersonId FROM Users WHERE UserId = @UserId;";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@UserId", userId);

                    await conn.OpenAsync();
                    object result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        personId = Convert.ToInt32(result);
                    }
                }
            }

            return personId;
        }
        public static async Task<int> GetUserIdByPersonId(int PersonId)
        {
            int personId = 0;
            string query = "SELECT UserId FROM Users WHERE PersonId = @PersonId;";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@PersonId", PersonId);

                    await conn.OpenAsync();
                    object result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        personId = Convert.ToInt32(result);
                    }
                }
            }

            return personId;
        }
        public static async Task<int> GetClientIdByUserId(int UserId)
        {
            int personId = 0;
            string query = "SELECT ClientId FROM Clients WHERE UserId = @UserId;";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@userId", UserId);

                    await conn.OpenAsync();
                    object result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        personId = Convert.ToInt32(result);
                    }
                }
            }

            return personId;
        }
        public static async Task<int> GetUserIdByClientId(int ClientId)
        {
            int personId = 0;
            string query = "SELECT UserId FROM Clients WHERE ClientId = @ClientId;";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@ClientId", ClientId);

                    await conn.OpenAsync();
                    object result = await cmd.ExecuteScalarAsync();

                    if (result != null && result != DBNull.Value)
                    {
                        personId = Convert.ToInt32(result);
                    }
                }
            }

            return personId;
        }
        public static async Task<List<string>> GetAllUserEmailsAsync()
        {
            List<string> allEmails = new List<string>();
            string query = "SELECT Email FROM Users";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        if (reader["Email"] != DBNull.Value)
                        {
                            allEmails.Add(reader["Email"].ToString());
                        }
                    }
                }
            }

            return allEmails;
        }
        public static async Task<string?> GetImagePathAsync(int personId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetImageUrl", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PersonId", personId);

                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();
                return result != DBNull.Value && result != null ? result.ToString() : null;
            }



        }
        /// Returns the login provider name for a specific user.
        /// </summary>
        /// <param name="personId">The ID of the user.</param>
        /// <returns>The login provider name as a string, or null if not found.</returns>
        public static async Task<string> GetLoginProviderNameAsync(int personId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetLoginProviderName", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PersonId", personId);

                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();
                return result?.ToString();
            }
        }

        /// <summary>
        /// Overload to get login provider by email.
        /// </summary>
        /// <param name="email">User's email.</param>
        /// <returns>The login provider name as a string, or null if not found.</returns>
        public static async Task<string> GetLoginProviderNameByEmailAsync(string email)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("SELECT LoginProviderName FROM Users WHERE Email = @Email", conn))
            {
                cmd.CommandType = CommandType.Text;
                cmd.Parameters.AddWithValue("@Email", email);

                await conn.OpenAsync();

                var result = await cmd.ExecuteScalarAsync();
                var provider = result?.ToString() ?? "";

                // لو الاسم فيه "google"، نشيلها مع تجاهل الحالة
                if (provider.IndexOf("google", StringComparison.OrdinalIgnoreCase) >= 0)
                {
                    provider = provider.Remove(provider.IndexOf("google", StringComparison.OrdinalIgnoreCase), "google".Length).Trim();
                }

                return provider;
            }
        }

        public static async Task<string?> GetEmailByUserIdAsync(int userId)
        {
            string? email = null;
            string query = "SELECT Email FROM Users WHERE UserId = @UserId;";

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand(query, conn))
            {
                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();
                object result = await cmd.ExecuteScalarAsync();

                if (result != null && result != DBNull.Value)
                {
                    email = result.ToString();
                }
            }

            return email;
        }

    }
}
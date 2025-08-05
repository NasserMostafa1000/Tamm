using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using TammDataLayer.Helper;
using static TammDataLayer.ClientsDAL.ClientsDTOs;

namespace TammDataLayer.ClientsDAL
{
    public class clsClientsQueries
    {
        public static async Task<ClientsDTOs.ClientTokenInfo> ClientTokenInfo(int ClientId)
        {

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("GetClientUserInfo", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@ClientId", SqlDbType.Int) { Value = ClientId });

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            var clientTokenInfo = new ClientsDTOs.ClientTokenInfo
                            {
                                FirstName = reader["FirstName"] as string,
                                LastName = reader["LastName"] as string,
                                ImageUrl = reader["ImageUrl"] as string,
                                UserId = reader["UserId"] != DBNull.Value ? (int)reader["UserId"] : 0,
                                Email = reader["Email"] as string,
                                RoleId = reader["RoleId"] != DBNull.Value ? Convert.ToInt32(reader["RoleId"]) : 0
                            };

                            return clientTokenInfo;
                        }
                        else
                        {
                            return null; // ما فيش بيانات
                        }
                    }

                }
            }
        }
        public static async Task<int> GetClientIdByEmail(string Email)
        {

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            {
                await conn.OpenAsync();

                using (SqlCommand cmd = new SqlCommand("GetClientIdByEmail", conn))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter("@Email", SqlDbType.NVarChar, 256) { Value = Email });

                    // نستخدم ExecuteScalarAsync لأننا نتوقع قيمة واحدة (ClientId)
                    var result = await cmd.ExecuteScalarAsync();

                    if (result != null && int.TryParse(result.ToString(), out int clientId))
                    {
                        return clientId;
                    }
                    else
                    {
                        return 0; // أو -1 أو أي قيمة تدل على عدم وجود نتيجة
                    }
                }
            }
        }
        public static async Task<ClientTokenInfo?> GetClientTokenInfoByEmailAsync(string email)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetClientTokenInfoByEmail", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@Email", email);

                await conn.OpenAsync();
                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (!await reader.ReadAsync()) return null;

                    return new ClientTokenInfo
                    {
                        FirstName = reader["FirstName"].ToString()!,
                        LastName = string.IsNullOrWhiteSpace(reader["LastName"].ToString()) ? "UAE": reader["LastName"].ToString(),
                        ImageUrl = reader["ImageUrl"] as string,
                        UserId = Convert.ToInt32(reader["UserId"]),
                        Email = reader["Email"].ToString()!,
                        RoleId = Convert.ToInt32(reader["RoleId"])
                    };
                }
            }
        }
        public static async Task<ClientsDTOs.ClientData> GetClientDetailsByUserIdAsync(int userId)
        {
            ClientData user = null;

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetUserDetailsById", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        user = new ClientData
                        {
                            UserId = Convert.ToInt32(reader["UserId"]),
                            Email = reader["Email"]?.ToString(),
                            HashedPassword = reader["HashedPassword"]?.ToString(),
                            CreatedAt = Convert.ToDateTime(reader["CreatedAt"]),
                            PersonId = Convert.ToInt32(reader["PersonId"]),
                            FirstName = reader["FirstName"]?.ToString(),
                            LastName = reader["LastName"]?.ToString(),
                            ImageUrl = reader["ImageUrl"]?.ToString(),
                            ClientPhone= reader["phoneNumber"]?.ToString(),
                            Nationality = reader["NationalityName"].ToString(),
                            DateOfBirth = reader["DateOfBirth"] as DateTime?,
                            Gender = reader["Gender"] as int?
                        };
                    }
                }
            }

            return user;
        }
        public static async Task<string?> GetImageUrlByUserIdAsync(int userId)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetImageUrlByPersonId", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();

                using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        return reader["ImageUrl"] as string;
                    }
                }

                return null; // لو مفيش نتيجة
            }
        }

        public static async Task<PagedClientsResultDto> GetClientsPagedAsync(int pageNumber, int pageSize)
        {
            var result = new PagedClientsResultDto
            {
                Clients = new List<ClientDto>(),
                TotalCount = 0
            };

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetClientsWithPaging", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@PageNumber", pageNumber);
                cmd.Parameters.AddWithValue("@PageSize", pageSize);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        result.Clients.Add(new ClientDto
                        {
                            PersonId = Convert.ToInt32(reader["PersonId"]),
                            FullName = reader["FullName"].ToString(),
                            Email = reader["Email"].ToString(),
                            PhoneNumber = reader["PhoneNumber"].ToString(),
                            Nationality = reader["countryName"].ToString(),
                            UserId =int.Parse(reader["UserId"].ToString()),
                            LoginProvider = reader["LoginProviderName"].ToString(),
                            HasedPassword = reader["HashedPassword"] == DBNull.Value ? null : Convert.ToString(reader["HashedPassword"]),
                            DateOfBirth = reader["DateOfBirth"] == DBNull.Value ? null : Convert.ToDateTime(reader["DateOfBirth"]),
                            ListingCount = int.Parse(reader["ListingsCount"].ToString())
                        });

                        if (result.TotalCount == 0 && reader["TotalCount"] != DBNull.Value)
                        {
                            result.TotalCount = Convert.ToInt32(reader["TotalCount"]);
                        }
                    }
                }
            }

            return result;
        }

    }

}


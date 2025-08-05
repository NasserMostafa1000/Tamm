using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.Chat.ChatDtos;

namespace TammDataLayer.Chat
{
    public static class ChatDAL
    {
        public static async Task InsertMessageAsync(int fromUserId, int toUserId, int? listingId, string content)
        {
            using SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString);
            using SqlCommand cmd = new SqlCommand("InsertMessage", conn);
            cmd.CommandType = CommandType.StoredProcedure;

            cmd.Parameters.AddWithValue("@FromUserId", fromUserId);
            cmd.Parameters.AddWithValue("@ToUserId", toUserId);
            if (listingId.HasValue)
                cmd.Parameters.AddWithValue("@ListingId", listingId.Value);
            else
                cmd.Parameters.AddWithValue("@ListingId", DBNull.Value);
            cmd.Parameters.AddWithValue("@Content", content);

            await conn.OpenAsync();
            await cmd.ExecuteNonQueryAsync();
        }

        public static async Task<List<ChatContactPreviewDto>> GetUserChatContactsWithLastMessageAsync(int userId)
        {
            var results = new List<ChatContactPreviewDto>();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetUserChatContactsWithLastMessage", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var dto = new ChatContactPreviewDto
                        {
                            ContactUserId = reader.GetInt32(reader.GetOrdinal("ContactUserId")),
                            FullName = reader.GetString(reader.GetOrdinal("ContactFullName")),
                             ImageUrl = reader.IsDBNull(reader.GetOrdinal("ContactImageUrl"))? null : reader.GetString(reader.GetOrdinal("ContactImageUrl")),
                            LastMessage = reader.GetString(reader.GetOrdinal("LastMessage")),
                            SentAt = reader.GetDateTime(reader.GetOrdinal("LastMessageDate")),
                            IsRead = reader.GetBoolean(reader.GetOrdinal("IsRead")),
                            FromUserId = reader.GetInt32(reader.GetOrdinal("FromUserId")),
                            ToUserId = reader.GetInt32(reader.GetOrdinal("ToUserId")),

                        };

                        results.Add(dto);
                    }
                }
            }

            return results;
        }
        public static async Task<List<MessageDto>> GetAndMarkMessagesAsReadAsync(int currentUserId, int contactUserId)
        {
            var messages = new List<MessageDto>();

            using (var conn = new SqlConnection(Settings._ProductionConnectionString))
            using (var cmd = new SqlCommand("[GetAndMarkMessagesAsRead]", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@CurrentUserId", currentUserId);
                cmd.Parameters.AddWithValue("@ContactUserId", contactUserId);

                await conn.OpenAsync();
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var msg = new MessageDto
                        {
                            MessageId = reader.GetInt32(reader.GetOrdinal("MessageId")),
                            FromUserId = reader.GetInt32(reader.GetOrdinal("FromUserId")),
                            ToUserId = reader.GetInt32(reader.GetOrdinal("ToUserId")),
                            Message = reader.GetString(reader.GetOrdinal("Content")),                           
                            ListingId = reader.IsDBNull(reader.GetOrdinal("ListingId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ListingId")),
                            SentAt = reader.GetDateTime(reader.GetOrdinal("SentAt")),
                            IsRead = reader.GetBoolean(reader.GetOrdinal("IsRead"))
                        };
                        messages.Add(msg);
                    }
                }
            }

            return messages;
        }
        public static async Task<int> GetUnreadMessagesCountAsync(int userId)
        {
            int count = 0;

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UnreadMessages", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@UserId", userId);

                await conn.OpenAsync();
                count = (int)await cmd.ExecuteScalarAsync();
            }

            return count;
        }
    }
}


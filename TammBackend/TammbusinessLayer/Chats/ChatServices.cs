using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammDataLayer.Chat;

namespace TammbusinessLayer.Chats
{
    public class ChatServices : IChatService
    {
        public async Task<List<ChatDtos.MessageDto>> GetAndMarkMessagesAsReadAsync(int currentUserId, int contactUserId)
        {
            try
            {
                return await TammDataLayer.Chat.ChatDAL.GetAndMarkMessagesAsReadAsync(currentUserId, contactUserId);
            }catch(Exception)
            {
                throw;
            }
        }

        public async Task<int> GetUnreadMessagesCountAsync(int userId)
        {
            return await TammDataLayer.Chat.ChatDAL.GetUnreadMessagesCountAsync(userId);
        }

        public async Task<List<ChatDtos.ChatContactPreviewDto>> GetUserChatContactsWithLastMessageAsync(int userId)
        {
           try
            {
              return await TammDataLayer.Chat.ChatDAL.GetUserChatContactsWithLastMessageAsync(userId);
            }
            catch(Exception)
            {
                throw;
            }
        }

        public async Task InsertMessageAsync(int fromUserId, int toUserId, int? listingId, string content)
        {
            try
            {
            await    TammDataLayer.Chat.ChatDAL.InsertMessageAsync(fromUserId, toUserId, listingId, content);
            }catch(Exception)
            {
                throw;
            }
        }


    }
}

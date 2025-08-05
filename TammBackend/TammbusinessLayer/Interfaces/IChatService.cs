using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static TammDataLayer.Chat.ChatDtos;

namespace TammbusinessLayer.Interfaces
{
    public interface IChatService
    {
        Task InsertMessageAsync(int fromUserId, int toUserId, int? listingId, string content);
        Task<List<ChatContactPreviewDto>> GetUserChatContactsWithLastMessageAsync(int userId);
        Task<List<MessageDto>> GetAndMarkMessagesAsReadAsync(int currentUserId, int contactUserId);
        Task<int> GetUnreadMessagesCountAsync(int userId);
    }
}

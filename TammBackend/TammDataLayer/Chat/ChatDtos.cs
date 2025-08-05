using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Chat
{
    public class ChatDtos
    {
        public class ChatContactPreviewDto
        {
            public int ContactUserId { get; set; }
            public string FullName { get; set; }
            public string ImageUrl { get; set; }
            public string LastMessage { get; set; }
            public DateTime SentAt { get; set; }
            public bool IsRead { get; set; }
            public int FromUserId { get; set; }  // لازم تضيفهم
            public int ToUserId { get; set; }
        }
        public class MessageDto
        {
            public string? ImageUrl { get; set; }
            public int MessageId { get; set; }
            public int FromUserId { get; set; }
            public int ToUserId { get; set; }
            public string Message { get; set; }
            public int? ListingId { get; set; }
            public DateTime SentAt { get; set; }
            public bool IsRead { get; set; }
        }


    }
}

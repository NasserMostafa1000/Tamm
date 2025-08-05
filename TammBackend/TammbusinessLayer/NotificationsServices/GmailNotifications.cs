using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;

namespace TammbusinessLayer.NotificationsServices
{
    public class GmailNotifications : INotification
    {
        public async Task SendNotificationAsync(string toUserIdOrEmail, string subjectOrTitle, string messageBody)
        {
            try
            {
                string fromAddress = "tammunitedarabemirates@gmail.com"; 
                string appPassword = "lckp jgvm uuqo qyra";
                string toAddress = toUserIdOrEmail; 
                string subject = subjectOrTitle;
                string fromName = "[TAMM]";
                string body = messageBody;

                SmtpClient smtp = new SmtpClient
                {
                    Host = "smtp.gmail.com",
                    Port = 587,
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(fromAddress, appPassword)
                };

                MailAddress from = new MailAddress(fromAddress, fromName);
                MailMessage message = new MailMessage(fromAddress, toAddress)
                {
                    Subject = subject,
                    From = from,
                    Body = body
                };

                await smtp.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                throw new Exception($"Error sending email: {ex.Message.ToString()}");
            }
        }

    }
}

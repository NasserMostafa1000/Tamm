using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammbusinessLayer.Interfaces
{
    /// <summary>
    /// General interface for sending notifications to any user 
    /// via email, SMS, or other notification systems.
    /// </summary>
    public interface INotification
    {
        /// <summary>
        /// Sends a notification to a specific user.
        /// </summary>
        /// <param name="toUserIdOrEmail">
        /// The user identifier or email address to send the notification to.
        /// Can be a Phone Number if the notification is SMS, or an Email for Gmail notifications.
        /// </param>
        /// <param name="subjectOrTitle">
        /// The subject or title of the notification.
        /// Used for emails or notifications that support a title.
        /// </param>
        /// <param name="messageBody">
        /// The actual content of the notification/message to be delivered to the user.
        /// </param>
        /// <param name="CurrentUserProviderName">
        /// The name of the system or front-end site where the user belongs.
        /// Example: "TAMM" for sending TAMM email, "Propz" for sending a from Propz ,
        /// or the current site name cause we  have multiple front-end sites using the same backend.
        /// This parameter helps determine the appropriate where User Come from Any frontend site .
        /// </param>
        /// <returns>A Task representing the asynchronous notification sending operation.</returns>
        Task SendNotificationAsync(
            string toUserIdOrEmail,
            string subjectOrTitle,
            string messageBody,
            string CurrentUserProviderName
        );
    }
}

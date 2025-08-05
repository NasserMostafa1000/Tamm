using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.NotificationsServices;
using TammDataLayer.Registration;

namespace TammbusinessLayer.Factories
{
    public class NotificationsFactory
    {
        private readonly Dictionary<string, INotification> _strategies;

        public NotificationsFactory(IEnumerable<INotification> notifications)
        {
            _strategies = new Dictionary<string, INotification>(StringComparer.OrdinalIgnoreCase)
            {
                { "gmail", new GmailNotifications() },
            };
        }

        public INotification GetNotificationSender(string type)
        {
            if (_strategies.TryGetValue(type.ToLower(), out var strategy))
                return strategy;

            throw new KeyNotFoundException($"No notification strategy found for type: {type}");
        }
    }
}

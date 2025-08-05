using System;
using System.Collections.Generic;
using TammbusinessLayer.Interfaces;
using TammbusinessLayer.NotificationsServices;
using TammDataLayer.Registration;

namespace TammbusinessLayer.Factories
{
    public class RegistrationFactory
    {
        private readonly Dictionary<string, IRegister> _strategies;

        public RegistrationFactory()
        {
            _strategies = new Dictionary<string, IRegister>(StringComparer.OrdinalIgnoreCase)
            {
                { "google", new GoogleRegistration() },
                { "Tamm", new TammDataLayer.Registration.TammRegistration() },

            };
        }

        public IRegister LoginProvider(string providerName)
        {
            if (string.IsNullOrWhiteSpace(providerName))
                throw new ArgumentException("Notification provider name is required.");

            if (_strategies.TryGetValue(providerName.ToLower(), out var strategy))
            {
                return strategy;
            }

            throw new KeyNotFoundException($"No notification strategy found for provider: {providerName}");
        }
    }
}

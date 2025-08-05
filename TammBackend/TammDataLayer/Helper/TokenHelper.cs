using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using static TammDataLayer.ClientsDAL.ClientsDTOs;
using Microsoft.Extensions.Configuration;  // لا تنسى

namespace TammbusinessLayer.Helper
{
    public  class TokenHelper
    {
        private readonly IConfiguration _config;

        public TokenHelper(IConfiguration config)
        {
            _config = config;
        }

        private string GetRoleName(byte RoleId)
        {
            string[] roleNames = { "Admin", "Client", "Data Entry" };
            return roleNames[RoleId - 1];
        }

        public string CreateToken(ClientTokenInfo Client)
        {
            var key = _config["JwtSettings:Key"];
            var issuer = _config["JwtSettings:Issuer"];
            var audience = _config["JwtSettings:Audience"];

            if (string.IsNullOrEmpty(key))
            {
                throw new Exception("JWT Key is missing in configuration.");
            }

            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, Client.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, Client.Email),
             new Claim(ClaimTypes.Role, GetRoleName((byte)Client.RoleId)),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("fullName", Client.FirstName + Client.LastName),
            new Claim("ImageUrl",string.IsNullOrWhiteSpace(Client.ImageUrl)?"https://www.emaratalyoum.com/polopoly_fs/1.1639651.1654806943!/image/image.jpg":Client.ImageUrl),
        };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMonths(12),
                SigningCredentials = credentials,
                Issuer = issuer,
                Audience = audience
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.ClientsDAL
{
    public class ClientsDTOs
    {
        public class AddClientDTO
        {
            public string Lang { get; set; } = "en";  
            public string FirstName { get; set; } = null!;
            public string LastName { get; set; } = null!;
            public string? ImageUrl { get; set; }
            public int? Nationality { get; set; }
            public string? DateOfBirth { get; set; } 
            public int? Gender { get; set; }
            public string Email { get; set; } = null!;
            public string? HashedPassword { get; set; }
            public string LoginProviderName { get; set; } = null!;
            public int RoleId { get; set; }
        }
        public class HashedPasswordDto
        {
            public string HashedPassword { get; set; } = null!;
        }
        public class ClientTokenInfo
        {
            public string FirstName { get; set; } = null!;
            public string LastName { get; set; } = null!;
            public string? ImageUrl { get; set; }
            public int UserId { get; set; }
            public string Email { get; set; } =  null!;
            public int RoleId { get; set; }
        }
        public class LoginRequest
        {
            public string Email { get; set; } = null!;
            public string Password { get; set; } = null!;
            public string Lang { get; set; } = "en"; // لدعم اللغة
        }
        public class ClientData
        {
            public int UserId { get; set; }
            public string Email { get; set; }
            public string? HashedPassword { get; set; }
            public string? ClientPhone { get; set; }
            public DateTime CreatedAt { get; set; }
            public int PersonId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string? ImageUrl { get; set; }
            public string? Nationality { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public int? Gender { get; set; }
        }
        public class UpdateClientProfileDto
        {
            public int UserId { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string ClientPhone { get; set; }
            public int NationalityId { get; set; }
            public DateTime? DateOfBirth { get; set; }
            public int? GenderId { get; set; }
            public string HashedPassword { get; set; }
        }
        public class ClientDto
        {
            public int PersonId { get; set; }
            public int UserId { get; set; }

            public string FullName { get; set; } = null!;
            public string Email { get; set; } = null!;
            public string? PhoneNumber { get; set; }
            public string LoginProvider { get; set; } = null!;
            public string? Nationality { get; set; }
            public string? HasedPassword { get; set; }
            public int ListingCount { get; set; }
            public DateTime? DateOfBirth { get; set; }
        }
        public class PagedClientsResultDto
        {
            public List<ClientDto> Clients { get; set; }
            public int TotalCount { get; set; }
        }






    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using static TammDataLayer.AdminContacts.AdminContactsDTOs;

namespace TammDataLayer.AdminContacts
{
    public class AdminContactsQueriesDAL
    {
        public static async Task<ContactUsDto> GetContactUsAsync()
        {
            var result = new ContactUsDto();

            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("GetContactUs", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;
                await conn.OpenAsync();

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        result.Id = Convert.ToInt32(reader["Id"]);
                        result.Email = reader["Email"]?.ToString();
                        result.Phone = reader["Phone"]?.ToString();
                        result.WhatsApp = reader["WhatsApp"]?.ToString();
                        result.Instagram = reader["Instagram"]?.ToString();
                        result.Facebook = reader["Facebook"]?.ToString();
                        result.Twitter = reader["Twitter"]?.ToString();
                        result.Telegram = reader["Telegram"]?.ToString();
                        result.Youtube = reader["Youtube"]?.ToString();
                        result.Website = reader["Website"]?.ToString();
                        result.AddressAr = reader["AddressAr"]?.ToString();
                        result.AddressEn = reader["AddressEn"]?.ToString();
                        result.WorkingHours = reader["WorkingHours"]?.ToString();
                    }
                }
            }

            return result;
        }

    }
}

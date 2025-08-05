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
    public class AdminContactsCommandsDAL
    {
        public static async Task<bool> UpdateContactUsAsync(ContactUsDto dto)
        {
            using (SqlConnection conn = new SqlConnection(Settings._ProductionConnectionString))
            using (SqlCommand cmd = new SqlCommand("UpdateContactUs", conn))
            {
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Id", dto.Id);
                cmd.Parameters.AddWithValue("@Email", dto.Email ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Phone", dto.Phone ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@WhatsApp", dto.WhatsApp ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Instagram", dto.Instagram ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Facebook", dto.Facebook ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Twitter", dto.Twitter ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Telegram", dto.Telegram ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Youtube", dto.Youtube ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@Website", dto.Website ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AddressAr", dto.AddressAr ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@AddressEn", dto.AddressEn ?? (object)DBNull.Value);
                cmd.Parameters.AddWithValue("@WorkingHours", dto.WorkingHours ?? (object)DBNull.Value);

                await conn.OpenAsync();
                int rows = await cmd.ExecuteNonQueryAsync();
                return rows > 0;
            }
        }
    }
}


using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.AdminContacts
{
    public class AdminContactsDTOs
    {
        public class ContactUsDto
        {
            public int Id { get; set; }
            public string Email { get; set; }
            public string Phone { get; set; }
            public string WhatsApp { get; set; }
            public string Instagram { get; set; }
            public string Facebook { get; set; }
            public string Twitter { get; set; }
            public string Telegram { get; set; }
            public string Youtube { get; set; }
            public string Website { get; set; }
            public string AddressAr { get; set; }
            public string AddressEn { get; set; }
            public string WorkingHours { get; set; }
        }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Countries
{
    public class CountriesDto
    {
        public class CountryDto
        {
            public int CountryId { get; set; }
            public string CountryName { get; set; } = null!;
            public string CountryCode { get; set; } = null!;
        }

    }
}

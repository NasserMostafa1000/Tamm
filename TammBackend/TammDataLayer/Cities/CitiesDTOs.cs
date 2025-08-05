using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TammDataLayer.Cities
{
    public class CitiesDTOs
    {
        public class GetCitiesNamesDto
        {
            public int Id { get; set; }
            public string Name { get; set; } = null!;
        }
    }
}

using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;

namespace TammDataLayer.CitiesPlaces
{
    public class CitiesPlacesDtos
    {
        public class GetCityPlaceDTO
        {
            public int CityId { get; set; }
            public int CityPlaceId { get; set; }

            public string CityName { get; set; } = "";
            public string PlaceName { get; set; } = "";
        }
        public class AddCityPlaceDTO
        {
            public int CityId { get; set; }
            public string PlaceNameEn { get; set; }
            public string PlaceNameAr { get; set; }
        }


    }
}

using System.Xml.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TammDataLayer;
using TammDataLayer.Listings;

namespace TammBackendProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteMapController : ControllerBase
    {
        [HttpGet("/sitemap.xml")]
        public async Task<IActionResult> GetSitemap()
        {
            var listings = await ListingQueriesDAL.GetApprovedListingIdsAsync();

            XNamespace ns = "http://www.sitemaps.org/schemas/sitemap/0.9";

            // روابط الصفحات الثابتة المهمة
            var staticUrls = new List<XElement>
    {
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}"),
            new XElement(ns + "changefreq", "daily"),
            new XElement(ns + "priority", "1.0")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}Login"),
            new XElement(ns + "changefreq", "monthly"),
            new XElement(ns + "priority", "0.4")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}Register"),
            new XElement(ns + "changefreq", "monthly"),
            new XElement(ns + "priority", "0.4")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}AboutUs"),
            new XElement(ns + "changefreq", "monthly"),
            new XElement(ns + "priority", "0.6")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}ContactUs"),
            new XElement(ns + "changefreq", "monthly"),
            new XElement(ns + "priority", "0.6")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}PrivacyAndTerms"),
            new XElement(ns + "changefreq", "yearly"),
            new XElement(ns + "priority", "0.3")
        ),
        new XElement(ns + "url",
            new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}Searching"),
            new XElement(ns + "changefreq", "daily"),
            new XElement(ns + "priority", "0.9")
        ),
        // ممكن تضيف صفحات ثابتة إضافية إذا عندك
    };

            // قائمة الكلمات المفتاحية للبحث (Categories) باللغتين
            var categories = new List<string>
    {
        // Arabic
        "عقار للبيع",
        "عقار للايجار",
        "شقة للإيجار",
        "عقارات",
        "عقار تحت الإنشاء",
        "سيارات",
        "بي ام دابليو",
        "الموظفين",
        "مطورين برمجيات",
        "وظائف شاغره",
        "نجار",
        "هواتف",
        "أيفون",

        // English
        "Property for Sale",
        "Property for Rent",
        "Property Under Construction",
        "Apartment for Rent",
        "Land for Sale",
        "Land for Rent",
        "Cars",
        "BMW",
        "employees",
        "Developers",
        "Vacancies",
        "carpenter",
        "Phones",
        "Apple"
    };

            // نضيف روابط البحث لكل كلمة مفتاحية
            foreach (var category in categories)
            {
                staticUrls.Add(
                    new XElement(ns + "url",
                        new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}Searching?search={Uri.EscapeDataString(category)}"),
                        new XElement(ns + "changefreq", "weekly"),
                        new XElement(ns + "priority", "0.7")
                    )
                );
            }

            // روابط الإعلانات المعتمدة
            var listingUrls = listings.Select(l =>
                new XElement(ns + "url",
                    new XElement(ns + "loc", $"{Settings._ProductionFrontendServerPath}Listing/{l.ListingId}"),
                    new XElement(ns + "lastmod", l.CreatedAt.ToString("yyyy-MM-dd")),
                    new XElement(ns + "changefreq", "weekly"),
                    new XElement(ns + "priority", "0.8")
                )
            );

            // دمج كل الروابط
            var allUrls = staticUrls.Concat(listingUrls);

            var urlset = new XElement(ns + "urlset", allUrls);

            var xml = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), urlset);

            return Content(xml.ToString(SaveOptions.DisableFormatting), "application/xml");
        }
    }
}

import NavBar from "../Components/NavBar";
import SearchBar from "../Components/SearchBar";
import HomeSections from "../Components/HomeSections";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LangContext";
import MainCategoriesGrid from "../Components/MainCategoriesGrid";
import Footer from "../Components/Footer";
import { SiteNameAR, SiteNameEN } from "../Utils/Constant";
import { Helmet } from "react-helmet";
import ContactUs from "./ContactUs";

export default function Home() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const navigate = useNavigate();
  const suggestions = isArabic
    ? [
        { label: "عقار للبيع" },
        { label: "عقار للايجار" },
        { label: "شقة للإيجار" },
        { label: "عقارات" },
        {
          label: "عقار تحت الإنشاء",
        },
        { label: "سيارات" },
        { label: "بي ام دابليو" },
        { label: "الموظفين" },
        { label: " مطورين برمجيات" },
        { label: "وظائف شاغره" },
        { label: "نجار" },
        { label: "هواتف" },
        { label: "أيفون" },
      ]
    : [
        { label: "Property for Sale" },
        { label: "Property for Rent" },
        {
          label: "Property Under Construction",
        },
        { label: "Apartment for Rent" },
        { label: "Land for Sale" },
        { label: "Land for Rent" },
        { label: "Cars" },
        { label: "BMW" },
        { label: "employees" },
        { label: "Developers" },
        { label: "Vacancies" },
        { label: "carpenter" },
        { label: "Phones" },
        { label: "Apple" },
      ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-4 py-6 space-y-10 border-none">
      <Helmet>
        <title>
          {isArabic
            ? `${SiteNameAR} - منصة الإعلانات المبوبة في الإمارات`
            : `${SiteNameEN} - UAE's Classifieds Platform`}
        </title>
        <meta
          name="description"
          content={
            isArabic
              ? `اكتشف آلاف الإعلانات المجانية في العقارات، السيارات، الهواتف، الوظائف وغيرها عبر ${SiteNameAR}`
              : `Explore thousands of free classifieds for real estate, cars, phones, jobs, and more on ${SiteNameEN}`
          }
        />
        <Helmet>
          <script type="application/ld+json">
            {`
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "${isArabic ? SiteNameAR : SiteNameEN}",
        "url": "https://tamm-uae.netlify.app/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://tamm-uae.netlify.app/Searching?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    `}
          </script>
        </Helmet>
      </Helmet>

      {/* تثبيت النافبار */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900">
        <NavBar />
        {/* خط فاصل تحت النافبار */}
        <div className="border-b border-gray-300 dark:border-gray-700"></div>
      </div>

      {/* محتوى الصفحة مع padding top يعادل ارتفاع الـ NavBar + الفاصل */}
      <div className="pt-[96px] -mx-4">
        <SearchBar
          onSearch={(term) =>
            navigate(`/Searching?search=${encodeURIComponent(term)}`)
          }
          suggestions={suggestions}
        />
      </div>

      {/* 🟢 عنوان SEO واضح ومحسّن */}
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-2 text-green-700 dark:text-green-300">
        {isArabic
          ? `${SiteNameAR} - منصة الإعلانات المبوبة في الإمارات`
          : `${SiteNameEN} - UAE's Classifieds Platform`}
      </h1>

      {/* 🔵 وصف مساعد لتحسين الفكرة و SEO */}
      <p className="text-base md:text-lg text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto -mt-2">
        {isArabic
          ? `اكتشف آلاف الإعلانات في العقارات، السيارات، الهواتف، الوظائف والمزيد عبر ${SiteNameAR}`
          : `Browse thousands of ads for real estate, cars, phones, jobs and more on ${SiteNameEN}`}
      </p>

      <MainCategoriesGrid />
      <HomeSections />
      <ContactUs />
    </div>
  );
}

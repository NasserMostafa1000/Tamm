import NavBar from "../Components/NavBar";
import SearchBar from "../Components/SearchBar";
import HomeSections from "../Components/HomeSections";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LangContext";
import MainCategoriesGrid from "../Components/MainCategoriesGrid";
import { SiteNameAR, SiteNameEN } from "../Utils/Constant";
import { Helmet } from "react-helmet";
import ContactUs from "./ContactUs";
import TammLogo from "../Layouts/TammLogo";
import CategoriesMenu from "../Components/ParentAndSubCategories"; // تم إضافة هذا

import { useEffect, useState } from "react"; // تم إضافة هذا
import { useTheme } from "../Context/ThemeContext";

export default function Home() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const navigate = useNavigate();
  const { mode } = useTheme();
  const isDark = mode === "dark";
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
        { label: "سيارات للإيجار" },
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
        { label: "Car for rent" },
      ];

  // ✅ حالة التحقق من حجم الشاشة
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024); // الديسكتوب إذا كانت الشاشة >= 1024px
    };
    handleResize(); // تحقق عند التحميل
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pt-5 space-y-10 w-full">
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
        <script type="application/ld+json">
          {`
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "${isArabic ? SiteNameAR : SiteNameEN}",
        "url": "https://Dubaizzle-uae.netlify.app/",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://Dubaizzle-uae.netlify.app/Searching?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    `}
        </script>
      </Helmet>

      {/* الرأس الثابت مع اللوجو والنافبار */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50 dark:bg-gray-900 shadow-sm transition-all duration-300">
        <div className="w-full">
          <div className="flex justify-center py-3">
            <div className="w-16 h-16 md:w-20 md:h-20">
              <TammLogo />
            </div>
          </div>
          <div className="border-t border-gray-300 dark:border-gray-700 w-full h-10">
            {/* بدلاً من h-12 أو h-16 */}
            <NavBar />
          </div>
        </div>
      </header>

      <div className="pt-20 space-y-10 w-full mx-auto">
        <SearchBar
          onSearch={(term) =>
            navigate(`/Searching?search=${encodeURIComponent(term)}`)
          }
          suggestions={suggestions}
        />{" "}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center mb-2 text-green-700 dark:text-green-300">
          {isArabic
            ? `${SiteNameAR} - منصة الإعلانات المبوبة في الإمارات`
            : `${SiteNameEN} - UAE's Classifieds Platform`}
        </h1>
        <p className="text-base md:text-lg text-center text-gray-600 dark:text-gray-400 max-w-xl mx-auto -mt-2">
          {isArabic
            ? `اكتشف آلاف الإعلانات في العقارات، السيارات، الهواتف، الوظائف والمزيد عبر ${SiteNameAR}`
            : `Browse thousands of ads for real estate, cars, phones, jobs and more on ${SiteNameEN}`}
        </p>
        <MainCategoriesGrid />
        {/* ✅ CategoriesMenu يظهر فقط على الديسكتوب */}
        <HomeSections />
        {/** isDesktop && <CategoriesMenu />*/}
        {<CategoriesMenu />}
        <ContactUs />
      </div>
    </div>
  );
}

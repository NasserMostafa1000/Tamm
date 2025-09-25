import { useLanguage } from "../Context/LangContext";
import { SiteNameAR, SiteNameEN } from "../Utils/Constant";

export default function Footer() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
        {isArabic
          ? `© 2025 ${SiteNameAR}. جميع الحقوق محفوظة.`
          : `© 2025 ${SiteNameEN}. All rights reserved.`}
      </div>
    </footer>
  );
}

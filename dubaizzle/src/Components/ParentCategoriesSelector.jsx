import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LangContext";
import { fetchSubCategories } from "../Services/PostUpdateAd";
import {
  FaHome,
  FaCar,
  FaMobileAlt,
  FaUserTie,
  FaBriefcase,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaTv,
  FaBicycle,
  FaFootballBall,
  FaBook,
  FaUtensils,
  FaCarSide,
  FaBaby,
  FaPaw,
  FaTools,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

// أيقونات متاحة
const iconComponents = {
  FaHome,
  FaCar,
  FaMobileAlt,
  FaUserTie,
  FaTv,
  FaBriefcase,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBicycle,
  FaFootballBall,
  FaBook,
  FaUtensils,
  FaCarSide,
  FaBaby,
  FaPaw,
  FaTools,
};

export default function SubCategories() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isDark = mode === "dark";
  const isRTL = language === "العربية";
  const navigate = useNavigate();
  const location = useLocation();
  const { parentCategoryName, icon, ar, en } = location.state || {};

  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (parentCategoryName) {
      setIsLoading(true);
      fetchSubCategories(language, parentCategoryName)
        .then((data) => {
          setSubCategories(data);
          setFilteredSubCategories(data);
        })
        .finally(() => setIsLoading(false));
    }
  }, [parentCategoryName, language]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredSubCategories(subCategories);
    } else {
      const filtered = subCategories.filter((sub) =>
        sub.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSubCategories(filtered);
    }
  }, [searchTerm, subCategories]);

  const handleClick = (subCategory) => {
    navigate("/Searching", {
      state: { searchTerm: subCategory.categoryName },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const Icon = iconComponents[icon] || FaHome;

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: isDark ? "#121212" : "#f8f9fa" }}
      >
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: isDark ? "#81C784" : "#4CAF50" }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className={`w-full min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* رأس الصفحة */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              style={{
                backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                color: isDark ? "#e2e8f0" : "#2d3748",
                border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
              }}
            >
              <FaArrowLeft className={isRTL ? "rotate-180" : ""} />
              <span className="text-sm font-medium">
                {language === "العربية" ? "رجوع" : "Back"}
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div
                className="p-3 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isDark ? "#2e3b4e" : "#e6f7e6",
                  color: isDark ? "#81C784" : "#4CAF50",
                }}
              >
                <Icon size={28} />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: isDark ? "#e2e8f0" : "#2d3748" }}
                >
                  {language === "العربية" ? ar : en}
                </h1>
                <p
                  className="text-sm opacity-75"
                  style={{ color: isDark ? "#e2e8f0" : "#2d3748" }}
                >
                  {language === "العربية"
                    ? `${filteredSubCategories.length} قسم فرعي`
                    : `${filteredSubCategories.length} subcategories`}
                </p>
              </div>
            </div>
          </div>

          {/* شريط البحث */}
          <div className="w-full md:w-64">
            <div className="relative">
              <div
                className={`absolute inset-y-0 ${
                  isRTL ? "right-0 pr-3" : "left-0 pl-3"
                } flex items-center pointer-events-none`}
              >
                <FaSearch
                  className="h-4 w-4"
                  style={{
                    color: isDark ? "#e2e8f0" : "#2d3748",
                    opacity: 0.7,
                  }}
                />
              </div>
              <input
                type="text"
                placeholder={
                  language === "العربية"
                    ? "ابحث في الأقسام..."
                    : "Search subcategories..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full py-3 ${
                  isRTL ? "pr-10" : "pl-10"
                } rounded-xl border-0 focus:ring-2 focus:ring-offset-2 transition-all duration-200`}
                style={{
                  backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                  color: isDark ? "#e2e8f0" : "#2d3748",
                  border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
                }}
              />
            </div>
          </div>
        </div>

        {/* شبكة الأقسام الفرعية */}
        {filteredSubCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {filteredSubCategories.map((sub) => (
              <div
                key={sub.categoryId}
                onClick={() => handleClick(sub)}
                className={`category-item cursor-pointer rounded-2xl shadow-lg flex flex-col items-center justify-center 
                  transition-all duration-300 p-2 md:p-4 hover:shadow-xl hover:-translate-y-1`}
                style={{
                  minHeight: "100px",
                  maxHeight: "150px",
                  backgroundColor: isDark ? "#1e1e1e" : "#ffffff",
                  color: isDark ? "#e2e8f0" : "#2d3748",
                  border: `1px solid ${isDark ? "#374151" : "#e2e8f0"}`,
                }}
              >
                <Icon
                  className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 sm:mb-2 ${
                    isDark ? "text-orange-500" : "text-red-600"
                  }`}
                />
                <span
                  className="mt-8 font-semibold md:font-bold text-center 
                    text-xs sm:text-sm md:text-base lg:text-lg
                    px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm shadow
                    w-full whitespace-normal break-words leading-tight"
                >
                  {sub.categoryName}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: isDark ? "#2e3b4e" : "#e6f7e6",
                color: isDark ? "#81C784" : "#4CAF50",
              }}
            >
              <FaSearch size={32} />
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: isDark ? "#e2e8f0" : "#2d3748" }}
            >
              {language === "العربية" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p
              className="opacity-75"
              style={{ color: isDark ? "#e2e8f0" : "#2d3748" }}
            >
              {language === "العربية"
                ? "لم نتمكن من العثور على أقسام تطابق بحثك"
                : "We couldn't find any subcategories matching your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

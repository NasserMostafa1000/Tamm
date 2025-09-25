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
  FaBicycle,
  FaFootballBall,
  FaBook,
  FaUtensils,
  FaBaby,
  FaPaw,
  FaTools,
  FaArrowLeft,
  FaSearch,
} from "react-icons/fa";

// نظام ألوان متكامل
const lightTheme = {
  primary: "#4CAF50",
  secondary: "#2196F3",
  background: "#f8f9fa",
  cardBg: "#ffffff",
  text: "#2d3748",
  iconBg: "#e6f7e6",
  hoverBg: "#f0f0f0",
  border: "#e2e8f0",
};

const darkTheme = {
  primary: "#81C784",
  secondary: "#64B5F6",
  background: "#121212",
  cardBg: "#1e1e1e",
  text: "#e2e8f0",
  iconBg: "#2e3b4e",
  hoverBg: "#2d3748",
  border: "#374151",
};

const iconComponents = {
  FaHome,
  FaCar,
  FaMobileAlt,
  FaUserTie,
  FaBriefcase,
  FaLaptop,
  FaTshirt,
  FaCouch,
  FaBicycle,
  FaFootballBall,
  FaBook,
  FaUtensils,
  FaBaby,
  FaPaw,
  FaTools,
};

export default function SubCategories() {
  const { mode } = useTheme();
  const { language } = useLanguage();
  const isDark = mode === "dark";
  const isRTL = language === "العربية";
  const theme = isDark ? darkTheme : lightTheme;
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
      state: {
        searchTerm: subCategory.categoryName,
      },
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
        style={{ backgroundColor: theme.background }}
      >
        <div
          className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4"
          style={{ borderColor: theme.primary }}
        ></div>
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen"
      style={{ backgroundColor: theme.background }}
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
                backgroundColor: theme.cardBg,
                color: theme.text,
                border: `1px solid ${theme.border}`,
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
                  backgroundColor: theme.iconBg,
                  color: theme.primary,
                }}
              >
                <Icon size={28} />
              </div>
              <div>
                <h1
                  className="text-2xl md:text-3xl font-bold"
                  style={{ color: theme.text }}
                >
                  {language === "العربية" ? ar : en}
                </h1>
                <p className="text-sm opacity-75" style={{ color: theme.text }}>
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
                  style={{ color: theme.text, opacity: 0.7 }}
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
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  focusRingColor: theme.primary,
                }}
              />
            </div>
          </div>
        </div>

        {/* شبكة الأقسام الفرعية */}
        {filteredSubCategories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredSubCategories.map((sub) => (
              <div
                key={sub.categoryId}
                onClick={() => handleClick(sub)}
                className="group cursor-pointer flex flex-col items-center justify-center p-2 sm:p-4 md:p-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                style={{
                  backgroundColor: theme.cardBg,
                  color: theme.text,
                  border: `1px solid ${theme.border}`,
                  minHeight: "120px",
                }}
              >
                <div
                  className="p-3 md:p-4 rounded-2xl mb-2 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: theme.iconBg,
                    color: theme.primary,
                  }}
                >
                  <Icon size={28} className="md:w-8 md:h-8" />
                </div>
                <span className="text-xs sm:text-sm md:text-base font-semibold text-center leading-tight px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm shadow-md line-clamp-2">
                  {sub.categoryName}
                </span>
                <div
                  className="w-0 group-hover:w-8 h-1 rounded-full mt-2 transition-all duration-300"
                  style={{ backgroundColor: theme.primary }}
                ></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div
              className="w-24 h-24 mx-auto mb-4 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.iconBg, color: theme.primary }}
            >
              <FaSearch size={32} />
            </div>
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: theme.text }}
            >
              {language === "العربية" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="opacity-75" style={{ color: theme.text }}>
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

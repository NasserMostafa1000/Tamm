import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCar,
  FaMobileAlt,
  FaUserTie,
  FaBriefcase,
  FaSearch,
} from "react-icons/fa";
import fetchCategories from "../Services/PostUpdateAd";
import { categoryMap } from "../Utils/Constant";

const iconComponents = {
  FaHome,
  FaCar,
  FaMobileAlt,
  FaUserTie,
  FaBriefcase,
};

export default function MainCategoriesGrid() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const isRTL = language === "العربية";

  useEffect(() => {
    fetchCategories(language).then((data) => {
      setCategories(data);
      setFilteredCategories(data);
    });
  }, [language]);

  const handleCategoryClick = (category) => {
    navigate("/SubCategories", {
      state: {
        parentCategoryName: category.categoryName,
        icon: categoryMap[category.categoryName]?.icon || "FaHome",
        ar: categoryMap[category.categoryName]?.ar,
        en: categoryMap[category.categoryName]?.en,
      },
    });
  };

  const renderItem = (cat) => {
    const config = categoryMap[cat.categoryName];
    if (!config) return null;
    const Icon = iconComponents[config.icon];
    const displayName = language === "العربية" ? config.ar : config.en;

    return (
      <div
        key={cat.categoryId}
        onClick={() => handleCategoryClick(cat)}
        className={`category-item cursor-pointer rounded-2xl shadow-lg flex flex-col items-center justify-center 
          transition-all duration-300 p-2 md:p-4 hover:shadow-xl hover:-translate-y-1
          ${
            isDark
              ? "bg-gray-800 text-white border border-gray-700 hover:border-yellow-400 hover:bg-gray-750"
              : "bg-white text-gray-800 border border-gray-200 hover:border-yellow-500 hover:bg-gray-50"
          }`}
        style={{ minHeight: "100px", maxHeight: "150px" }}
      >
        <Icon
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-1 sm:mb-2 ${
            isDark ? "text-orange-500" : "text-red-600"
          }`}
        />

        <span
          className="mt-8 font-semibold md:font-bold text-center text-sm md:text-base lg:text-lg
             px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm shadow
             w-full truncate"
        >
          {displayName}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`main-categories-container w-full py-8 md:py-12 px-2 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      } ${isRTL ? "text-right" : "text-left"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto">
        {/* عنوان الصفحة */}
        <div className="mb-8 md:mb-12 text-center">
          <h1
            className={`text-2xl md:text-3xl lg:text-4xl font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
            {language === "العربية" ? "الفئات الرئيسية" : "Main Categories"}
          </h1>
          <p
            className={`text-sm md:text-base ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {language === "العربية"
              ? "اختر الفئة التي تريد استعراضها"
              : "Choose the category you want to explore"}
          </p>
        </div>

        {/* شريط البحث */}
        <div className="mb-8 md:mb-10 max-w-md mx-auto">
          <div
            className={`relative rounded-full shadow-md ${
              isDark ? "bg-gray-800" : "bg-white"
            }`}
          ></div>
        </div>

        {/* شبكة الفئات - دائمًا 3 أعمدة */}
        {filteredCategories.length > 0 ? (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {filteredCategories.map(renderItem)}
          </div>
        ) : (
          <div className="text-center py-12">
            <p
              className={`text-lg md:text-xl ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {language === "العربية"
                ? "لا توجد فئات تطابق بحثك"
                : "No categories match your search"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

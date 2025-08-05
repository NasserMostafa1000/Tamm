import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../Context/ThemeContext";
import { useLanguage } from "../Context/LangContext";
import { fetchSubCategories } from "../Services/PostAd";
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
} from "react-icons/fa";

// نظام ألوان متكامل
const lightTheme = {
  primary: "#4CAF50", // أخضر
  secondary: "#2196F3", // أزرق
  background: "#f8f9fa",
  cardBg: "#ffffff",
  text: "#2d3748",
  iconBg: "#e6f7e6",
  hoverBg: "#f0f0f0",
};

const darkTheme = {
  primary: "#81C784", // أخضر فاتح
  secondary: "#64B5F6", // أزرق فاتح
  background: "#121212",
  cardBg: "#1e1e1e",
  text: "#e2e8f0",
  iconBg: "#2e3b4e",
  hoverBg: "#2d3748",
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
  const theme = isDark ? darkTheme : lightTheme;
  const navigate = useNavigate();
  const location = useLocation();
  const { parentCategoryName, icon, ar, en } = location.state || {};

  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    if (parentCategoryName) {
      fetchSubCategories(language, parentCategoryName).then(setSubCategories);
    }
  }, [parentCategoryName, language]);

  const handleClick = (subCategory) => {
    navigate("/Searching", {
      state: {
        searchTerm: subCategory.categoryName,
      },
    });
  };

  const Icon = iconComponents[icon] || FaHome;

  return (
    <div
      className="w-full flex flex-col items-center gap-4 py-6 min-h-screen"
      style={{ backgroundColor: theme.background }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: theme.primary }}>
        {language === "العربية"
          ? `الأقسام الفرعية لـ ${ar}`
          : `Subcategories of ${en}`}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 w-full max-w-6xl">
        {subCategories.map((sub) => (
          <div
            key={sub.categoryId}
            onClick={() => handleClick(sub)}
            className="cursor-pointer flex flex-col items-center justify-center p-6 rounded-xl shadow-lg hover:scale-105 transition duration-300 transform"
            style={{
              backgroundColor: theme.cardBg,
              color: theme.text,
              "&:hover": {
                backgroundColor: theme.hoverBg,
              },
            }}
          >
            <div
              className="p-4 rounded-full mb-3 flex items-center justify-center"
              style={{
                backgroundColor: theme.iconBg,
                color: theme.primary,
              }}
            >
              <Icon size={24} />
            </div>
            <span className="text-sm font-medium text-center">
              {sub.categoryName}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

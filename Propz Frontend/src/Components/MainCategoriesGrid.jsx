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
} from "react-icons/fa";
import fetchCategories from "../Services/PostAd";
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

  useEffect(() => {
    fetchCategories(language).then((data) => setCategories(data));
  }, [language]);

  const handleCategoryClick = (category) => {
    navigate("/SubCategories", {
      state: {
        parentCategoryName: category.categoryName,
        icon: categoryMap[category.categoryName]?.icon || "FaHome", // default
        ar: categoryMap[category.categoryName]?.ar,
        en: categoryMap[category.categoryName]?.en,
      },
    });
  };

  const topTwo = categories.slice(0, 2);
  const middleTwo = categories.slice(2, 4);
  const centerOne = categories.slice(4, 5);

  const renderItem = (cat) => {
    const config = categoryMap[cat.categoryName];
    if (!config) return null;

    const Icon = iconComponents[config.icon];
    const displayName = language === "العربية" ? config.ar : config.en;

    return (
      <div
        key={cat.categoryId}
        onClick={() => handleCategoryClick(cat)}
        className={`cursor-pointer w-36 h-36 rounded-xl shadow-md flex flex-col items-center justify-center 
          hover:scale-105 transition duration-300 ${
            isDark
              ? "bg-black text-yellow-400 border border-yellow-400"
              : "bg-yellow-400 text-black border border-black"
          }`}
      >
        <Icon size={30} className={isDark ? "text-yellow-400" : "text-black"} />
        <span className="mt-2 text-sm font-semibold text-center px-2">
          {displayName}
        </span>
      </div>
    );
  };

  return (
    <div
      className={`w-full flex flex-col items-center gap-4 py-6 ${
        isDark ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div className="flex gap-4">{topTwo.map(renderItem)}</div>
      <div className="flex gap-4">{middleTwo.map(renderItem)}</div>
      <div className="flex justify-center">{centerOne.map(renderItem)}</div>
    </div>
  );
}

// CategoriesMenu.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../Utils/Constant";

const DISPLAY_CHILD_LIMIT = 5;

export default function CategoriesMenu() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const navigate = useNavigate();

  const { isArabic, direction } = useMemo(
    () => ({
      isArabic: language === "العربية",
      direction: language === "العربية" ? "rtl" : "ltr",
    }),
    [language]
  );

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigation = useCallback(
    (category, seeAll = false) => {
      const params = new URLSearchParams({
        search: category.CategoryName,
        categoryId: category.CategoryId,
      });
      if (seeAll) params.append("seeAll", "true");
      navigate(`/Searching?${params.toString()}`);
    },
    [navigate]
  );

  const handleChildClick = useCallback(
    (child) => handleNavigation(child),
    [handleNavigation]
  );

  const handleParentClick = useCallback(
    (parent) => handleNavigation(parent),
    [handleNavigation]
  );

  const handleSeeAllClick = useCallback(
    (parent) => handleNavigation(parent, true),
    [handleNavigation]
  );

  useEffect(() => {
    const abortController = new AbortController();

    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${API_BASE_URL}Categories/GetAll?lang=${isArabic ? "ar" : "en"}`,
          {
            signal: abortController.signal,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCategories(data.Categories || []);
      } catch (err) {
        if (err.name === "AbortError") return;
        console.error("Error fetching categories:", err);
        setError(isArabic ? "فشل تحميل الفئات" : "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    return () => abortController.abort();
  }, [isArabic]);

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-12">
      <div
        className={`animate-spin rounded-full border-b-2 ${
          isDark ? "border-blue-300" : "border-blue-500"
        }`}
        style={{ width: "40px", height: "40px" }}
      ></div>
    </div>
  );

  const ErrorMessage = () => (
    <div
      className={`text-center py-8 ${isDark ? "text-red-300" : "text-red-500"}`}
    >
      {error}
    </div>
  );

  const EmptyState = () => (
    <div
      className={`text-center py-8 ${
        isDark ? "text-gray-400" : "text-gray-500"
      }`}
    >
      {isArabic ? "لا توجد فئات متاحة" : "No categories available"}
    </div>
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage />;
  if (categories.length === 0) return <EmptyState />;

  return (
    <section
      className={`${isDark ? "bg-gray-900" : "bg-gray-50"} py-8`}
      dir={direction}
    >
      <div className="container mx-auto px-4">
        <h2
          className={`text-2xl font-bold mb-8 text-center ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {isArabic ? "الفئات الشائعة" : "Popular Categories"}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {categories.map((parent) => (
            <div key={parent.CategoryId}>
              {/* الفئة الرئيسية */}
              <button
                onClick={() => handleParentClick(parent)}
                className={`font-bold text-lg mb-2 w-full ${
                  direction === "rtl" ? "text-right" : "text-left"
                } ${
                  isDark
                    ? "text-blue-300 hover:text-blue-200"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {parent.CategoryName}
              </button>

              {/* الفئات الفرعية */}
              <div
                className={`${direction === "rtl" ? "mr-2" : "ml-2"} space-y-1`}
              >
                {parent.Children?.slice(0, DISPLAY_CHILD_LIMIT).map((child) => (
                  <button
                    key={child.CategoryId}
                    onClick={() => handleChildClick(child)}
                    className={`block text-sm w-full ${
                      direction === "rtl" ? "text-right" : "text-left"
                    } hover:underline transition-colors duration-200 ${
                      isDark
                        ? "text-gray-300 hover:text-blue-300"
                        : "text-gray-700 hover:text-blue-600"
                    }`}
                  >
                    {child.CategoryName}
                  </button>
                ))}

                {/* See All يظهر فقط إذا تجاوز عدد الأطفال الحد */}
                {parent.Children && (
                  <button
                    onClick={() => handleSeeAllClick(parent)}
                    className={`mt-1 text-sm font-medium flex items-center justify-between w-full ${
                      isDark
                        ? "text-green-400 hover:text-green-300"
                        : "text-green-600 hover:text-green-800"
                    }`}
                  >
                    <span>
                      {isArabic
                        ? `الكامل في ${parent.CategoryName}`
                        : `See all in ${parent.CategoryName}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

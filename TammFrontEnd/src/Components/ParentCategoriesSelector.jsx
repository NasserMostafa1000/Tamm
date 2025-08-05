import { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import fetchCategories from "../Services/PostAd";
import {
  FaCar,
  FaBuilding,
  FaPhone,
  FaUsers,
  FaSuitcase,
} from "react-icons/fa";

export default function CategoriesSelector({ onCategorySelect }) {
  const { language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const data = await fetchCategories(language);
        setCategories(data);
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [language]);

  const handleSelect = (id) => {
    const selectedCategory = categories.find((cat) => cat.categoryId === id);
    setSelectedId(id);
    if (selectedCategory) {
      onCategorySelect(id, selectedCategory.categoryName);
    }
  };

  const getCategoryIcon = (name) => {
    const normalized = name.toLowerCase();
    if (
      normalized.includes("سيارات") ||
      normalized.includes("cars") ||
      normalized.includes("car")
    )
      return <FaCar className="text-3xl mb-2" />;
    if (normalized.includes("عقارات") || normalized.includes("real estate"))
      return <FaBuilding className="text-3xl mb-2" />;
    if (
      normalized.includes("هواتف") ||
      normalized.includes("phones") ||
      normalized.includes("phone")
    )
      return <FaPhone className="text-3xl mb-2" />;
    if (normalized.includes("موظفين") || normalized.includes("employees"))
      return <FaUsers className="text-3xl mb-2" />;
    if (
      normalized.includes("وظائف") ||
      normalized.includes("vacancies") ||
      normalized.includes("job")
    )
      return <FaSuitcase className="text-3xl mb-2" />;
    return null; // ما فيش أيقونة مناسبة
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
      <label className="block text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-4 select-none">
        {language === "العربية" ? "اختر القسم الرئيسي" : "Select Main Category"}
      </label>

      {loading ? (
        <div className="text-center text-yellow-500 dark:text-yellow-300 animate-pulse">
          {language === "العربية"
            ? "جاري تحميل الأقسام..."
            : "Loading categories..."}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => handleSelect(cat.categoryId)}
              className={`p-5 rounded-2xl border-2 font-semibold text-center transition-shadow duration-300 shadow-sm
                ${
                  selectedId === cat.categoryId
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-yellow-400"
                    : "bg-white dark:bg-gray-900 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:shadow-yellow-300 hover:border-yellow-400"
                }
              `}
            >
              <div className="flex flex-col items-center justify-center gap-1">
                {getCategoryIcon(cat.categoryName)}
                <span>{cat.categoryName}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

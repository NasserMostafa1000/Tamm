import { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { fetchSubCategories, addSubCategory } from "../Services/PostAd.js";
import { FiSearch } from "react-icons/fi";

export default function SubCategoriesSelector({
  parentCategoryName,
  onSubCategorySelect,
  parentCategoryId,
}) {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isArabic = language === "العربية";
  const isDarkMode = mode === "dark";
  const [subCategories, setSubCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [categoryNameAr, setCategoryNameAr] = useState("");
  const [categoryNameEn, setCategoryNameEn] = useState("");
  const [formError, setFormError] = useState("");
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    if (!parentCategoryName?.trim()) {
      setSubCategories([]);
      setFilteredCategories([]);
      setSelectedId(null);
      onSubCategorySelect("");
      return;
    }

    const loadSubCategories = async () => {
      setLoading(true);
      try {
        const data = await fetchSubCategories(language, parentCategoryName);
        setSubCategories(data);
        setFilteredCategories(data);
      } catch {
        setSubCategories([]);
        setFilteredCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadSubCategories();
  }, [language, parentCategoryName]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCategories(subCategories);
    } else {
      const filtered = subCategories.filter((cat) =>
        cat.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [searchQuery, subCategories]);

  const handleSelect = (id) => {
    setSelectedId(id);
    onSubCategorySelect(id);
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    if (!categoryNameAr.trim() || !categoryNameEn.trim()) {
      setFormError(
        isArabic ? "يرجى ملء جميع الحقول" : "Please fill all fields"
      );
      return;
    }

    setFormError("");
    setAdding(true);
    try {
      await addSubCategory({
        parentCategoryId,
        categoryNameAr,
        categoryNameEn,
      });

      const updated = await fetchSubCategories(language, parentCategoryName);
      setSubCategories(updated);
      setFilteredCategories(updated);
      setShowForm(false);
      setCategoryNameAr("");
      setCategoryNameEn("");
      setSearchQuery("");
    } catch {
      setFormError(
        isArabic ? "حدث خطأ أثناء الإضافة" : "Error adding category"
      );
    } finally {
      setAdding(false);
    }
  };

  const showAddLabel =
    parentCategoryName?.toLowerCase() !== "عقارات" &&
    parentCategoryName?.toLowerCase() !== "real estates";

  return (
    <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
      <label className="block text-lg font-semibold text-yellow-600 dark:text-yellow-400 mb-3 md:mb-4 select-none">
        {isArabic ? "اختر القسم الفرعي" : "Select Sub Category"}
      </label>

      {/* شريط البحث */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className={`block w-full pl-10 pr-3 py-2 border ${
            isArabic ? "text-right" : "text-left"
          } rounded-lg ${
            isDarkMode ? "bg-gray-700 text-white" : "bg-white text-gray-900"
          } focus:outline-none focus:ring-2 focus:ring-yellow-500`}
          placeholder={isArabic ? "ابحث..." : "Search..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-pulse text-yellow-500 dark:text-yellow-300">
            {isArabic ? "جاري تحميل الأقسام..." : "Loading categories..."}
          </div>
        </div>
      ) : filteredCategories.length === 0 ? (
        <p className="text-center py-4 text-gray-500 dark:text-gray-400">
          {isArabic ? "لا توجد أقسام فرعية" : "No subcategories available"}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
          {filteredCategories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() => handleSelect(cat.categoryId)}
              className={`p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl transition-all duration-200 border-2 min-h-[80px] flex items-center justify-center ${
                selectedId === cat.categoryId
                  ? "bg-yellow-500 border-yellow-500 text-white shadow-md shadow-yellow-400/30"
                  : "bg-white dark:bg-gray-800 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-50 dark:hover:bg-gray-700"
              }`}
            >
              <div className="text-xs sm:text-sm break-words text-center">
                {cat.categoryName}
              </div>
            </button>
          ))}
        </div>
      )}

      {showAddLabel &&
        !showForm &&
        parentCategoryName !== "Real Estate" &&
        parentCategoryName !== "عقارات" && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm sm:text-base underline"
            >
              {isArabic ? "+ أضف قسم فرعي" : "+ Add Subcategory"}
            </button>
          </div>
        )}

      {showForm && (
        <form
          onSubmit={handleAddSubCategory}
          className="mt-4 bg-yellow-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md"
        >
          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder={isArabic ? "الاسم بالعربية" : "Name in Arabic"}
                value={categoryNameAr}
                onChange={(e) => setCategoryNameAr(e.target.value)}
                className="w-full p-2 sm:p-3 rounded border border-yellow-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder={isArabic ? "الاسم بالإنجليزية" : "Name in English"}
                value={categoryNameEn}
                onChange={(e) => setCategoryNameEn(e.target.value)}
                className="w-full p-2 sm:p-3 rounded border border-yellow-400 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 text-gray-800 dark:text-gray-200 dark:bg-gray-700"
              />
            </div>
            {formError && (
              <p className="text-red-500 dark:text-red-400 text-sm">
                {formError}
              </p>
            )}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-2">
              <button
                type="submit"
                disabled={adding}
                className={`px-3 sm:px-4 py-2 rounded text-sm sm:text-base ${
                  adding
                    ? "bg-yellow-400 dark:bg-yellow-600 cursor-not-allowed"
                    : "bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700"
                } text-white`}
              >
                {adding
                  ? isArabic
                    ? "جارٍ الإضافة..."
                    : "Adding..."
                  : isArabic
                  ? "إضافة"
                  : "Add"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setCategoryNameAr("");
                  setCategoryNameEn("");
                }}
                className="px-3 sm:px-4 py-2 rounded text-sm sm:text-base bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

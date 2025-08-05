// Pages/SettingsPage.jsx
import React, { useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useLocationContext } from "../Context/LocationProvider";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  Star,
  Tag,
  Globe,
  SunMoon,
  Languages,
  Settings as SettingsIcon,
} from "lucide-react";
import { deletePerson } from "../Services/Clients.js";
import { GetCurrentUserId } from "../Utils/Constant.js";

const SettingsPage = () => {
  const { language, toggleLanguage } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const { currentPlace, setCurrentPlace, emirates } = useLocationContext();
  const navigate = useNavigate();

  const isArabic = language === "العربية";
  const dir = isArabic ? "rtl" : "ltr";
  const textAlign = isArabic ? "text-right" : "text-left";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("userToken");
  const userId = GetCurrentUserId(token);
  const handleDeleteAccount = async () => {
    if (!token || !userId) {
      alert(isArabic ? "غير مسموح لك بالحذف" : "Unauthorized to delete");
      return;
    }

    const confirmed = window.confirm(
      isArabic
        ? "هل أنت متأكد من حذف حسابك؟"
        : "Are you sure you want to delete your account?"
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      await deletePerson(userId, token);
      setLoading(false);
      alert(isArabic ? "تم حذف الحساب بنجاح" : "Account deleted successfully");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError(err);
      alert(err);
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header with icon */}
        <div className={`flex items-center gap-3 mb-8 ${textAlign}`}>
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300">
            <SettingsIcon size={28} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isArabic ? "الإعدادات" : "Settings"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {isArabic
                ? "إدارة إعدادات حسابك وتفضيلاتك"
                : "Manage your account preferences"}
            </p>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Language Setting */}
          <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300">
                  <Languages size={20} />
                </div>
                <span
                  className={`font-medium text-gray-700 dark:text-gray-200 ${textAlign}`}
                >
                  {isArabic ? "اللغة" : "Language"}
                </span>
              </div>
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {language}
              </button>
            </div>
          </div>

          {/* Theme Setting */}
          <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300">
                  <SunMoon size={20} />
                </div>
                <span
                  className={`font-medium text-gray-700 dark:text-gray-200 ${textAlign}`}
                >
                  {isArabic ? "الوضع" : "Theme"}
                </span>
              </div>
              <button
                onClick={toggleMode}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {mode === "dark"
                  ? isArabic
                    ? "داكن"
                    : "Dark"
                  : isArabic
                  ? "فاتح"
                  : "Light"}
              </button>
            </div>
          </div>

          {/* Location Setting */}
          <div className="p-5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-t border-gray-100 dark:border-gray-700">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300">
                  <Globe size={20} />
                </div>
                <label
                  className={`font-medium text-gray-700 dark:text-gray-200 ${textAlign}`}
                >
                  {isArabic ? "الموقع" : "Location"}
                </label>
              </div>
              <select
                value={currentPlace}
                onChange={(e) => setCurrentPlace(e.target.value)}
                className="mt-1 p-3 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              >
                {emirates.map((place) => (
                  <option key={place} value={place}>
                    {isArabic && place === "All Emirates"
                      ? "كل الإمارات"
                      : place}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-5 space-y-4 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={() => navigate("/MyFavourits")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300">
                <Star size={20} />
              </div>
              <span
                className={`font-medium text-gray-700 dark:text-gray-200 ${textAlign}`}
              >
                {isArabic ? "المفضلة" : "MyFavourits"}
              </span>
            </button>

            <button
              onClick={() => navigate("/MyAds")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300">
                <Tag size={20} />
              </div>
              <span
                className={`font-medium text-gray-700 dark:text-gray-200 ${textAlign}`}
              >
                {isArabic ? "إعلاناتي" : "My Listings"}
              </span>
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-5 border-t border-gray-100 dark:border-gray-700">
            <button
              onClick={handleDeleteAccount}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 p-3 rounded-lg ${
                loading
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                  : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
              } transition-colors font-medium`}
            >
              <Trash2 size={20} />
              {loading
                ? isArabic
                  ? "جاري الحذف..."
                  : "Deleting..."
                : isArabic
                ? "حذف حسابي الآن"
                : "Delete My Account"}
            </button>
            {error && (
              <p className="mt-2 text-red-600 dark:text-red-400 text-center font-medium">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

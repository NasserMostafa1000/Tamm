import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { getContactUs, updateContactUs } from "../Services/AdminContact";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const UpdateContactInfo = () => {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isArabic = language === "العربية";

  const [contactData, setContactData] = useState({
    email: "",
    phone: "",
    whatsApp: "",
    instagram: "",
    facebook: "",
    twitter: "",
    telegram: "",
    youtube: "",
    website: "",
    addressAr: "",
    addressEn: "",
    workingHours: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getContactUs();
        setContactData(response);
      } catch {
        toast.error(
          isArabic ? "فشل في تحميل البيانات" : "Failed to load contact info"
        );
      }
    };
    fetchData();
  }, [isArabic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateContactUs(contactData, localStorage.getItem("userToken"));
      toast.success(isArabic ? "تم التحديث بنجاح" : "Updated successfully");
    } catch {
      toast.error(isArabic ? "حدث خطأ أثناء التحديث" : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const contactFields = [
    ["email", "البريد الإلكتروني", "Email"],
    ["phone", "رقم الهاتف", "Phone"],
    ["whatsApp", "رقم واتساب", "WhatsApp"],
    ["instagram", "انستجرام", "Instagram"],
    ["facebook", "فيسبوك", "Facebook"],
    ["twitter", "تويتر", "Twitter"],
    ["telegram", "تليجرام", "Telegram"],
    ["youtube", "يوتيوب", "YouTube"],
    ["website", "الموقع الإلكتروني", "Website"],
    ["addressAr", "العنوان (عربي)", "Address (Arabic)"],
    ["addressEn", "العنوان (إنجليزي)", "Address (English)"],
    ["workingHours", "ساعات العمل", "Working Hours"],
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen py-8 px-4 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            {isArabic ? "تحديث معلومات الاتصال" : "Update Contact Info"}
          </h2>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {isArabic
              ? "قم بتحديث معلومات التواصل الخاصة بمنصتك"
              : "Update your platform's contact information"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactFields.map(([field, ar, en], index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className={`p-4 rounded-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } shadow-md hover:shadow-lg transition-shadow`}
            >
              <label
                className={`block mb-2 font-medium ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {isArabic ? ar : en}
              </label>
              <input
                name={field}
                value={contactData[field] || ""}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400 focus:ring-blue-500/30"
                    : "bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-blue-200"
                } focus:ring-2 focus:ring-opacity-50 transition-all`}
              />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <motion.button
            onClick={handleUpdate}
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`px-8 py-3 rounded-full font-medium text-lg ${
              isDark
                ? "bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            } text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center mx-auto min-w-[200px]`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isArabic ? "جاري التحديث..." : "Updating..."}
              </>
            ) : isArabic ? (
              "تحديث المعلومات"
            ) : (
              "Update Information"
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UpdateContactInfo;

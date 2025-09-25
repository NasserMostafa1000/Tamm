import React from "react";
import { motion } from "framer-motion";

// قائمة بالأيقونات الشائعة للسمات
const attributeIcons = {
  // السمات العامة
  Area: "📐",
  المساحة: "📐",
  Bedrooms: "🛏️",
  "غرف النوم": "🛏️",
  Bathrooms: "🚿",
  الحمامات: "🚿",
  "Furnished?": "🛋️",
  "التأثيث؟": "🛋️",
  "Monthly Rent": "💰",
  "الإيجار الشهري": "💰",
  "Floor Number": "🏢",
  "رقم الطابق": "🏢",
  "Balcony?": "🌅",
  "شرفة؟": "🌅",
  "Parking?": "🚗",
  "مواقف سيارات؟": "🚗",
  "AC Type": "❄️",
  "نوع التكييف": "❄️",
  "Mortgage Available?": "🏦",
  "الرهن متاح؟": "🏦",
  "Year Built": "🏗️",
  "سنة البناء": "🏗️",
  "Contract Duration": "📝",
  "مدة العقد": "📝",
  "Bills Included?": "🧾",
  "الفواتير مشمولة؟": "🧾",

  // سمات السيارات
  Brand: "🏷️",
  الماركة: "🏷️",
  Model: "🚙",
  الموديل: "🚙",
  Year: "📅",
  السنة: "📅",
  Mileage: "🛣️",
  "المسافة المقطوعة": "🛣️",
  "Fuel Type": "⛽",
  "نوع الوقود": "⛽",
  Transmission: "⚙️",
  "ناقل الحركة": "⚙️",
  Condition: "🔧",
  الحالة: "🔧",
  Color: "🎨",
  اللون: "🎨",
  Price: "💵",
  السعر: "💵",
};

const ListingAttributes = ({ attributes, isDarkMode, isArabic }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className={`p-6 rounded-2xl mb-0 border ${
        isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200 shadow-lg"
      }`}
      style={{
        fontFamily:
          "'Inter', 'Segoe UI', 'Tahoma', 'Geneva', 'Verdana', sans-serif",
      }}
    >
      <div className="flex items-center mb-6">
        <div
          className={`p-2 rounded-lg mr-3 ${
            isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
          }`}
        >
          <span className="text-xl">📋</span>
        </div>
        <h2
          className={`text-2xl font-bold ${
            isDarkMode ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {isArabic ? "تفاصيل الإعلان" : "Listing Details"}
        </h2>
      </div>

      {attributes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {attributes.map(({ attributeName, value }, idx) => {
            const icon = attributeIcons[attributeName] || "📌";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * idx }}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] ${
                  isDarkMode
                    ? "bg-gray-700/50 hover:bg-gray-700"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center">
                  <span className="text-lg mr-3">{icon}</span>
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {attributeName}
                  </span>
                </div>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-sm ${
                    isDarkMode
                      ? "bg-blue-900/30 text-blue-300"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {value}
                </span>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`text-center py-8 rounded-xl ${
            isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <div className="text-4xl mb-3">📄</div>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isArabic ? "لا توجد تفاصيل إضافية" : "No additional details"}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ListingAttributes;

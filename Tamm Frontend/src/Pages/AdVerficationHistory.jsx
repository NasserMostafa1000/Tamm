import React, { useEffect, useState } from "react";
import { getAdVerificationHistory } from "../Services/AdVerfications";
import { useAuth } from "../Context/TokenContext";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { Eye, Loader, ClipboardList, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdVerificationHistoryContainer() {
  const { userToken } = useAuth();
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError(null);
      try {
        const data = await getAdVerificationHistory(userToken);
        setHistory(data);
      } catch (err) {
        console.log(err);
        setError(
          language === "العربية"
            ? "فشل في تحميل السجلات."
            : "Failed to load history."
        );
      } finally {
        setLoading(false);
      }
    }

    if (userToken) fetchHistory();
  }, [userToken, language]);

  // ترجمة الحالات
  function translateCaseName(caseName) {
    if (language === "العربية") return caseName;
    switch (caseName) {
      case "قبول":
        return "Approved";
      case "رفض":
        return "Rejected";
      case "تعديل":
        return "Edit Requested";
      default:
        return caseName;
    }
  }

  if (loading)
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Loader className="animate-spin h-10 w-10 mb-4 text-blue-500" />
        <p
          className={`${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          } text-lg`}
        >
          {language === "العربية" ? "جارٍ التحميل..." : "Loading..."}
        </p>
      </div>
    );

  if (error)
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <XCircle className="h-10 w-10 mb-4 text-red-500" />
        <p
          className={`text-lg ${isDarkMode ? "text-red-400" : "text-red-600"}`}
        >
          {error}
        </p>
      </div>
    );

  return (
    <div
      dir={language === "العربية" ? "rtl" : "ltr"}
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className={`p-3 rounded-full mb-4 ${
              isDarkMode ? "bg-blue-900/30" : "bg-blue-100"
            } shadow-sm`}
          >
            <ClipboardList className="h-8 w-8 text-blue-500" />
          </div>
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            } mb-2`}
          >
            {language === "العربية"
              ? "سجلات مراجعة الإعلانات"
              : "Ad Verification History"}
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {language === "العربية"
              ? "عرض جميع الإجراءات على الإعلانات"
              : "View all actions performed on ads"}
          </p>
        </div>

        {/* Table */}
        <div
          className={`rounded-lg shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  {[
                    language === "العربية" ? "رقم" : "No.",
                    language === "العربية" ? "الإعلان" : "Listing",
                    language === "العربية" ? "الحالة" : "Case",
                    language === "العربية" ? "المستخدم" : "User",
                    language === "العربية" ? "الدور" : "Role",
                    language === "العربية" ? "التاريخ" : "Date & Time",
                  ].map((header, idx) => (
                    <th
                      key={idx}
                      className={`px-6 py-3 text-${
                        language === "العربية" ? "right" : "left"
                      } text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400`}
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="h-10 w-10 mb-4 text-gray-400" />
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {language === "العربية"
                            ? "لا توجد سجلات"
                            : "No history found"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((item, index) => (
                    <tr
                      key={index}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white text-right">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => navigate(`/Listing/${item.listingId}`)}
                          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                          {language === "العربية"
                            ? "عرض الإعلان"
                            : "View Listing"}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {translateCaseName(item.caseName)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.firstName} {item.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {item.roleName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {new Date(item.dateAndTime).toLocaleString(
                          language === "العربية" ? "ar-AE" : "en-US"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

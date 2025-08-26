import React, { useEffect, useState } from "react";
import {
  getUnapprovedListings,
  approveListing,
  rejectListing,
} from "../Services/AdVerfications";
import { useAuth } from "../Context/TokenContext";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Eye, ClipboardList, Loader } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function UnapprovedListingsContainer() {
  const { userToken } = useAuth();
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      setError(null);
      try {
        const data = await getUnapprovedListings(userToken);
        setListings(data);
      } catch {
        setError(
          language === "العربية"
            ? "فشل في تحميل الإعلانات."
            : "Failed to load ads."
        );
      } finally {
        setLoading(false);
      }
    }

    if (userToken) fetchListings();
  }, [userToken, language]);

  // تأكد إنك مستخدم <ToastContainer /> في جذر المشروع بتاعك

  async function handleApprove(listingId) {
    if (
      !window.confirm(
        language === "العربية" ? "هل تريد قبول الإعلان؟" : "Approve this ad?"
      )
    )
      return;

    try {
      setProcessingId(listingId);
      await approveListing(listingId, userToken);
      setListings((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
    } catch (error) {
      console.log("Full error object:", error);

      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data || // احتياط لو الرسالة مش في .message
        error?.message ||
        "فشل قبول الإعلان.";

      console.log("Extracted message:", backendMessage);

      // حاول نفصل الرسالة لو فيها نقطة
      const parts = backendMessage.split(".");
      const userMessage = parts[parts.length - 1].trim();

      toast.error(userMessage || "فشل قبول الإعلان", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  }

  async function handleReject(listingId) {
    if (
      !window.confirm(
        language === "العربية" ? "هل تريد رفض الإعلان؟" : "Reject this ad?"
      )
    )
      return;

    try {
      setProcessingId(listingId);
      await rejectListing(listingId, userToken);
      setListings((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
    } catch {
      alert(
        language === "العربية" ? "فشل رفض الإعلان" : "Failed to reject the ad"
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col justify-center items-center ${
          isDarkMode ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Loader className="animate-spin h-10 w-10 mb-4 text-blue-500" />
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {language === "العربية" ? "جارٍ التحميل..." : "Loading..."}
        </p>
      </div>
    );
  }

  if (error) {
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
  }

  return (
    <div
      dir={language === "العربية" ? "rtl" : "ltr"}
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
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
            {language === "العربية" ? "مراجعة الإعلانات" : "Ad Verification"}
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {language === "العربية"
              ? "مراجعة واعتماد الإعلانات المقدمة"
              : "Review and approve submitted ad"}
          </p>
        </div>

        {/* Table Section */}
        <div
          className={`rounded-lg shadow-md overflow-hidden ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className={isDarkMode ? "bg-gray-700" : "bg-gray-100"}>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {language === "العربية" ? "رقم" : "No."}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {language === "العربية" ? "الإعلان" : "Listing"}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {language === "العربية" ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDarkMode
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {listings.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ClipboardList className="h-10 w-10 mb-4 text-gray-400" />
                        <p
                          className={`${
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {language === "العربية"
                            ? "لا توجد إعلانات لمراجعتها"
                            : "No ads to verify"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  listings.map((item, index) => (
                    <tr
                      key={item.listingId}
                      className={`${
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-3">
                          <button
                            disabled={processingId === item.listingId}
                            onClick={() => handleReject(item.listingId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                              processingId === item.listingId
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            } transition-colors`}
                          >
                            {processingId === item.listingId ? (
                              <Loader className="animate-spin h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                            {language === "العربية" ? "رفض" : "Reject"}
                          </button>
                          <button
                            disabled={processingId === item.listingId}
                            onClick={() => handleApprove(item.listingId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                              processingId === item.listingId
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            } transition-colors`}
                          >
                            {processingId === item.listingId ? (
                              <Loader className="animate-spin h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                            {language === "العربية" ? "قبول" : "Approve"}
                          </button>
                        </div>
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

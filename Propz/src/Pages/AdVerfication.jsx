import React, { useEffect, useState } from "react";
import {
  getUnapprovedListings,
  approveListing,
  rejectListing,
  requestListingEdit,
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
  const [processingIds, setProcessingIds] = useState([]); // array بدل processingId فردي
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentListingId, setCurrentListingId] = useState(null);
  const [editReason, setEditReason] = useState("");

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

  // 🔹 ارسال طلب تعديل
  async function handleRequestEdit() {
    if (!editReason.trim()) {
      toast.error(
        language === "العربية"
          ? "يرجى كتابة سبب التعديل"
          : "Please enter a reason"
      );
      return;
    }

    try {
      await requestListingEdit(
        currentListingId,
        editReason,
        userToken,
        language === "العربية" ? "ar" : "en"
      );
      toast.success(
        language === "العربية" ? "تم إرسال طلب التعديل" : "Edit request sent"
      );
      setListings((prev) =>
        prev.filter((item) => item.listingId !== currentListingId)
      );
    } catch {
      toast.error(
        language === "العربية"
          ? "فشل إرسال طلب التعديل"
          : "Failed to send edit request"
      );
    } finally {
      setShowEditModal(false);
      setEditReason("");
      setCurrentListingId(null);
    }
  }

  // 🔹 قبول إعلان
  async function handleApprove(listingId) {
    if (
      !window.confirm(
        language === "العربية" ? "هل تريد قبول الإعلان؟" : "Approve this ad?"
      )
    )
      return;

    setProcessingIds((prev) => [...prev, listingId]); // أضف إلى array المعالجة
    try {
      await approveListing(listingId, userToken);
      setListings((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
      toast.success(language === "العربية" ? "تم قبول الإعلان" : "Ad approved");
    } catch (error) {
      console.log("Error approving listing:", error);
      toast.error(
        language === "العربية" ? "فشل قبول الإعلان" : "Failed to approve ad"
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== listingId)); // إزالة من array المعالجة
    }
  }

  // 🔹 رفض إعلان
  async function handleReject(listingId) {
    if (
      !window.confirm(
        language === "العربية" ? "هل تريد رفض الإعلان؟" : "Reject this ad?"
      )
    )
      return;

    setProcessingIds((prev) => [...prev, listingId]);
    try {
      await rejectListing(listingId, userToken);
      setListings((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
      toast.success(language === "العربية" ? "تم رفض الإعلان" : "Ad rejected");
    } catch {
      toast.error(
        language === "العربية" ? "فشل رفض الإعلان" : "Failed to reject the ad"
      );
    } finally {
      setProcessingIds((prev) => prev.filter((id) => id !== listingId));
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
            {language === "العربية" ? "مراجعة الإعلانات" : "Ad Verification"}
          </h1>
          <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            {language === "العربية"
              ? "مراجعة واعتماد الإعلانات المقدمة"
              : "Review and approve submitted ad"}
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
                        <div className="flex gap-3 flex-wrap">
                          {/* Reject */}
                          <button
                            disabled={processingIds.includes(item.listingId)}
                            onClick={() => handleReject(item.listingId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                              processingIds.includes(item.listingId)
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            } transition-colors`}
                          >
                            {processingIds.includes(item.listingId) ? (
                              <Loader className="animate-spin h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                            {language === "العربية" ? "رفض" : "Reject"}
                          </button>

                          {/* Approve */}
                          <button
                            disabled={processingIds.includes(item.listingId)}
                            onClick={() => handleApprove(item.listingId)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                              processingIds.includes(item.listingId)
                                ? "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-green-600 hover:bg-green-700 text-white"
                            } transition-colors`}
                          >
                            {processingIds.includes(item.listingId) ? (
                              <Loader className="animate-spin h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                            {language === "العربية" ? "قبول" : "Approve"}
                          </button>

                          {/* Request Edit */}
                          <button
                            disabled={processingIds.includes(item.listingId)}
                            onClick={() => {
                              setCurrentListingId(item.listingId);
                              setShowEditModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white transition-colors"
                          >
                            ✏️
                            {language === "العربية" ? "تعديل" : "Edit"}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-md p-6 rounded-lg shadow-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">
              {language === "العربية" ? "سبب التعديل" : "Edit Reason"}
            </h2>
            <textarea
              value={editReason}
              onChange={(e) => setEditReason(e.target.value)}
              rows={4}
              className={`w-full p-3 border rounded-md ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-100 border-gray-300 text-black"
              }`}
              placeholder={
                language === "العربية"
                  ? "اكتب سبب التعديل هنا..."
                  : "Enter your edit reason..."
              }
            />

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditReason("");
                  setCurrentListingId(null);
                }}
                className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
              >
                {language === "العربية" ? "إلغاء" : "Cancel"}
              </button>
              <button
                onClick={handleRequestEdit}
                className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
              >
                {language === "العربية" ? "إرسال" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

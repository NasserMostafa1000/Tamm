import React, { useEffect, useState } from "react";
import {
  fetchReportReasons,
  submitListingReport,
} from "../Services/ListingReport";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext"; // ← أضفنا دعم الثيم
import LoadingSpinner from "../Loader/LoadingSpinner";
import { toast } from "react-toastify";

const ReportListing = ({ userId, listingId, onClose }) => {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const langCode = isArabic ? "ar" : "en";
    fetchReportReasons(langCode)
      .then((data) => setReasons(data))
      .catch(() =>
        toast.error(isArabic ? "فشل في جلب الأسباب" : "Failed to fetch reasons")
      );
  }, [isArabic]);

  const handleSubmit = async () => {
    if (!selectedReason) {
      toast.warn(isArabic ? "اختر سبب البلاغ" : "Please select a reason");
      return;
    }

    setIsLoading(true);
    try {
      await submitListingReport({
        userId,
        listingId,
        reasonId: selectedReason,
      });

      toast.success(isArabic ? "تم إرسال البلاغ" : "Report submitted");
      onClose(); // قفل المودال بعد البلاغ
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2
        className={`text-xl font-bold mb-4 text-center ${
          isDarkMode ? "text-gray-100" : "text-gray-800"
        }`}
      >
        {isArabic ? "الإبلاغ عن هذا الإعلان" : "Report this Ad"}
      </h2>

      {isLoading ? (
        <LoadingSpinner
          message={isArabic ? "جاري إرسال البلاغ..." : "Sending report..."}
        />
      ) : (
        <>
          <select
            value={selectedReason}
            onChange={(e) => setSelectedReason(e.target.value)}
            className={`w-full p-2 rounded-md border mb-4 ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-gray-100"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">
              {isArabic ? "اختر سبب البلاغ" : "Select a reason"}
            </option>
            {reasons.map((reason) => (
              <option key={reason.id} value={reason.id}>
                {reason.reasonName}
              </option>
            ))}
          </select>

          <button
            onClick={handleSubmit}
            className="w-full py-2 px-4 rounded-md bg-red-500 hover:bg-red-600 text-white font-semibold"
          >
            {isArabic ? "تقديم البلاغ" : "Submit Report"}
          </button>
        </>
      )}
    </div>
  );
};

export default ReportListing;

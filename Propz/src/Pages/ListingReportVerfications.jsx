import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/TokenContext";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";

import {
  fetchListingReports,
  approveReportAndDeleteListing,
  rejectReport,
} from "../Services/ListingReport";
import { ShieldAlert } from "lucide-react";

export default function ListingReportsContainer() {
  const { userToken } = useAuth();
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!userToken) return;

    async function loadReports() {
      setLoading(true);
      setError(null);
      try {
        const langParam = language === "العربية" ? "ar" : "en";
        const data = await fetchListingReports(userToken, langParam);
        setReports(data);
      } catch {
        setError(
          language === "العربية"
            ? "فشل في تحميل تقارير الإعلانات."
            : "Failed to load reports."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, [userToken, language]);

  async function handleApprove(adId, reportId) {
    if (
      !window.confirm(
        language === "العربية"
          ? "هل تريد قبول الإبلاغ وحذف الإعلان؟"
          : "Approve report and delete ad?"
      )
    )
      return;

    setProcessingId(adId);

    try {
      await approveReportAndDeleteListing(userToken, adId, reportId);
      setReports((prev) => prev.filter((r) => r.listingId !== adId));
    } catch {
      alert(
        language === "العربية"
          ? "فشل قبول الإبلاغ وحذف الإعلان."
          : "Failed to approve report and delete ad."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(reportId, adId) {
    if (
      !window.confirm(
        language === "العربية" ? "هل تريد رفض الإبلاغ؟" : "Reject this report?"
      )
    )
      return;

    setProcessingId(adId);

    try {
      await rejectReport(userToken, reportId);
      setReports((prev) => prev.filter((r) => r.listingId !== adId));
    } catch {
      alert(
        language === "العربية" ? "فشل رفض الإبلاغ." : "Failed to reject report."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex justify-center items-center ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}
      >
        {language === "العربية" ? "جارٍ التحميل..." : "Loading..."}
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex justify-center items-center text-red-600 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-100"
        }`}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      dir={language === "العربية" ? "rtl" : "ltr"}
      className={`p-6 min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="flex flex-col items-center mb-10">
        <div className="flex items-center gap-4 mb-6">
          <div
            className={`p-3 rounded-full ${
              isDarkMode ? "bg-red-900/30" : "bg-red-100"
            } shadow-md`}
          >
            <ShieldAlert className="h-8 w-8 text-red-500" />{" "}
            {/* الأيقونة الجديدة */}
          </div>
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            {language === "العربية" ? "تقارير الإعلانات" : "Listing Reports"}
          </h1>
        </div>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          } text-center max-w-2xl mx-auto`}
        >
          {language === "العربية"
            ? "مراجعة البلاغات المقدمة على الإعلانات والتحقق منها"
            : "Review and verify reports submitted for ad"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table
          className={`min-w-full border-collapse border rounded-lg overflow-hidden ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}
        >
          <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <tr>
              <th className="px-6 py-3 border">#</th>
              <th className="px-6 py-3 border text-left">
                {language === "العربية" ? "الإعلان" : "Listing"}
              </th>
              <th className="px-6 py-3 border text-left">
                {language === "العربية" ? "سبب الإبلاغ" : "Report Reason"}
              </th>
              <th className="px-6 py-3 border text-center">
                {language === "العربية" ? "رفض" : "Reject"}
              </th>
              <th className="px-6 py-3 border text-center">
                {language === "العربية" ? "قبول" : "Approve"}
              </th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  {language === "العربية"
                    ? "لا توجد تقارير للإعلانات"
                    : "No ad reports."}
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <tr
                  key={report.listingId}
                  className={
                    isDarkMode
                      ? "even:bg-gray-800 odd:bg-gray-700"
                      : "even:bg-gray odd:bg-gray-50"
                  }
                >
                  <td className="px-6 py-4 border text-center">{index + 1}</td>

                  <td
                    className="px-6 py-4 border max-w-xs cursor-pointer text-blue-600 hover:underline"
                    onClick={() => navigate(`/Listing/${report.listingId}`)}
                  >
                    {language === "العربية" ? "عرض الإعلان" : "View ad"}
                  </td>

                  <td className="px-6 py-4 border">{report.reasonText}</td>

                  <td className="px-6 py-4 border text-center">
                    <button
                      disabled={processingId === report.listingId}
                      onClick={() =>
                        handleReject(report.reportId, report.listingId)
                      }
                      className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded"
                    >
                      {processingId === report.listingId
                        ? language === "العربية"
                          ? "جاري الرفض..."
                          : "Rejecting..."
                        : language === "العربية"
                        ? "رفض"
                        : "Reject"}
                    </button>
                  </td>

                  <td className="px-6 py-4 border text-center">
                    <button
                      disabled={processingId === report.listingId}
                      onClick={() =>
                        handleApprove(report.listingId, report.reportId)
                      }
                      className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded"
                    >
                      {processingId === report.listingId
                        ? language === "العربية"
                          ? "جاري القبول..."
                          : "Approving..."
                        : language === "العربية"
                        ? "قبول"
                        : "Approve"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

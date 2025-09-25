import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/TokenContext";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Flag,
  Loader2,
} from "lucide-react";
import {
  fetchListingReports,
  approveReportAndDeleteListing,
  rejectReport,
} from "../Services/ListingReport";

export default function ListingReportsContainer() {
  const { userToken } = useAuth();
  const { language } = useLanguage();
  const { theme } = useTheme();
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
        className={`min-h-screen flex flex-col justify-center items-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <Loader2 className="animate-spin h-12 w-12 mb-4 text-blue-500" />
        <p
          className={`text-lg font-medium ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {language === "العربية"
            ? "جارٍ تحميل التقارير..."
            : "Loading reports..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        dir={language === "العربية" ? "rtl" : "ltr"}
        className={`min-h-screen flex flex-col justify-center items-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <AlertCircle className="h-12 w-12 mb-4 text-red-500" />
        <p
          className={`text-lg font-medium ${
            theme === "dark" ? "text-red-400" : "text-red-600"
          }`}
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
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div
            className={`p-4 rounded-full mb-4 ${
              theme === "dark" ? "bg-red-900/30" : "bg-red-100"
            } shadow-md`}
          >
            <Flag className="h-10 w-10 text-red-500" />
          </div>
          <h1
            className={`text-3xl font-bold text-center ${
              theme === "dark" ? "text-white" : "text-gray-800"
            } mb-2`}
          >
            {language === "العربية" ? "تقارير الإعلانات" : "Listing Reports"}
          </h1>
          <p
            className={`text-lg ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            } text-center`}
          >
            {language === "العربية"
              ? "مراجعة البلاغات المقدمة على الإعلانات"
              : "Review reports submitted for ads"}
          </p>
        </div>

        {/* Table Section */}
        <div
          className={`rounded-2xl shadow-lg overflow-hidden ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          } border`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead
                className={theme === "dark" ? "bg-gray-700" : "bg-gray-100"}
              >
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === "العربية" ? "رقم" : "No."}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === "العربية" ? "الإعلان" : "Listing"}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === "العربية" ? "سبب الإبلاغ" : "Report Reason"}
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
                    {language === "العربية" ? "الإجراءات" : "Actions"}
                  </th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  theme === "dark"
                    ? "divide-gray-700 bg-gray-800"
                    : "divide-gray-200 bg-white"
                }`}
              >
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Flag className="h-14 w-14 mb-4 text-gray-400" />
                        <p
                          className={`text-lg ${
                            theme === "dark" ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          {language === "العربية"
                            ? "لا توجد تقارير تحتاج مراجعة"
                            : "No reports require review"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  reports.map((report, index) => (
                    <tr
                      key={report.listingId}
                      className={`${
                        theme === "dark"
                          ? "hover:bg-gray-700/80"
                          : "hover:bg-gray-50"
                      } transition-colors duration-150`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`text-lg font-medium ${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`/Listing/${report.listingId}`)
                          }
                          className={`flex items-center gap-3 group ${
                            theme === "dark" ? "text-blue-400" : "text-blue-600"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg ${
                              theme === "dark"
                                ? "bg-blue-900/30 group-hover:bg-blue-900/50"
                                : "bg-blue-100 group-hover:bg-blue-200"
                            } transition-colors`}
                          >
                            <Eye className="h-5 w-5" />
                          </div>
                          <span className="font-medium group-hover:underline">
                            {language === "العربية"
                              ? "عرض تفاصيل الإعلان"
                              : "View Listing Details"}
                          </span>
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p
                          className={`${
                            theme === "dark" ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {report.reasonText}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-4">
                          <button
                            disabled={processingId === report.listingId}
                            onClick={() =>
                              handleReject(report.reportId, report.listingId)
                            }
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium ${
                              processingId === report.listingId
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg transition-all"
                            }`}
                          >
                            {processingId === report.listingId ? (
                              <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                              <XCircle className="h-5 w-5" />
                            )}
                            {language === "العربية" ? "رفض" : "Reject"}
                          </button>
                          <button
                            disabled={processingId === report.listingId}
                            onClick={() =>
                              handleApprove(report.listingId, report.reportId)
                            }
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium ${
                              processingId === report.listingId
                                ? "bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                                : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transition-all"
                            }`}
                          >
                            {processingId === report.listingId ? (
                              <Loader2 className="animate-spin h-5 w-5" />
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

import React, { useEffect, useState } from "react";
import {
  blockPerson,
  fetchClientsPaged,
  getAllClients,
  sendNotification,
} from "../Services/Clients";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Mail,
  Shield,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function ClientsTable() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingClients, setLoadingClients] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [provider, setProvider] = useState("tamm");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [receiver, setReceiver] = useState("");
  const [isAll, setIsAll] = useState(false);
  const [blocking, setBlocking] = useState(null);
  const [sending, setSending] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [sentCount, setSentCount] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleBlock = async (personId) => {
    if (
      !window.confirm(
        language === "العربية"
          ? "هل أنت متأكد من حظر هذا المستخدم؟"
          : "Are you sure you want to block this user?"
      )
    )
      return;

    setBlocking(personId);
    const token = localStorage.getItem("userToken");
    try {
      const result = await blockPerson(personId, token);
      alert(result);
    } catch (error) {
      alert(
        language === "العربية"
          ? "فشل في تنفيذ الحظر: "
          : "Failed to block: " + error.message
      );
    } finally {
      setBlocking(null);
    }
  };

  const handleListingClick = (userId) => {
    navigate("/MyAds", { state: { userId } });
  };

  useEffect(() => {
    async function load() {
      setLoadingClients(true);
      try {
        const token = localStorage.getItem("userToken");
        const data = await fetchClientsPaged(pageNumber, pageSize, token);
        setClients(data.clients);
        setFiltered(data.clients);
        setTotalCount(data.totalCount);
      } catch (error) {
        console.log(error);
      }
      setLoadingClients(false);
    }
    load();
  }, [pageNumber]);

  useEffect(() => {
    const lower = searchTerm.toLowerCase();
    setFiltered(
      clients.filter((c) => c.fullName.toLowerCase().includes(lower))
    );
  }, [searchTerm, clients]);

  async function handleSend() {
    if (!subject.trim() || !body.trim()) {
      alert(
        language === "العربية"
          ? "رجاءً املأ الحقول أولاً."
          : "Please fill fields first."
      );
      return;
    }
    const token = localStorage.getItem("userToken");
    setSending(true);
    setSentCount(0);

    try {
      let list = [];
      if (isAll) {
        list = await getAllClients(token);
      } else {
        const rec = clients.find((c) => c.personId.toString() === receiver);
        if (!rec)
          throw new Error(
            language === "العربية" ? "العميل غير موجود" : "Client not found"
          );
        list = [rec];
      }

      for (let i = 0; i < list.length; i++) {
        const c = list[i];
        const target = provider === "gmail" ? c.email : c.personId.toString();
        setProgressText(
          language === "العربية"
            ? `إرسال ${i + 1} من ${list.length}`
            : `Sending ${i + 1} of ${list.length}`
        );
        await sendNotification({
          emailOrUserId: target,
          subject,
          body,
          provider,
        });
        setSentCount((count) => count + 1);
      }
      setProgressText(language === "العربية" ? "تم!" : "Done!");
    } catch (err) {
      alert(err.message);
    } finally {
      setTimeout(() => setSending(false), 1000);
    }
  }

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      } p-6`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`p-3 rounded-xl ${
              theme === "dark" ? "bg-blue-800" : "bg-blue-100"
            } text-blue-600`}
          >
            <Users size={28} />
          </div>
          <div>
            <h1
              className={`text-3xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {language === "العربية" ? "إدارة العملاء" : "Clients Management"}
            </h1>
            <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>
              {language === "العربية"
                ? "عرض وإدارة جميع العملاء المسجلين"
                : "View and manage all registered clients"}
            </p>
          </div>
        </div>

        {/* Action Bar */}
        <div
          className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 p-4 rounded-xl ${
            theme === "dark" ? "bg-gray-800" : "bg-white"
          } shadow-md`}
        >
          <button
            onClick={() => {
              setIsAll(true);
              setReceiver("");
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all shadow-md"
          >
            <Mail size={18} />
            {language === "العربية" ? "إرسال للجميع" : "Send to All"}
          </button>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder={
                language === "العربية"
                  ? "ابحث باسم العميل..."
                  : "Search by name..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-blue-400"
              } 
                focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500/30 transition-all`}
            />
          </div>
        </div>

        {/* Loading State */}
        {loadingClients ? (
          <div
            className={`flex justify-center items-center h-64 rounded-xl ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } shadow-md`}
          >
            <LoadingSpinner
              label={
                language === "العربية"
                  ? "جاري تحميل العملاء..."
                  : "Loading clients..."
              }
            />
          </div>
        ) : (
          <>
            {/* Table */}
            <div
              className={`overflow-hidden rounded-xl shadow-md border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead
                  className={theme === "dark" ? "bg-gray-800" : "bg-gray-100"}
                >
                  <tr>
                    {[
                      language === "العربية" ? "المعرف" : "ID",
                      language === "العربية" ? "الاسم الكامل" : "Full Name",
                      language === "العربية" ? "الجنسية" : "Nationality",
                      language === "العربية" ? "تاريخ الميلاد" : "DOB",
                      language === "العربية" ? "الهاتف" : "Phone",
                      language === "العربية" ? "البريد الإلكتروني" : "Email",
                      language === "العربية" ? "عدد الإعلانات" : "Listings",
                      language === "العربية" ? "طريقة التسجيل" : "Provider",
                      language === "العربية" ? "إجراءات" : "Actions",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    theme === "dark"
                      ? "divide-gray-700 bg-gray-900"
                      : "divide-gray-200 bg-white"
                  }`}
                >
                  {filtered.map((c) => (
                    <tr
                      key={c.personId}
                      className={`${
                        theme === "dark"
                          ? "hover:bg-gray-800"
                          : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-mono ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.personId}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {c.fullName}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.nationality || "—"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {formatDate(c.dateOfBirth)}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.phoneNumber || "—"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.email || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleListingClick(c.userId)}
                          className={`font-medium ${
                            theme === "dark"
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-500"
                          } transition-colors`}
                        >
                          {c.listingCount || 0}
                        </button>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {c.loginProvider || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setReceiver(c.personId.toString());
                              setIsAll(false);
                              setShowForm(true);
                            }}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                              theme === "dark"
                                ? "bg-blue-700 text-white hover:bg-blue-600"
                                : "bg-blue-600 text-white hover:bg-blue-500"
                            } transition-colors`}
                          >
                            <Mail size={16} />
                            {language === "العربية" ? "رسالة" : "Message"}
                          </button>
                          <button
                            onClick={() => handleBlock(c.personId)}
                            disabled={blocking === c.personId}
                            className={`flex items-center gap-1 px-3 py-1 rounded-md ${
                              blocking === c.personId
                                ? theme === "dark"
                                  ? "bg-gray-700 text-gray-400"
                                  : "bg-gray-300 text-gray-600"
                                : theme === "dark"
                                ? "bg-red-700 text-white hover:bg-red-600"
                                : "bg-red-600 text-white hover:bg-red-500"
                            } transition-colors`}
                          >
                            <Shield size={16} />
                            {blocking === c.personId
                              ? language === "العربية"
                                ? "جارٍ الحظر..."
                                : "Blocking..."
                              : language === "العربية"
                              ? "حظر"
                              : "Block"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className={`mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } shadow-md`}
            >
              <div
                className={`text-sm ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {language === "العربية"
                  ? `عرض ${filtered.length} من ${totalCount} عميل`
                  : `Showing ${filtered.length} of ${totalCount} clients`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={pageNumber === 1}
                  onClick={() => setPageNumber((p) => p - 1)}
                  className={`p-2 rounded-lg ${
                    pageNumber === 1
                      ? (theme === "dark" ? "text-gray-600" : "text-gray-400") +
                        " cursor-not-allowed"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <ChevronLeft size={20} />
                </button>
                <span
                  className={`px-4 py-2 rounded-lg ${
                    theme === "dark"
                      ? "bg-gray-700 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {pageNumber}
                </span>
                <button
                  disabled={pageNumber * pageSize >= totalCount}
                  onClick={() => setPageNumber((p) => p + 1)}
                  className={`p-2 rounded-lg ${
                    pageNumber * pageSize >= totalCount
                      ? (theme === "dark" ? "text-gray-600" : "text-gray-400") +
                        " cursor-not-allowed"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  } transition-colors`}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* Message Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div
              className={`rounded-lg shadow-xl w-full max-w-md ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-6">
                <h3
                  className={`text-lg font-bold mb-4 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {isAll
                    ? language === "العربية"
                      ? "إرسال رسائل للجميع"
                      : "Send to all"
                    : language === "العربية"
                    ? "إرسال رسالة لعميل"
                    : "Send to client"}
                </h3>

                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {language === "العربية" ? "طريقة الإرسال" : "Provider"}
                  </label>
                  <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                  >
                    <option value="tamm">Tamm</option>
                    <option value="gmail">Gmail</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {language === "العربية" ? "الموضوع" : "Subject"}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                    placeholder={
                      language === "العربية"
                        ? "أدخل موضوع الرسالة..."
                        : "Enter message subject..."
                    }
                  />
                </div>
                <div className="mb-6">
                  <label
                    className={`block mb-2 text-sm font-medium ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {language === "العربية" ? "المحتوى" : "Body"}
                  </label>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={4}
                    className={`w-full p-2 border rounded-md ${
                      theme === "dark"
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                    } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none`}
                    placeholder={
                      language === "العربية"
                        ? "أدخل محتوى الرسالة..."
                        : "Enter message content..."
                    }
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className={`px-4 py-2 border rounded-md ${
                      theme === "dark"
                        ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    {language === "العربية" ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    onClick={handleSend}
                    className={`px-4 py-2 rounded-md ${
                      theme === "dark"
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } transition-colors`}
                    disabled={sending}
                  >
                    {sending
                      ? language === "العربية"
                        ? "جاري الإرسال..."
                        : "Sending..."
                      : language === "العربية"
                      ? "إرسال"
                      : "Send"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sending Progress Modal */}
        {sending && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-6 rounded-lg shadow-xl ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <LoadingSpinner label={`${progressText} (${sentCount})`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

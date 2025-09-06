import { useState } from "react";
import { resetPassword } from "../Services/Login-Register";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import { useLanguage } from "../Context/LangContext";

export default function ResetPasswordForm() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notificationProvider, setNotificationProvider] = useState("gmail");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    // تحديد الـ notifierId تلقائي
    let notifierId = notificationProvider === "gmail" ? email : phone;

    const result = await resetPassword({
      email,
      notifierId,
      language,
      notificationProvider,
    });

    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          {isArabic ? "إعادة تعيين كلمة المرور" : "Reset Password"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {notificationProvider === "gmail" ? (
            <input
              type="email"
              placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          ) : (
            <input
              type="tel"
              placeholder={isArabic ? "رقم الهاتف" : "Phone Number"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          )}

          <select
            value={notificationProvider}
            onChange={(e) => setNotificationProvider(e.target.value)}
            disabled={loading} // ممنوع التغيير أثناء الإرسال
            className="w-full px-4 py-2 border rounded-lg text-gray-900 dark:text-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="Gmail">Gmail</option>
            <option value="Sms">SMS</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50"
          >
            {loading
              ? isArabic
                ? "جاري الإرسال..."
                : "Sending..."
              : isArabic
              ? "إعادة التعيين"
              : "Reset"}
          </button>
        </form>

        {response && (
          <div
            className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              response.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {response.success ? (
              <FaCheckCircle className="text-green-600" />
            ) : (
              <FaExclamationCircle className="text-red-600" />
            )}
            <span>{response.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

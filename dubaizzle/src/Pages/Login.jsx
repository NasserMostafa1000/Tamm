import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AppleButton from "../Buttons/AppleButton.jsx";
import TammLogo from "../Layouts/TammLogo.jsx";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import {
  FaSun,
  FaMoon,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaUser,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";
import { useAuth } from "../Context/TokenContext.jsx";
import { manualLogin } from "../Services/Login-Register.js";
import { API_BASE_URL } from "../Utils/Constant.js";

export default function Login() {
  const { language } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserToken } = useAuth();
  const isArabic = language === "العربية";
  const langCode = isArabic ? "ar" : "en";
  const heading = isArabic ? "تسجيل دخول" : "Login";
  const { state } = location;
  const { fromButton, GoTo } = state || {};
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToPrivacy, setAgreeToPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleManualLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError(
        isArabic
          ? "يرجى إدخال البريد وكلمة المرور."
          : "Please enter email and password."
      );
      return;
    }

    if (!agreeToPrivacy) {
      setError(
        isArabic
          ? "يجب الموافقة على شروط الخصوصية"
          : "You must agree to the privacy policy."
      );
      return;
    }

    setIsLoading(true);

    try {
      const token = await manualLogin({ email, password, lang: langCode });
      setUserToken(token);
      localStorage.setItem("userToken", token);
      navigate(GoTo || "/");
    } catch (err) {
      setError(
        err.message?.toLowerCase().includes("blocked")
          ? isArabic
            ? "تم حظر حسابك. يرجى التواصل مع الإدارة."
            : "Your account has been blocked. Please contact support."
          : err.message || (isArabic ? "فشل تسجيل الدخول" : "Login failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordClick = () => {
    navigate("/reset-password");
  };

  const handleGoogleSuccess = async (response) => {
    setError(null);
    setIsLoading(true);

    try {
      const decoded = jwtDecode(response.credential);

      const userData = {
        Lang: langCode,
        FirstName: decoded.given_name || "",
        LastName: decoded.family_name || "UAE",
        Email: decoded.email,
        ImageUrl: decoded.picture || null,
        Nationality: null,
        DateOfBirth: null,
        Gender: null,
        HashedPassword: null,
        LoginProviderName: "Google Dubaizzle",
        RoleId: 2,
      };

      const apiResponse = await fetch(`${API_BASE_URL}Clients/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await apiResponse.json();

      if (!apiResponse.ok || !result.token) {
        throw new Error(result.message || "Google login failed");
      }

      setUserToken(result.token);
      localStorage.setItem("userToken", result.token);
      navigate(GoTo || "/");
    } catch (err) {
      setError(
        err.message?.toLowerCase().includes("blocked")
          ? isArabic
            ? "تم حظر حسابك. يرجى التواصل مع الإدارة."
            : "Your account has been blocked. Please contact support."
          : err.message || (isArabic ? "فشل تسجيل الدخول" : "Login failed")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        mode === "dark"
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800"
      } ${isArabic ? "rtl" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* زر تبديل الوضع */}
      <button
        onClick={toggleMode}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all duration-300 ${
          mode === "dark"
            ? "bg-yellow-500 text-gray-900 hover:bg-yellow-600"
            : "bg-gray-800 text-white hover:bg-gray-700"
        } shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-opacity-50`}
      >
        {mode === "dark" ? <FaSun size={20} /> : <FaMoon size={20} />}
      </button>

      {/* بطاقة تسجيل الدخول */}
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          mode === "dark" ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* الهيدر */}
        <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-center mb-4">
            <TammLogo MaxWidth={280} />
          </div>
          <h1 className="text-2xl font-bold text-yellow-500">{heading}</h1>

          {fromButton && (
            <p
              className={`mt-2 text-sm ${
                mode === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {isArabic
                ? `يرجى تسجيل الدخول للمتابعة إلى "${fromButton}"`
                : `Please login to continue to "${fromButton}"`}
            </p>
          )}
        </div>

        {/* محتوى البطاقة */}
        <div className="p-6">
          {error && (
            <div
              className={`mb-4 p-3 rounded-lg text-center ${
                mode === "dark"
                  ? "bg-red-900 text-red-200"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {error}
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          <div className="space-y-4">
            {/* حقل البريد الإلكتروني */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope
                  className={`${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-black placeholder-gray-500"
                }`}
              />
            </div>

            {/* حقل كلمة المرور */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock
                  className={`${
                    mode === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isArabic ? "كلمة المرور" : "Password"}
                className={`w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-black placeholder-gray-500"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <FaEyeSlash
                    className={`${
                      mode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                ) : (
                  <FaEye
                    className={`${
                      mode === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  />
                )}
              </button>
            </div>

            {/* رابط نسيان كلمة المرور */}
            <div className="flex justify-end">
              <button
                onClick={handleForgotPasswordClick}
                className={`text-sm font-medium transition-colors duration-200 ${
                  mode === "dark"
                    ? "text-blue-400 hover:text-blue-300"
                    : "text-blue-600 hover:text-blue-800"
                }`}
              >
                {isArabic ? "هل نسيت كلمة السر؟" : "Forgot Password?"}
              </button>
            </div>

            {/* اتفاقية الخصوصية */}
            <div className="flex items-start gap-3">
              <input
                id="privacy"
                type="checkbox"
                checked={agreeToPrivacy}
                onChange={() => setAgreeToPrivacy(!agreeToPrivacy)}
                className={`mt-1 rounded focus:ring-yellow-500 ${
                  mode === "dark"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
              <label htmlFor="privacy" className="text-sm">
                {isArabic ? (
                  <>
                    أوافق على{" "}
                    <Link
                      to="/PrivacyAndTerms"
                      className={`font-medium underline transition-colors ${
                        mode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      الشروط والخصوصية
                    </Link>
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <Link
                      to="/PrivacyAndTerms"
                      className={`font-medium underline transition-colors ${
                        mode === "dark"
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-blue-600 hover:text-blue-800"
                      }`}
                    >
                      privacy policy
                    </Link>
                  </>
                )}
              </label>
            </div>

            {/* زر تسجيل الدخول */}
            <button
              onClick={handleManualLogin}
              disabled={isLoading || !agreeToPrivacy}
              className={`w-full py-3 font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                mode === "dark"
                  ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              } ${
                isLoading || !agreeToPrivacy
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <FaUser />
              )}
              {isLoading
                ? isArabic
                  ? "جاري التسجيل..."
                  : "Logging in..."
                : isArabic
                ? "تسجيل الدخول"
                : "Login"}
            </button>
          </div>

          {/* فاصل */}
          <div className="my-6 flex items-center">
            <div
              className={`flex-1 border-t ${
                mode === "dark" ? "border-gray-600" : "border-gray-300"
              }`}
            ></div>
            <span
              className={`px-3 text-sm ${
                mode === "dark" ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {isArabic ? "أو" : "OR"}
            </span>
            <div
              className={`flex-1 border-t ${
                mode === "dark" ? "border-gray-600" : "border-gray-300"
              }`}
            ></div>
          </div>

          {/* تسجيل الدخول باستخدام Google */}
          <div
            className={`p-4 rounded-xl mb-4 transition-all duration-300 ${
              mode === "dark"
                ? "bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900"
                : "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            }`}
          >
            <h2 className="text-white text-center font-semibold mb-3 flex items-center justify-center gap-2">
              <FaGoogle />
              {isArabic ? "سجل دخولك باستخدام Google" : "Sign in with Google"}
            </h2>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() =>
                  setError(
                    isArabic
                      ? "فشل تسجيل الدخول بجوجل."
                      : "Google login failed."
                  )
                }
                width="100%"
                theme={mode === "dark" ? "filled_blue" : "outline"}
                size="large"
                text="signin_with"
                shape="pill"
              />
            </div>

            <p className="text-white text-xs mt-3 text-center opacity-90">
              {isArabic
                ? "سجّل الدخول بسرعة وسهولة باستخدام حساب جوجل الخاص بك"
                : "Quickly and easily sign in using your Google account"}
            </p>
          </div>

          {/* رابط إنشاء حساب جديد */}
          <div className="text-center mt-6">
            <button
              onClick={() => navigate("/Register")}
              className={`font-medium transition-colors duration-200 ${
                mode === "dark"
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              {isArabic ? "إنشاء حساب الآن" : "Create account now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

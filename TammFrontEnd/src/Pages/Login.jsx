import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import AppleButton from "../Buttons/AppleButton.jsx";
import TammLogo from "../Layouts/TammLogo.jsx";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
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
        LoginProviderName: "Google",
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

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-4 ${isArabic ? "rtl" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <button
        onClick={toggleMode}
        className="absolute top-4 right-4 text-2xl focus:outline-none"
      >
        {mode === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      <TammLogo MaxWidth={320} />
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">{heading}</h1>

      {fromButton && (
        <p className="mb-4 text-center text-red-600">
          {isArabic
            ? `يرجى تسجيل الدخول للمتابعة إلى "${fromButton}"`
            : `Please login to continue to "${fromButton}"`}
        </p>
      )}

      {error && <p className="mb-4 text-center text-red-600">{error}</p>}

      <div className="mb-4 w-full max-w-xs space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
          className={getInputClass(mode)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isArabic ? "كلمة المرور" : "Password"}
          className={getInputClass(mode)}
        />

        <div className="flex items-center gap-2">
          <input
            id="privacy"
            type="checkbox"
            checked={agreeToPrivacy}
            onChange={() => setAgreeToPrivacy(!agreeToPrivacy)}
          />
          <label htmlFor="privacy" className="text-sm">
            {isArabic
              ? "أوافق على شروط الخصوصية"
              : "I agree to the privacy policy"}
          </label>
        </div>

        <button
          onClick={handleManualLogin}
          disabled={isLoading || !agreeToPrivacy}
          className={`w-full py-2 font-bold rounded-md ${
            mode === "dark"
              ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } transition-all disabled:opacity-50`}
        >
          {isArabic ? "تسجيل الدخول" : "Login"}
        </button>
      </div>

      <div className="my-4 w-full max-w-xs">
        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() =>
              setError(
                isArabic ? "فشل تسجيل الدخول بجوجل." : "Google login failed."
              )
            }
            width="100%"
          />
        </div>
      </div>

      <AppleButton />

      <a
        onClick={() => navigate("/Register")}
        className="text-sm text-blue-500 hover:underline mt-2 cursor-pointer"
      >
        {isArabic ? "إنشاء حساب الآن" : "Create account now"}
      </a>
    </div>
  );
}

function getInputClass(mode) {
  return `w-full px-4 py-2 rounded-md border ${
    mode === "dark"
      ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
      : "bg-white border-gray-300 text-black placeholder-gray-500"
  }`;
}

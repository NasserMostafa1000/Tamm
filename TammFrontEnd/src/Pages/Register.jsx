import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";
import TammLogo from "../Layouts/TammLogo";
import { registerClient } from "../Services/Login-Register";
import LoadingSpinner from "../Loader/LoadingSpinner"; // ✅ استدعاء السبينر
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const { language } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const isArabic = language === "العربية";
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("male");

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // ✅ حالة التحميل

  const handleRegister = async () => {
    setError(null); // ✅ مسح الخطأ السابق عند كل محاولة تسجيل
    setIsLoading(true); // ✅ تشغيل السبينر

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setIsLoading(false);
      setError(isArabic ? "يرجى تعبئة جميع الحقول" : "Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setIsLoading(false);
      setError(
        isArabic ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }

    const dto = {
      lang: isArabic ? "ar" : "en",
      firstName,
      lastName,
      email,
      nationality: null,
      dateOfBirth: null,
      hashedPassword: password,
      gender: gender === "male" ? 1 : gender === "female" ? 2 : 3,
      loginProviderName: "Tamm",
      roleId: 2,
    };

    try {
      const result = await registerClient(dto);
      localStorage.setItem("userToken", result.token);
      toast.success(
        isArabic
          ? "تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول."
          : "Account created successfully! Please login.",
        { position: "top-center" }
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (err) {
      setError(
        err?.message || (isArabic ? "فشل إنشاء الحساب" : "Registration failed")
      );
    } finally {
      setIsLoading(false); // ✅ إيقاف السبينر سواء في نجاح أو خطأ
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 relative ${
        mode === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } ${isArabic ? "rtl" : "ltr"}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <button
        onClick={toggleMode}
        className="absolute top-4 right-4 text-2xl focus:outline-none"
      >
        {mode === "dark" ? <FaSun /> : <FaMoon />}
      </button>

      {isLoading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50">
          <LoadingSpinner
            label={
              isArabic ? "يتم الآن تسجيل الحساب..." : "Registering account..."
            }
          />
        </div>
      )}

      <TammLogo MaxWidth={320} />
      <h1 className="text-3xl font-bold mb-6 text-yellow-500">
        {isArabic ? "إنشاء حساب" : "Create Account"}
      </h1>

      {error && (
        <p className="mb-4 text-red-600 font-semibold text-center">{error}</p>
      )}

      <div className="w-full max-w-md space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder={isArabic ? "الاسم الأول" : "First Name"}
            className={`w-full px-4 py-2 rounded-md border ${
              mode === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-black placeholder-gray-500"
            }`}
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder={isArabic ? "الاسم الأخير" : "Last Name"}
            className={`w-full px-4 py-2 rounded-md border ${
              mode === "dark"
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-black placeholder-gray-500"
            }`}
          />
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isArabic ? "البريد الإلكتروني" : "Email"}
          className={`w-full px-4 py-2 rounded-md border ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black placeholder-gray-500"
          }`}
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isArabic ? "كلمة المرور" : "Password"}
          className={`w-full px-4 py-2 rounded-md border ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black placeholder-gray-500"
          }`}
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder={isArabic ? "تأكيد كلمة المرور" : "Confirm Password"}
          className={`w-full px-4 py-2 rounded-md border ${
            mode === "dark"
              ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-black placeholder-gray-500"
          }`}
        />

        <div>
          <label className="block mb-2 font-medium">
            {isArabic ? "النوع" : "Gender"}
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className={`w-full px-4 py-2 rounded-md border ${
              mode === "dark"
                ? "bg-gray-800 border-gray-700 text-white"
                : "bg-white border-gray-300 text-black"
            }`}
          >
            <option value="male">{isArabic ? "ذكر" : "Male"}</option>
            <option value="female">{isArabic ? "أنثى" : "Female"}</option>
            <option value="other">{isArabic ? "أخرى" : "Other"}</option>
          </select>
        </div>

        <button
          onClick={handleRegister}
          disabled={isLoading}
          className={`w-full py-2 font-bold rounded-md ${
            mode === "dark"
              ? "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              : "bg-yellow-500 hover:bg-yellow-600 text-white"
          } transition-all disabled:opacity-50`}
        >
          {isArabic ? "إنشاء الحساب" : "Register"}
        </button>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import {
  FaUser,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
  FaLock,
  FaCalendarAlt,
  FaFlag,
  FaSearch,
  FaChevronDown,
  FaEdit,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { FiUser, FiPhone, FiFlag, FiLock, FiCalendar } from "react-icons/fi";
import { FlagIcon } from "react-flag-kit";
import {
  compressAndUploadImage,
  fetchCountries,
  updateUserProfile,
} from "../Services/Profile";
import fetchUserDetails from "../Services/Profile";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import { ar, enUS } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default function UserProfile() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isArabic = language === "العربية";
  const locale = isArabic ? ar : enUS;
  const [userData, setUserData] = useState(null);
  const [countries, setCountries] = useState([]);
  const [searchCountry, setSearchCountry] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [isNewPassword, setIsNewPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const data = await fetchUserDetails(token);
        setUserData(data);
        setSearchCountry(data.nationality || "");
        setPasswordInput("");
        setIsNewPassword(!data.hashedPassword);
      } catch {
        setError(
          isArabic
            ? "حدث خطأ في جلب بيانات المستخدم"
            : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isArabic]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (err) {
        console.error("Error fetching countries:", err);
      }
    };

    loadCountries();
  }, []);

  const handleChange = (field, value) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const nationalityCountry = countries.find(
    (c) =>
      c.countryName === userData?.nationality ||
      Number(userData?.nationality) === c.countryId
  );
  const nationalityCode = nationalityCountry?.countryCode?.toUpperCase();

  const filteredCountries = countries.filter((c) =>
    `${c.countryName} ${c.countryCode}`
      .toLowerCase()
      .includes(searchCountry.toLowerCase())
  );

  const selectedDate = userData?.dateOfBirth
    ? moment(userData.dateOfBirth).tz("Asia/Dubai").toDate()
    : null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        userId: userData.userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        clientPhone: userData.clientPhone,
        nationalityId: nationalityCountry ? nationalityCountry.countryId : null,
        dateOfBirth: userData.dateOfBirth,
        genderId: userData.gender,
        ...(passwordInput ? { hashedPassword: passwordInput } : {}),
      };

      await updateUserProfile(payload);
      alert(
        isArabic ? "تم تحديث البيانات بنجاح" : "Profile updated successfully"
      );
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(
        isArabic
          ? "حدث خطأ أثناء التحديث"
          : "An error occurred while updating profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-4 rounded-lg ${
          isDark ? "bg-red-900/30" : "bg-red-100"
        } text-red-600 text-center`}
      >
        {error}
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-8">
        {isArabic ? "لا توجد بيانات" : "No data available"}
      </div>
    );
  }

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`max-w-2xl mx-auto p-6 rounded-2xl shadow-lg font-sans ${
        isDark
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-800 border border-gray-200"
      }`}
    >
      {/* Header with edit button */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
            <FiUser className="text-yellow-500 text-xl" />
          </div>
          <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
            {isArabic ? "الملف الشخصي" : "Profile"}
          </span>
        </h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            isEditing
              ? "bg-red-500 hover:bg-red-600 text-white"
              : isDark
              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
              : "bg-yellow-400 hover:bg-yellow-500 text-black"
          } shadow-md hover:shadow-lg`}
        >
          {isEditing ? (
            <>
              <FaTimes /> {isArabic ? "إلغاء" : "Cancel"}
            </>
          ) : (
            <>
              <FaEdit /> {isArabic ? "تعديل" : "Edit"}
            </>
          )}
        </button>
      </div>

      {/* Profile picture section */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative group">
          {userData.imageUrl ? (
            <img
              src={userData.imageUrl}
              alt={isArabic ? "صورة المستخدم" : "User avatar"}
              className={`rounded-full w-36 h-36 object-cover border-4 transition-all duration-300 ${
                isEditing
                  ? "border-yellow-400"
                  : "border-gray-300 dark:border-gray-600"
              } shadow-lg`}
            />
          ) : (
            <div
              className={`rounded-full w-36 h-36 flex items-center justify-center border-4 transition-all duration-300 ${
                isEditing
                  ? "border-yellow-400"
                  : "border-gray-300 dark:border-gray-600"
              } bg-gray-100 dark:bg-gray-700 shadow-lg`}
            >
              <FiUser className="text-yellow-500 text-5xl" />
            </div>
          )}
          {isEditing && (
            <button
              onClick={async () => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      const result = await compressAndUploadImage(file);
                      setUserData((prev) => ({
                        ...prev,
                        imageUrl: result.imageUrl,
                      }));
                      alert(isArabic ? "تم تحديث الصورة" : "Image updated");
                    } catch {
                      alert(
                        isArabic ? "فشل رفع الصورة" : "Image upload failed"
                      );
                    }
                  }
                };
                input.click();
              }}
              className={`absolute -bottom-2 -right-2 p-3 rounded-full ${
                isDark ? "bg-yellow-500" : "bg-yellow-400"
              } text-black shadow-lg hover:scale-110 transition-transform duration-200`}
            >
              <FaEdit className="text-sm" />
            </button>
          )}
        </div>
      </div>

      {/* Join date */}
      {userData.createdAt && (
        <div
          className={`flex items-center justify-center mb-8 p-3 rounded-xl ${
            isDark ? "bg-gray-700/50" : "bg-gray-50"
          } text-sm font-medium`}
        >
          <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20 mr-3">
            <FiCalendar className="text-yellow-500 text-sm" />
          </div>
          <span>
            {isArabic ? "تاريخ الانضمام: " : "Joined on: "}
            {moment(userData.createdAt)
              .tz("Asia/Dubai")
              .format(isArabic ? "DD/MM/YYYY" : "MMM DD, YYYY")}
          </span>
        </div>
      )}

      {/* Information fields */}
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label={isArabic ? "الاسم الأول" : "First Name"}
            value={userData.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
            isDark={isDark}
            icon={<FiUser className="text-yellow-500" />}
            disabled={!isEditing}
          />
          <InputField
            label={isArabic ? "الاسم الأخير" : "Last Name"}
            value={userData.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
            isDark={isDark}
            icon={<FiUser className="text-yellow-500" />}
            disabled={!isEditing}
          />
        </div>

        <InputField
          icon={<FiPhone className="text-yellow-500" />}
          label={isArabic ? "رقم الهاتف" : "Phone Number"}
          value={userData.clientPhone || ""}
          onChange={(e) => handleChange("clientPhone", e.target.value)}
          isDark={isDark}
          disabled={!isEditing}
        />

        {/* Nationality */}
        <div className="relative">
          <label className="font-medium flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
            <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
              <FiFlag className="text-yellow-500 text-sm" />
            </div>
            {isArabic ? "الجنسية" : "Nationality"}
            {nationalityCode && (
              <FlagIcon code={nationalityCode} size={20} className="ml-2" />
            )}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={isArabic ? "ابحث عن دولة..." : "Search country..."}
              value={searchCountry}
              onChange={(e) => {
                setSearchCountry(e.target.value);
                setShowCountryDropdown(true);
              }}
              onFocus={() => isEditing && setShowCountryDropdown(true)}
              className={`w-full rounded-xl px-4 py-2.5 pl-12 text-sm ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 placeholder-gray-500"
              } border focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
              disabled={!isEditing}
            />
            <FaSearch className="absolute left-4 top-3 text-gray-400 text-sm" />
            {isEditing && (
              <FaChevronDown
                className="absolute right-4 top-3 text-gray-400 cursor-pointer hover:text-yellow-500 transition-colors text-sm"
                onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              />
            )}
          </div>

          {showCountryDropdown && isEditing && (
            <div
              className={`absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg shadow-lg ${
                isDark ? "bg-gray-700" : "bg-white"
              } border ${isDark ? "border-gray-600" : "border-gray-300"}`}
            >
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <div
                    key={country.countryId}
                    className={`px-4 py-2 cursor-pointer hover:bg-yellow-500 hover:text-black ${
                      isDark ? "hover:bg-yellow-600" : "hover:bg-yellow-400"
                    }`}
                    onClick={() => {
                      handleChange("nationality", country.countryName);
                      setSearchCountry(country.countryName);
                      setShowCountryDropdown(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <FlagIcon
                        code={country.countryCode.toUpperCase()}
                        size={16}
                      />
                      <span>{country.countryName}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  {isArabic ? "لا توجد نتائج" : "No results found"}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Gender */}
        <div>
          <label className="font-medium flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
            <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
              <FaVenusMars className="text-yellow-500 text-sm" />
            </div>
            {isArabic ? "النوع" : "Gender"}
          </label>
          <select
            value={userData.gender || ""}
            onChange={(e) => handleChange("gender", Number(e.target.value))}
            className={`w-full rounded-xl px-4 py-2.5 text-sm ${
              isDark
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            } border focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none appearance-none ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
            disabled={!isEditing}
          >
            <option value="">
              {isArabic ? "اختر النوع" : "Select Gender"}
            </option>
            <option value={1}>{isArabic ? "ذكر" : "Male"}</option>
            <option value={2}>{isArabic ? "أنثى" : "Female"}</option>
            <option value={3}>{isArabic ? "أخرى" : "Other"}</option>
          </select>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="font-medium flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
            <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
              <FaBirthdayCake className="text-yellow-500 text-sm" />
            </div>
            {isArabic ? "تاريخ الميلاد" : "Date of Birth"}
          </label>
          <div className="relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) =>
                handleChange(
                  "dateOfBirth",
                  date
                    ? moment(date).tz("Asia/Dubai").format("YYYY-MM-DD")
                    : null
                )
              }
              dateFormat="yyyy-MM-dd"
              placeholderText={
                isArabic ? "اختر تاريخ الميلاد" : "Select date of birth"
              }
              locale={locale}
              className={`w-full rounded-xl px-4 py-2.5 pl-12 text-sm ${
                isDark
                  ? "bg-gray-700/50 border-gray-600 placeholder-gray-400"
                  : "bg-gray-50 border-gray-200 placeholder-gray-500"
              } border focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
              showYearDropdown
              dropdownMode="select"
              yearDropdownItemNumber={100}
              scrollableYearDropdown
              disabled={!isEditing}
            />
            <FiCalendar className="absolute left-4 top-3 text-gray-400 text-sm" />
          </div>
        </div>

        {/* Password */}
        {isEditing && (
          <InputField
            icon={<FiLock className="text-yellow-500" />}
            label={
              isNewPassword
                ? isArabic
                  ? "إنشاء كلمة مرور"
                  : "Create Password"
                : isArabic
                ? "تغيير كلمة المرور"
                : "Change Password"
            }
            type="password"
            value={passwordInput}
            placeholder={
              isNewPassword
                ? isArabic
                  ? "ادخل كلمة المرور لأول مرة"
                  : "Set your password for the first time"
                : isArabic
                ? "استخدم كلمة السر السابقة أو اكتب كلمة سر جديدة"
                : "Use the old password or create a new one"
            }
            onChange={(e) => setPasswordInput(e.target.value)}
            isDark={isDark}
          />
        )}

        {/* Save button */}
        {isEditing && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`mt-6 w-full py-3 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
              isDark
                ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                : "bg-yellow-400 hover:bg-yellow-500 text-black"
            } shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {isArabic ? "جاري الحفظ..." : "Saving..."}
              </>
            ) : (
              <>
                <FaCheck />
                {isArabic ? "حفظ التغييرات" : "Save Changes"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  icon,
  placeholder = "",
  isDark,
  disabled = false,
}) {
  return (
    <div>
      <label className="font-medium flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300">
        <div className="p-1.5 rounded-full bg-yellow-100 dark:bg-yellow-500/20">
          {icon}
        </div>
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`w-full rounded-xl px-4 py-2.5 text-sm ${
          isDark
            ? "bg-gray-700/50 border-gray-600 placeholder-gray-400"
            : "bg-gray-50 border-gray-200 placeholder-gray-500"
        } border focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 outline-none transition-all ${
          disabled ? "cursor-not-allowed opacity-70" : ""
        }`}
      />
    </div>
  );
}

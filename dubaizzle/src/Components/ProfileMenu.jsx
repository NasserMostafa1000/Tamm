import React, { useState, useRef, useEffect } from "react";
import UserAvatar from "./userAvatar.jsx";
import {
  FaHeart,
  FaClipboardList,
  FaCheck,
  FaChevronDown,
  FaCog,
  FaSignOutAlt,
  FaUserPlus,
} from "react-icons/fa";
import {
  GroupIcon,
  UserCog,
  Coins,
  Handshake,
  PhoneCall,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../Context/LangContext";
import { useNavigate } from "react-router-dom";
import { GetCurrentUserRoleName, GetImageUrl } from "../Utils/Constant.js";

export default function ProfileMenu({ token, userToken, isDark, isRTL }) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const ImageUrl = GetImageUrl(token);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef();

  // تحديد اتجاه القائمة بناءً على اللغة

  const textAlign = isRTL ? "text-right" : "text-left";

  // وظيفة التعامل مع النقر خارج القائمة
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const HandleLogin = (redirectName, GoTO) => {
    navigate("/Login", { state: { fromButton: redirectName, GoTo: GoTO } });
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };

  // دوال التنقل
  const goToProfile = () => {
    setProfileMenuOpen(false);
    if (!userToken)
      return HandleLogin(language === "العربية" ? "الملف الشخصي" : "Profile");
    navigate("/Profile");
  };

  const goToMyAds = () => {
    setProfileMenuOpen(false);
    if (!userToken)
      return HandleLogin(language === "العربية" ? "إعلاناتي" : "My Ads");
    navigate("/MyAds");
  };

  const goToMyFavourits = () => {
    setProfileMenuOpen(false);
    if (!userToken)
      return HandleLogin(language === "العربية" ? "المفضلة" : "Favorites");
    navigate("/MyFavourits");
  };

  const goToAddCategorypage = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/AddNewCategory");
  };

  const CheckAds = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/AdVerification");
  };

  const CheckReports = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/ListingReports");
  };

  const GoToCoinsManager = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/Coins");
  };

  const Clients = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/Clients");
  };

  const GoToUpdateContact = () => {
    setProfileMenuOpen(false);
    navigate("/Admin/UpdateContacts");
  };

  const goToAboutUs = () => {
    setProfileMenuOpen(false);
    navigate("/AboutUs");
  };

  const goToPrivacyAndTerms = () => {
    setProfileMenuOpen(false);
    navigate("/PrivacyAndTerms");
  };

  const goToContactUs = () => {
    setProfileMenuOpen(false);
    navigate("/ContactUs");
  };

  const goToSettings = () => {
    setProfileMenuOpen(false);
    navigate("/Settings");
  };
  const goToAdVerficationHistory = () => {
    setProfileMenuOpen(false);
    navigate("/AdVerficationHistory");
  };

  return (
    <div className="relative" ref={profileRef}>
      {/* زر فتح القائمة */}
      <button
        onClick={() => setProfileMenuOpen(!profileMenuOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200
          ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-900"
          }
          border ${isDark ? "border-gray-600" : "border-gray-300"}
          min-w-[120px] justify-between
        `}
      >
        <div className="flex items-center gap-2">
          <UserAvatar imageUrl={ImageUrl} size={28} />
          <span className="text-sm font-medium hidden sm:block">
            {language === "العربية" ? "حسابي" : "Account"}
          </span>
        </div>
        <FaChevronDown
          className={`text-xs transition-transform duration-200 ${
            profileMenuOpen ? "rotate-180" : "rotate-0"
          } ${isDark ? "text-gray-300" : "text-gray-600"}`}
        />
      </button>

      {/* القائمة المنسدلة */}
      {profileMenuOpen && (
        <div
          className={`
    absolute ${
      isRTL ? "left-1/2 -translate-x-1/2" : "left-1/2 -translate-x-1/2"
    } top-full mt-2
    w-72 max-w-[90vw] bg-white dark:bg-gray-800
    shadow-2xl border dark:border-gray-700 rounded-xl z-50
    animate-in fade-in-0 zoom-in-95
  `}
        >
          {/* رأس القائمة */}
          <div className={`p-4 border-b dark:border-gray-700 ${textAlign}`}>
            <div className="flex items-center gap-3">
              <UserAvatar imageUrl={ImageUrl} size={45} />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white">
                  {language === "العربية" ? "حسابي" : "My Account"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {GetCurrentUserRoleName(token) ||
                    (language === "العربية" ? "زائر" : "Guest")}
                </p>
              </div>
            </div>
          </div>

          {/* محتوى القائمة */}
          <div className="max-h-96 overflow-y-auto">
            {/* قسم المستخدم الأساسي */}
            <div className="p-2">
              <button
                onClick={goToProfile}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textAlign}`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <FaUserPlus
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                    size={16}
                  />
                </div>
                <span className="font-medium">
                  {language === "العربية" ? "الملف الشخصي" : "Profile"}
                </span>
              </button>

              <button
                onClick={goToMyAds}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textAlign}`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <FaClipboardList
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                    size={16}
                  />
                </div>
                <span className="font-medium">
                  {language === "العربية" ? "إعلاناتي" : "My Ads"}
                </span>
              </button>

              <button
                onClick={goToMyFavourits}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textAlign}`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isDark ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <FaHeart
                    className={isDark ? "text-gray-300" : "text-gray-600"}
                    size={16}
                  />
                </div>
                <span className="font-medium">
                  {language === "العربية" ? "المفضلة" : "Favorites"}
                </span>
              </button>
            </div>

            {/* قسم الأدمن */}
            {GetCurrentUserRoleName(token) === "Admin" && (
              <div className="p-2 border-t dark:border-gray-700">
                <div
                  className={`px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 ${textAlign}`}
                >
                  {language === "العربية" ? "لوحة التحكم" : "Admin Panel"}
                </div>

                {[
                  {
                    action: goToAddCategorypage,
                    text:
                      language === "العربية"
                        ? "إضافة قسم جديد"
                        : "Add New Category",
                    icon: FaClipboardList,
                  },
                  {
                    action: CheckAds,
                    text:
                      language === "العربية"
                        ? "مراجعة الإعلانات"
                        : "Ad Verification",
                    icon: FaCheck,
                  },
                  {
                    action: CheckReports,
                    text:
                      language === "العربية"
                        ? "مراجعة البلاغات"
                        : "Reports Verification",
                    icon: FaCheck,
                  },
                  {
                    action: GoToCoinsManager,
                    text:
                      language === "العربية"
                        ? "إدارة العملات"
                        : "Coins Manager",
                    icon: Coins,
                  },
                  {
                    action: Clients,
                    text: language === "العربية" ? "العملاء" : "Clients",
                    icon: GroupIcon,
                  },
                  {
                    action: GoToUpdateContact,
                    text:
                      language === "العربية"
                        ? "إعدادات التواصل"
                        : "Contact Settings",
                    icon: UserCog,
                  },
                  {
                    action: goToAdVerficationHistory,
                    text:
                      language === "العربية"
                        ? "سجل التحقق من الاعلانات"
                        : "Ad  verfication His",
                    icon: UserCog,
                  },
                ].map((item, index) => (
                  <button
                    key={index}
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textAlign}`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        isDark ? "bg-gray-700" : "bg-gray-100"
                      }`}
                    >
                      <item.icon
                        className={isDark ? "text-gray-300" : "text-gray-600"}
                        size={16}
                      />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </button>
                ))}
              </div>
            )}

            {/* قسم المعلومات */}
            <div className="p-2 border-t dark:border-gray-700">
              {[
                {
                  action: goToAboutUs,
                  text: language === "العربية" ? "من نحن" : "About Us",
                  icon: Handshake,
                },
                {
                  action: goToPrivacyAndTerms,
                  text:
                    language === "العربية"
                      ? "الشروط والخصوصية"
                      : "Privacy & Terms",
                  icon: BookOpen,
                },
                {
                  action: goToContactUs,
                  text: language === "العربية" ? "تواصل معنا" : "Contact Us",
                  icon: PhoneCall,
                },
                {
                  action: goToSettings,
                  text: language === "العربية" ? "الإعدادات" : "Settings",
                  icon: FaCog,
                },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${textAlign}`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={isDark ? "text-gray-300" : "text-gray-600"}
                      size={16}
                    />
                  </div>
                  <span className="font-medium">{item.text}</span>
                </button>
              ))}
            </div>

            {/* قسم تسجيل الدخول/الخروج */}
            <div className="p-2 border-t dark:border-gray-700">
              {userToken ? (
                <button
                  onClick={logout}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors ${textAlign}`}
                >
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <FaSignOutAlt size={16} />
                  </div>
                  <span className="font-medium">
                    {language === "العربية" ? "تسجيل خروج" : "Logout"}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    HandleLogin(
                      language === "العربية" ? "إنشاء حساب" : "Create Account"
                    )
                  }
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-green-600 dark:text-green-400 transition-colors ${textAlign}`}
                >
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <FaUserPlus size={16} />
                  </div>
                  <span className="font-medium">
                    {language === "العربية"
                      ? "تسجيل دخول / إنشاء حساب"
                      : "Sign in / Sign Up"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/TokenContext";
import * as signalR from "@microsoft/signalr";
import { useLanguage } from "../Context/LangContext";
import {
  FaMoon,
  FaSun,
  FaHeart,
  FaUserPlus,
  FaBullhorn,
  FaEnvelope,
  FaHome,
  FaUser,
  FaCog,
  FaInfoCircle,
  FaHeadset,
} from "react-icons/fa";
import BtnLanguage from "../Buttons/BtnLanguage";
import {
  playNotificationSound,
  ServerPath,
  SiteNameEN,
} from "../Utils/Constant.js";
import { useNavigate } from "react-router-dom";
import { fetchUnreadMessagesCount } from "../Services/messages.js";
import { toast } from "react-toastify";
import ProfileMenu from "./ProfileMenu.jsx";

export default function NavBar() {
  const [connection, setConnection] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { language } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const { userToken } = useAuth();
  const {} = useAuth();
  const isDark = mode === "dark";
  const isRTL = language === "العربية";
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  // نظام الألوان المحسّن
  const theme = {
    light: {
      background: "bg-white",
      text: "text-gray-900",
      primary: "bg-gradient-to-r from-blue-500 to-blue-600",
      primaryHover: "bg-gradient-to-r from-blue-600 to-blue-700",
      secondary: "bg-gray-100",
      secondaryHover: "bg-gray-200",
      border: "border-gray-200",
      card: "bg-white",
      icon: "text-gray-600",
    },
    dark: {
      background: "bg-gray-900",
      text: "text-white",
      primary: "bg-gradient-to-r from-blue-600 to-blue-700",
      primaryHover: "bg-gradient-to-r from-blue-700 to-blue-800",
      secondary: "bg-gray-800",
      secondaryHover: "bg-gray-700",
      border: "border-gray-700",
      card: "bg-gray-800",
      icon: "text-gray-300",
    },
  };

  const currentTheme = isDark ? theme.dark : theme.light;

  const fetchMessages = async () => {
    if (userToken) {
      try {
        const count = await fetchUnreadMessagesCount();
        setUnreadMessages(count);
        if (count > 0) {
          playNotificationSound("/recievemessage.mp3");
          toast(
            <div
              onClick={() => navigate("/Messages")}
              className="cursor-pointer flex items-center gap-2"
            >
              <FaEnvelope className="text-red-500" size={20} />
              {language === "العربية" ? "رسائل غير مقروءة" : "Unread messages"}
            </div>
          );
        }
      } catch (error) {
        console.error("Failed to fetch unread messages:", error);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [userToken]);

  useEffect(() => {
    if (!userToken) return;

    const connectToHub = async () => {
      try {
        const connection = new signalR.HubConnectionBuilder()
          .withUrl(`${ServerPath}chatHub`, {
            accessTokenFactory: () => userToken,
          })
          .withAutomaticReconnect()
          .build();

        connection.on("ReceiveMessage", () => {
          setUnreadMessages((prev) => prev + 1);
        });

        await connection.start();
        setConnection(connection);
      } catch (error) {
        console.error("SignalR connection error:", error);
      }
    };

    connectToHub();
  }, [userToken]);

  const handleLogin = (redirectName, goTo = "/") => {
    navigate("/Login", { state: { fromButton: redirectName, GoTo: goTo } });
  };

  const handlePostAd = () => {
    if (!userToken) {
      handleLogin(
        language === "العربية" ? "انشر إعلانك" : "Post Ad",
        "/PostAd"
      );
      return;
    }
    navigate("/PostAd");
  };

  const goToMessages = () => {
    if (!userToken) {
      handleLogin(language === "العربية" ? "الرسائل" : "Messages", "/Messages");
      return;
    }
    navigate("/Messages");
  };

  const goToFavorites = () => {
    if (!userToken) {
      handleLogin(
        language === "العربية" ? "المفضلة" : "Favorites",
        "/MyFavourits"
      );
      return;
    }
    navigate("/MyFavourits");
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToAboutUs = () => {
    navigate("/aboutus");
  };

  const goToContactUs = () => {
    navigate("/contactus");
  };

  return (
    <div
      className={`w-full ${currentTheme.background} ${currentTheme.text} transition-colors duration-300`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* شريط التنقل العلوي - Desktop */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* الجزء الأيسر - الشعار والتنقل */}
            <div className="flex items-center gap-8">
              <button
                onClick={goToHome}
                className="flex items-center gap-3 group"
              >
                <div
                  className={`w-10 h-10 rounded-lg ${currentTheme.primary} flex items-center justify-center group-hover:scale-110 transition-transform`}
                >
                  <FaHome className="text-white text-lg" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  {SiteNameEN}
                </span>
              </button>

              <nav className="flex items-center gap-6">
                <button
                  onClick={goToAboutUs}
                  className={`px-4 py-2 rounded-lg font-medium hover:${currentTheme.secondaryHover} transition-colors flex items-center gap-2`}
                >
                  <FaInfoCircle />
                  <span>
                    {language === "العربية" ? "عن التطبيق" : "About Us"}
                  </span>
                </button>
                <button
                  onClick={goToContactUs}
                  className={`px-4 py-2 rounded-lg font-medium hover:${currentTheme.secondaryHover} transition-colors flex items-center gap-2`}
                >
                  <FaHeadset />
                  <span>
                    {language === "العربية" ? "اتصل بنا" : "Contact Us"}
                  </span>
                </button>
              </nav>
            </div>

            {/* زر نشر الإعلان في المنتصف */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <button
                onClick={handlePostAd}
                className={`px-8 py-3 rounded-xl font-bold text-lg text-white shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-3 ${currentTheme.primary} hover:${currentTheme.primaryHover}`}
              >
                <FaBullhorn className="text-lg" />
                <span>
                  {language === "العربية" ? "انشر إعلانك" : "Post Ad"}
                </span>
              </button>
            </div>

            {/* الجزء الأيمن - المستخدم والإعدادات */}
            <div className="flex items-center gap-4">
              {/* زر الوضع */}
              <button
                onClick={toggleMode}
                className={`p-3 rounded-xl ${currentTheme.secondary} hover:${currentTheme.secondaryHover} transition-colors`}
                title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDark ? (
                  <FaSun className="text-yellow-400" />
                ) : (
                  <FaMoon className="text-gray-600" />
                )}
              </button>
              {/* زر اللغة */}
              <BtnLanguage
                className={`${currentTheme.secondary} hover:${currentTheme.secondaryHover}`}
              />
              {/* زر الرسائل */}
              <button
                onClick={goToMessages}
                className={`p-3 rounded-xl ${currentTheme.secondary} hover:${currentTheme.secondaryHover} transition-colors relative`}
                title={language === "العربية" ? "الرسائل" : "Messages"}
              >
                <FaEnvelope className={currentTheme.icon} />
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {unreadMessages}
                  </span>
                )}
              </button>
              {/* زر المفضلة */}
              <button
                onClick={goToFavorites}
                className={`p-3 rounded-xl ${currentTheme.secondary} hover:${currentTheme.secondaryHover} transition-colors`}
                title={language === "العربية" ? "المفضلة" : "Favorites"}
              >
                <FaHeart className={currentTheme.icon} />
              </button>
              {/* زر المستخدم */}
              {userToken ? (
                <div
                  className="relative"
                  style={{ direction: isRTL ? "rtl" : "ltr" }}
                >
                  <ProfileMenu
                    token={token}
                    userToken={userToken}
                    isDark={isDark}
                    isRTL={isRTL}
                  />
                </div>
              ) : (
                <button
                  onClick={() =>
                    handleLogin(
                      language === "العربية" ? "تسجيل الدخول" : "Sign In"
                    )
                  }
                  className={`px-6 py-3 rounded-xl font-medium ${currentTheme.secondary} hover:${currentTheme.secondaryHover} transition-colors flex items-center gap-2`}
                >
                  <FaUser className={currentTheme.icon} />
                  <span>
                    {language === "العربية" ? "تسجيل الدخول" : "Sign In"}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* شريط التنقل السفلي - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className={`${currentTheme.card} border-t ${currentTheme.border} shadow-2xl`}
        >
          <div className="flex justify-around items-center py-3">
            {/* زر الرئيسية */}
            <button
              onClick={goToHome}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            >
              <FaHome className={`text-xl ${currentTheme.icon}`} />
              <span className="text-xs">
                {language === "العربية" ? "الرئيسية" : "Home"}
              </span>
            </button>

            {/* زر عن التطبيق */}
            <button
              onClick={goToAboutUs}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            >
              <FaInfoCircle className={`text-xl ${currentTheme.icon}`} />
              <span className="text-xs">
                {language === "العربية" ? "عن التطبيق" : "About"}
              </span>
            </button>

            {/* زر نشر إعلان (مركزي) */}
            <button
              onClick={handlePostAd}
              className="flex flex-col items-center gap-1 transform -translate-y-4"
            >
              <div
                className={`p-4 rounded-full ${currentTheme.primary} shadow-2xl hover:scale-110 transition-transform`}
              >
                <FaBullhorn className="text-white text-xl" />
              </div>
              <span className="text-xs font-semibold">
                {language === "العربية" ? "نشر اعلان" : "Post ad"}
              </span>
            </button>

            {/* زر اتصل بنا */}
            <button
              onClick={goToContactUs}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors"
            >
              <FaHeadset className={`text-xl ${currentTheme.icon}`} />
              <span className="text-xs">
                {language === "العربية" ? "اتصل بنا" : "Contact"}
              </span>
            </button>

            {/* زر الرسائل */}
            <button
              onClick={goToMessages}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors relative"
            >
              <FaEnvelope className={`text-xl ${currentTheme.icon}`} />
              {unreadMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                  {unreadMessages}
                </span>
              )}
              <span className="text-xs">
                {language === "العربية" ? "الرسائل" : "Messages"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* شريط الإعدادات العلوي - Mobile */}
      <div className="lg:hidden">
        <div
          className={`px-4 py-3 border-b ${currentTheme.border} flex justify-between items-center`}
        >
          {/* الشعار */}
          <button onClick={goToHome} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-lg ${currentTheme.primary} flex items-center justify-center`}
            >
              <FaHome className="text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              {SiteNameEN}
            </span>
          </button>

          {/* الإعدادات */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className={`p-2 rounded-lg ${currentTheme.secondary}`}
              title={isDark ? "Light Mode" : "Dark Mode"}
            >
              {isDark ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-gray-600" />
              )}
            </button>

            <BtnLanguage
              className={`${currentTheme.secondary}`}
              compact={true}
            />

            {userToken ? (
              <div className={`relative ${isRTL ? "" : "ltr-profile-menu"}`}>
                <ProfileMenu
                  token={token}
                  userToken={userToken}
                  isDark={isDark}
                  isRTL={isRTL}
                />
              </div>
            ) : (
              <button
                onClick={() =>
                  handleLogin(language === "العربية" ? "تسجيل" : "Sign In")
                }
                className={`p-2 rounded-lg ${currentTheme.secondary}`}
                title={language === "العربية" ? "تسجيل الدخول" : "Sign In"}
              >
                <FaUser className={currentTheme.icon} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

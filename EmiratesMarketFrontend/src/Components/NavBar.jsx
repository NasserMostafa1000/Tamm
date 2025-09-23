import { useState, useRef, useEffect } from "react";
import TammLogo from "../Layouts/TammLogo";
import CustomButton from "../Buttons/CustomButton";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";

import { useAuth } from "../Context/TokenContext";
import * as signalR from "@microsoft/signalr";
import { BookOpen, Coins, Handshake, PhoneCall, UserCog } from "lucide-react";
import { useLanguage } from "../Context/LangContext";
import {
  FaMoon,
  FaSun,
  FaHeart,
  FaUserPlus,
  FaBullhorn,
  FaEnvelope,
  FaClipboardList,
  FaCog,
  FaSignOutAlt,
  FaCheck,
  FaChevronDown,
} from "react-icons/fa";
import BtnLanguage from "../Buttons/BtnLanguage";
import DecodedTokenAndReturnCurrentClientInfoInfo, {
  API_BASE_URL,
  GetCurrentUserRoleName,
  GetImageUrl,
  playNotificationSound,
  ServerPath,
} from "../Utils/Constant.js";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";
import { useLocationContext } from "../Context/LocationProvider.jsx";
import UserAvatar from "./userAvatar.jsx";
import { fetchUnreadMessagesCount } from "../Services/messages.js";
import { toast } from "react-toastify";
export default function NavBar() {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const { language } = useLanguage();
  const { mode, toggleMode } = useTheme();
  const { userToken } = useAuth();
  const isDark = mode === "dark";
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRefDesktop = useRef();
  const profileRefMobile = useRef();
  const [connection, setConnection] = useState(null);
  const { currentPlace, setCurrentPlace, emirates } = useLocationContext();
  const token = localStorage.getItem("userToken");
  const ImageUrl = GetImageUrl(token);
  const translateEmirate = (en) => {
    const map = {
      "All Emirates": "كل الأمارات",
      "Abu Dhabi": "أبو ظبي",
      Dubai: "دبي",
      Sharjah: "الشارقة",
      Ajman: "عجمان",
      "Ras Al Khaimah": "رأس الخيمة",
      Fujairah: "الفجيرة",
      "Umm Al Quwain": "أم القيوين",
    };
    return map[en] || en;
  };
  // 🟢 أولاً: عرف الدالة خارج الـ useEffect
  const fetchMessages = async () => {
    if (userToken) {
      try {
        const count = await fetchUnreadMessagesCount();
        setUnreadMessages(count);

        if (count > 0) {
          playNotificationSound("/recievemessage.mp3"); // شغل الصوت الأول
          toast(
            <div
              onClick={() => navigate("/Messages")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <FaEnvelope color="red" size={20} />
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
    fetchMessages(); // 👈 أول تحميل
  }, [userToken]);

  useEffect(() => {
    if (!userToken) return;

    let connectionInstance = null;

    const connectToHub = async () => {
      try {
        const newConnection = new signalR.HubConnectionBuilder()
          .withUrl(`${ServerPath}chatHub`, {
            accessTokenFactory: () => userToken,
          })
          .withAutomaticReconnect({
            nextRetryDelayInMilliseconds: () => 2000,
          })
          .configureLogging(signalR.LogLevel.Information)
          .build();

        newConnection.on("ReceiveMessage", () => {
          setUnreadMessages((prev) => prev + 1);
        });

        newConnection.onclose((error) => {
          console.warn("Connection closed. Trying to reconnect...", error);
          reconnect();
        });

        await newConnection.start();
        console.log("SignalR connected ✅");
        setConnection(newConnection);
        connectionInstance = newConnection;
      } catch (error) {
        console.error("SignalR connection error ❌", error);
        setTimeout(connectToHub, 3000);
      }
    };

    const reconnect = () => {
      if (!connectionInstance || connectionInstance.state === "Disconnected") {
        connectToHub();
      }
    };

    connectToHub();

    return () => {
      if (connectionInstance) {
        connectionInstance.stop();
      }
    };
  }, [userToken]);

  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("userToken");
    window.location.reload();
  };
  function HandleLogin(redirectName, GoTO) {
    navigate("/Login", { state: { fromButton: redirectName, GoTo: GoTO } });
  }

  function HandlePostAd() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "انشر إعلانك" : "Post Ad",
        "/PostAd"
      );
      return;
    }
    navigate("/PostAd");
  }
  function CheckAds() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "انشر إعلانك" : "Post Ad",
        "/PostAd"
      );
      return;
    }
    navigate("/Admin/AdVerification");
  }
  function Clients() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "انشر إعلانك" : "Post Ad",
        "/Admin/Clients"
      );
      return;
    }
    navigate("/Admin/Clients");
  }
  function GoToUpdateContact() {
    navigate("/Admin/UpdateContacts");
  }
  function CheckReports() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "انشر إعلانك" : "Post Ad",
        "/Admin/ListingReports"
      );
      return;
    }
    navigate("/Admin/ListingReports");
  }
  function GoToCoinsManager() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "ادراه العملات" : "Coins Manager",
        "/Admin/Coins"
      );
      return;
    }
    navigate("/Admin/Coins");
  }

  function GoToCoinsResharger() {
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "شحن عملاتك" : "Recharging Coins",
        "/RechargingCoins"
      );
      return;
    }
    navigate("/RechargingCoins");
  }
  function goToProfile() {
    setProfileMenuOpen(false);
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "الملف الشخصي" : "Profile",
        "/Profile"
      );
      return;
    }
    navigate("/Profile");
  }
  function goToPrivacyAndTerms() {
    navigate("/PrivacyAndTerms");
  }

  function goToMessages() {
    setProfileMenuOpen(false);
    if (!userToken) {
      HandleLogin(language === "العربية" ? "الرسائل" : "Messages", "Messages");
      return;
    }
    navigate("/Messages");
  }

  function goToMyAds() {
    setProfileMenuOpen(false);
    if (!userToken) {
      HandleLogin(language === "العربية" ? "إعلاناتي" : "My Ads", "/MyAds");
      return;
    }
    navigate("/MyAds");
  }
  function goToAddCategorypage() {
    setProfileMenuOpen(false);
    if (!userToken) {
      HandleLogin(language === "العربية" ? "اضافه قسم جديد" : " ", " ");
      return;
    }
    navigate("/Admin/AddNewCategory");
  }
  function goToMyFavourits() {
    setProfileMenuOpen(false);
    if (!userToken) {
      HandleLogin(
        language === "العربية" ? "المفضلة" : "Favorites",
        "Favorites"
      );
      return;
    }
    navigate("/MyFavourits");
  }
  function goToAboutUs() {
    setProfileMenuOpen(false);
    navigate("/AboutUs");
  }
  function goToSettings() {
    setProfileMenuOpen(false);
    navigate("/Settings");
  }
  function goToContactUs() {
    setProfileMenuOpen(false);
    navigate("/ContactUs");
  }
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRefDesktop.current &&
        !profileRefDesktop.current.contains(event.target) &&
        profileRefMobile.current &&
        !profileRefMobile.current.contains(event.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div
      className={`w-full border-none transition-colors duration-500 relative ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-black"
      }`}
    >
      {/* تأثير الشمس أو النجوم */}
      {!isDark ? (
        <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-full opacity-40 blur-2xl pointer-events-none z-0" />
      ) : (
        <>
          <div className="absolute top-2 right-5 text-yellow-100 text-xs z-0">
            ✦
          </div>
          <div className="absolute top-6 left-10 text-white text-sm z-0">✧</div>
          <div className="absolute top-10 right-16 text-white text-[10px] z-0">
            ★
          </div>
          <div className="absolute top-3 left-1/2 text-yellow-200 text-[8px] z-0">
            ✩
          </div>
          <div className="absolute bottom-3 left-4 text-yellow-100 text-[12px] z-0">
            ✨
          </div>
        </>
      )}

      {/* الشعار وزر البروفايل - في الأعلى */}
      <div className="flex justify-between items-center mb-4 md:mb-0 z-10 relative">
        <div className="relative" ref={profileRefMobile}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className={`
    relative group flex items-center gap-2 rounded-full px-2 py-1
    ${isDark ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}
    hover:brightness-95 hover:shadow-md shadow-sm
    transition duration-200
    focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 focus-visible:ring-offset-2
    active:scale-95
  `}
            aria-label={
              language === "العربية" ? "قائمة البروفايل" : "Profile menu"
            }
          >
            <UserAvatar imageUrl={ImageUrl} size={40} />

            {/* سهم بيدل على وجود قائمة */}
            <FaChevronDown
              className={`text-sm transition-transform duration-200 ${
                profileMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />

            {/* overlay خفيف عند الـhover */}
            <span className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/5 transition" />
          </button>
          {profileMenuOpen && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-md py-2 z-30 text-black dark:text-white">
              <button
                onClick={() => goToProfile()}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <UserAvatar imageUrl={ImageUrl} size={25} />
                {language === "العربية" ? "الملف الشخصي" : "Profile"}
              </button>
              <button
                onClick={goToMyAds}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <FaClipboardList />{" "}
                {language === "العربية" ? "إعلاناتي" : "My Ads"}
              </button>
              {/* تم تغيير زر الرسائل إلى زر المفضلة هنا */}
              <button
                onClick={goToMyFavourits}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <FaHeart /> {language === "العربية" ? "المفضلة" : "Favorites"}
              </button>
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={goToAddCategorypage}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <FaClipboardList />{" "}
                  {language === "العربية" ? "اضف قسم جديد" : "Add New Category"}
                </button>
              )}
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={CheckAds}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <FaCheck />{" "}
                  {language === "العربية"
                    ? "مراجعة الاعلانات"
                    : "Ad Verification"}
                </button>
              )}
              <button
                onClick={GoToCoinsResharger}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <Coins />
                {language === "العربية" ? "تعبئه العملات" : "Recharging Coins"}
              </button>
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={CheckReports}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <FaCheck />
                  {language === "العربية"
                    ? "مراجعة الأبلاغات"
                    : "Reports Verification"}
                </button>
              )}
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={GoToCoinsManager}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <Coins />
                  {language === "العربية" ? "ادراه العملات" : "Coins Manager"}
                </button>
              )}
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={Clients}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <GroupIcon />
                  {language === "العربية" ? "العملاء" : "Clients"}
                </button>
              )}
              {GetCurrentUserRoleName(token) == "Admin" && (
                <button
                  onClick={GoToUpdateContact}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
                >
                  <UserCog />
                  {language === "العربية"
                    ? "اعدادات التواصل"
                    : "Contact Settings"}
                </button>
              )}
              <button
                onClick={goToAboutUs}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <Handshake /> {language === "العربية" ? "من نحن" : "About Us"}
              </button>
              <button
                onClick={goToPrivacyAndTerms}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <BookOpen />{" "}
                {language === "العربية"
                  ? "الشروط والخصوصية"
                  : "Privacy And Terms"}
              </button>

              <button
                onClick={goToContactUs}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <PhoneCall />{" "}
                {language === "العربية" ? "تواصل معنا" : "Contact Us"}
              </button>
              <button
                onClick={goToSettings}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-start"
              >
                <FaCog /> {language === "العربية" ? "الإعدادات" : "Settings"}
              </button>
              {userToken && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-700 w-full text-start"
                >
                  <FaSignOutAlt />{" "}
                  {language === "العربية" ? "تسجيل خروج" : "Logout"}
                </button>
              )}
              {!userToken && (
                <button
                  onClick={() =>
                    HandleLogin(
                      language === "العربية" ? "إنشاء حساب" : "Create Account"
                    )
                  }
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-red-100 dark:hover:bg-green-700 w-full text-start"
                >
                  <FaUserPlus />{" "}
                  {language === "العربية"
                    ? "تسجيل دخول / انشاء حساب"
                    : "Sign in / Sign Up"}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <motion.img
            src="/TammIcon.ico"
            alt="Tamm Logo"
            style={{
              width: "20%",
              height: "20%",
              objectFit: "contain",
              marginTop: "20px", // ← هنا أضفنا المارجن من الأعلى
            }}
            initial={{ scale: 1 }}
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: "spring", stiffness: 100 }}
          />
          {location.pathname === "/" && (
            <select
              value={currentPlace}
              onChange={(e) => setCurrentPlace(e.target.value)}
              className={`mt-12 rounded-md px-2 py-1 text-sm border ${
                isDark
                  ? "bg-gray-800 text-white border-gray-600"
                  : "bg-white text-black border-gray-300"
              }`}
            >
              {emirates.map((em) => (
                <option key={em} value={em}>
                  {language === "العربية" ? translateEmirate(em) : em}
                </option>
              ))}
            </select>
          )}

          {!isDark ? (
            <FaSun
              className="text-yellow-400 text-xl animate-pulse"
              title="نهار"
            />
          ) : (
            <FaMoon className="text-blue-200 text-xl" title="ليل" />
          )}
        </div>
      </div>

      {/* الأزرار - سطح المكتب */}
      {/*      <div className="hidden md:flex justify-center items-center gap-4 z-10 relative -translate-y-10">
       */}
      <div className="hidden md:flex justify-center items-center gap-4 z-10 relative  mt-[-40px]">
        <BtnLanguage
          bgColor={isDark ? "bg-gray-800" : "bg-gray-200"}
          textColor={isDark ? "text-white" : "text-black"}
        />

        <CustomButton
          icon={isDark ? FaSun : FaMoon}
          onClick={toggleMode}
          text=""
          className={`${
            isDark ? "bg-gray-700 text-yellow-400" : "bg-gray-100 text-black"
          } hover:scale-110 transition`}
        />

        <div className="relative">
          <CustomButton
            icon={FaEnvelope}
            text={language === "العربية" ? "الرسائل" : "Messages"}
            onClick={goToMessages}
            className={`${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-black"
            }`}
          />
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </div>

        {!userToken && (
          <CustomButton
            icon={FaUserPlus}
            text={
              language === "العربية"
                ? "تسجيل / انشاء حساب"
                : "Sign in / Sign Up"
            }
            className={`${
              isDark
                ? "bg-slate-800 hover:bg-slate-700 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-black"
            }`}
            onClick={() =>
              HandleLogin(
                language === "العربية" ? "إنشاء حساب" : "Create Account"
              )
            }
          />
        )}

        <div className="mx-4">
          <CustomButton
            icon={FaBullhorn}
            text={language === "العربية" ? "انشر إعلانك" : "Post Ad"}
            onClick={() => HandlePostAd()}
            className={`${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-100 hover:bg-blue-200 text-black"
            }`}
          />
        </div>
      </div>

      {/* أزرار الجوال - أسفل الشاشة */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-inner py-2 flex justify-around items-center px-4 md:hidden z-20">
        {/* زر الرسائل */}
        <div className="relative">
          <CustomButton
            icon={FaEnvelope}
            text=""
            className={`${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-100 hover:bg-gray-200 text-black"
            } p-2 rounded-full`}
            onClick={goToMessages}
          />
          {unreadMessages > 0 && (
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </div>

        {/* زر انشر إعلانك في المنتصف */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 top-0">
          <CustomButton
            icon={FaBullhorn}
            text={language === "العربية" ? "انشر" : "Post"}
            className={`${
              isDark
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            } font-bold px-4 py-2 shadow-lg rounded-full text-sm`}
            onClick={HandlePostAd}
          />
        </div>

        {/* زر المفضلة */}
        <CustomButton
          icon={FaHeart}
          text=""
          className={`${
            isDark
              ? "bg-gray-700 hover:bg-gray-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-black"
          } p-2 rounded-full`}
          onClick={goToMyFavourits}
        />
      </div>
    </div>
  );
}

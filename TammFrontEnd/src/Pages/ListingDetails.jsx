import React, { useState, useEffect } from "react";
import { fetchListingById, fetchUnApprovedListingById } from "../Services/Ad";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet";
import { ar, enUS } from "date-fns/locale";
import {
  FiMessageCircle,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiFlag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  API_BASE_URL,
  GetCurrentUserRoleName,
  ServerPath,
  SiteNameAR,
  SiteNameEN,
} from "../Utils/Constant";
import ReportListing from "../Components/ListingReport";

const FinalListingDetails = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showReportModal, setShowReportModal] = useState(false);
  const userToken = localStorage.getItem("userToken");

  let userId = null;
  try {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      userId = decoded.sub || decoded.userId || decoded.nameID || null;
    }
  } catch {
    navigate("/");
  }

  const handleSendMessageClick = () => {
    const chatState = {
      recipientUserId: listing.userId,
      listingId: listing.listingId,
      recipientName: listing.ownerName,
      recipientImage: listing.userImageUrl,
    };

    if (!userToken) {
      navigate("/Login", {
        state: {
          fromButton: isArabic ? "المحادثه" : "Chat",
          GoTo: `/Listing/${id}`,
          redirectState: chatState,
        },
      });
    } else {
      navigate("/chat", { state: chatState });
    }
  };

  useEffect(() => {
    const CurrentRole = GetCurrentUserRoleName(userToken);
    const lang = isArabic ? "ar" : "en";

    if (CurrentRole === "Admin") {
      fetchUnApprovedListingById(lang, id, userToken).then((data) => {
        if (data) setListing(data);
      });
    } else {
      fetchListingById(lang, id).then((data) => {
        if (data) setListing(data);
      });
    }
  }, [id, isArabic, userToken]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: isArabic ? ar : enUS,
    });
  };

  const handleShareClick = () => {
    const shareUrl = `${API_BASE_URL}Listings/share/listing?id=${
      listing.listingId
    }&lang=${isArabic ? "ar" : "en"}`;

    const shareText = isArabic
      ? `إنظر ماذا وجدت على ${SiteNameAR}!`
      : `Look what I found at ${SiteNameEN}!`;

    if (navigator.share) {
      navigator
        .share({
          title: listing.title,
          text: shareText, // رسالة بدون الرابط
          url: shareUrl, // الرابط هنا فقط
        })
        .catch(() => {
          copyToClipboard(shareUrl);
        });
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(isArabic ? "تم نسخ الرابط" : "Link copied", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    });
  };

  const toggleReportModal = () => {
    if (!userToken) {
      navigate("/Login", {
        state: {
          fromButton: isArabic ? "الإبلاغ" : "Report",
          GoTo: `/Listing/${id}`,
        },
      });
      return;
    }
    setShowReportModal(!showReportModal);
  };

  if (!listing) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div
            className={`w-20 h-20 rounded-full ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`mt-4 w-64 h-6 rounded ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    );
  }

  const images = listing.images ?? [];
  const attributes = listing.attributes ?? [];

  function getPriceAttribute() {
    try {
      const priceAttr = attributes.find((attr) => {
        const name = attr.attributeName
          ?.toLowerCase()
          .replace(/\s/g, "")
          .trim();
        return [
          "price",
          "السعر",
          "الإيجارالشهري",
          "الإيجارالسنوي",
          "monthlyrent",
          "yearlyrent",
        ].includes(name);
      });

      return priceAttr?.value?.trim() ?? null;
    } catch (error) {
      console.error("Error getting price attribute:", error);
      return null;
    }
  }

  const direction = isArabic ? "rtl" : "ltr";
  const isOwner = userId && listing.userId && userId === listing.userId;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title || "Product",
    description: listing.description || "وصف الإعلان غير متوفر حالياً.",
    image: images[0].imageUrl || [],
    offers: {
      "@type": "Offer",
      priceCurrency: "AED",
      price: listing.price || getPriceAttribute() || 0,
      availability: "https://schema.org/InStock",
      url: window.location.href,
    },
  };
  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
      dir={direction}
    >
      <Helmet>
        {/* Charset */}
        <meta charSet="utf-8" />
        {/* Title */}
        <title>{listing.title}</title>
        {/* Basic Meta */}
        <meta
          name="description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta
          name="price"
          content={`${listing.price || getPriceAttribute()} AED`}
        />
        {/* Canonical URL */}
        <link rel="canonical" href={window.location.href} />
        {/* Open Graph */}
        <meta property="og:title" content={listing.title} />
        <meta
          property="og:description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta property="og:image" content={images[0].imageUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:locale" content={isArabic ? "ar_AR" : "en_US"} />
        <meta
          property="product:price:amount"
          content={listing.price || getPriceAttribute()}
        />
        <meta property="product:price:currency" content="AED" />
        <meta property="og:url" content={window.location.href} />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listing.title} />
        <meta
          name="twitter:description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta name="twitter:image" content={images[0].imageUrl} />
        <meta name="twitter:url" content={window.location.href} />
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      {/* شريط التنقل العلوي */}
      <div
        dir="ltr" // إجبار الاتجاه من اليسار لليمين دائماً
        className={`sticky top-0 z-50 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <NavBar />
      </div>
      {/* محتوى الصفحة الرئيسي */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* بطاقة البائع مع زر التواصل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex items-center justify-between p-4 rounded-xl mb-6 ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}
        >
          <div className="flex items-center space-x-3 rtl:space-x-reverse relative">
            <div className="relative">
              <img
                src={
                  isOwner
                    ? localStorage.getItem("userImage") || "/default-avatar.png"
                    : listing.userImageUrl || "/default-avatar.png"
                }
                alt={isOwner ? "Your profile" : listing.ownerName}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500"
              />
              {!isOwner && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></span>
              )}
            </div>
            <div>
              <h3 className="font-bold">
                {isOwner ? (isArabic ? "أنت" : "You") : listing.ownerName}
              </h3>
              {!isOwner && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessageClick}
                  className={`flex items-center space-x-1 rtl:space-x-reverse mt-1 text-sm py-1 px-3 rounded-full ${
                    isDarkMode
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : "bg-cyan-500 hover:bg-cyan-600 text-white"
                  }`}
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span>{isArabic ? "تواصل" : "Contact"}</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* معرض الصور */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          {images.length > 0 ? (
            <>
              {/* الصورة الكبيرة */}
              <img
                src={images[currentImageIndex].imageUrl}
                alt={`Listing Image ${currentImageIndex + 1}`}
                className="w-full h-80 md:h-96 object-cover mb-4 rounded-xl transition-all duration-300"
              />

              {/* الصور المصغرة تحت الصورة الكبيرة */}
              <div className="flex justify-center flex-wrap gap-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.imageUrl}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-20 w-24 object-cover rounded-md cursor-pointer border-2 transition-all duration-200 ${
                      idx === currentImageIndex
                        ? "border-cyan-500"
                        : "border-transparent"
                    }`}
                  />
                ))}
              </div>
            </>
          ) : (
            <div
              className={`w-full h-80 md:h-96 flex items-center justify-center ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <span className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
                {isArabic ? "لا توجد صور متاحة" : "No images available"}
              </span>
            </div>
          )}
        </motion.div>
        {/* أزرار المشاركة والإبلاغ */}
        <div className="flex space-x-2 rtl:space-x-reverse">
          <button
            onClick={handleShareClick}
            className={`p-2 rounded-full ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            aria-label={isArabic ? "مشاركة" : "Share"}
          >
            <FiShare2 className="w-5 h-5" />
          </button>
          {!isOwner && (
            <button
              onClick={toggleReportModal}
              className={`p-2 rounded-full ${
                isDarkMode
                  ? "text-red-400 hover:bg-gray-700"
                  : "text-red-500 hover:bg-gray-100"
              }`}
              aria-label={isArabic ? "الإبلاغ عن الإعلان" : "Report ad"}
            >
              <FiFlag className="w-5 h-5" />
            </button>
          )}
        </div>
        {/* معلومات الإعلان الرئيسية */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`p-6 rounded-xl mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}
        >
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">{listing.title}</h1>
            <div className="text-right">
              <p
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              >
                {listing.price
                  ? `${listing.price} AED`
                  : getPriceAttribute() || "0"}
              </p>

              {listing.originalPrice && (
                <p className="text-sm line-through text-gray-500">
                  {listing.originalPrice} AED
                </p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2
              className={`text-lg font-semibold mb-3 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {isArabic ? "الوصف" : "Description"}
            </h2>
            <p
              className={`leading-relaxed ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {listing.description ||
                (isArabic ? "لا يوجد وصف" : "No description available")}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {isArabic ? "الموقع" : "Location"}
              </h3>
              <p className="font-medium">
                {listing.cityName}, {listing.placeName}
              </p>
            </div>
            <div>
              <h3
                className={`text-sm ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {isArabic ? "تاريخ النشر" : "Posted"}
              </h3>
              <p className="font-medium">{formatDate(listing.createdAt)}</p>
            </div>
          </div>
        </motion.div>

        {/* خصائص الإعلان */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className={`p-6 rounded-xl mb-8 ${
            isDarkMode ? "bg-gray-800" : "bg-white shadow-sm"
          }`}
        >
          <h2
            className={`text-xl font-bold mb-6 ${
              isDarkMode ? "text-gray-300" : "text-gray-800"
            }`}
          >
            {isArabic ? "تفاصيل الإعلان" : "Listing Details"}
          </h2>

          {attributes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {attributes.map(({ attributeName, value }, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-3 border-b border-gray-200 dark:border-gray-700"
                >
                  <span
                    className={`font-medium ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {attributeName}
                  </span>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-800"
                    }`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center py-4 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              {isArabic ? "لا توجد تفاصيل إضافية" : "No additional details"}
            </p>
          )}
        </motion.div>
      </div>
      {/* نافذة الإبلاغ */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`relative rounded-xl p-6 max-w-md w-full ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <button
              onClick={toggleReportModal}
              className={`absolute top-4 ${
                isArabic ? "left-4" : "right-4"
              } p-1 rounded-full ${
                isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
            >
              &times;
            </button>
            <ReportListing
              userId={userId}
              listingId={listing.listingId}
              onClose={() => setShowReportModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinalListingDetails;

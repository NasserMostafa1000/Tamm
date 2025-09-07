import React, { useState, useEffect, useCallback } from "react";
import {
  fetchListingById,
  fetchUnApprovedListingById,
  getCustomerRating,
  upsertCustomerRating,
} from "../Services/Ad";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet";
import { ar, enUS } from "date-fns/locale";
import { FiMessageCircle, FiShare2, FiFlag, FiStar } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  API_BASE_URL,
  GetCurrentUserRoleName,
  SiteNameAR,
  SiteNameEN,
} from "../Utils/Constant";
import ReportListing from "../Components/ListingReport";
import { FaCheckCircle } from "react-icons/fa";
import { FaCrown, FaStar, FaRegStar, FaStore } from "react-icons/fa";
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
  const [userRating, setUserRating] = useState(0);
  const [ratingSummary, setRatingSummary] = useState(null);
  const [isLoadingRating, setIsLoadingRating] = useState(false);

  let userId = null;
  try {
    if (userToken) {
      const decoded = jwtDecode(userToken);
      userId = decoded.sub || decoded.userId || decoded.nameID || null;
    }
  } catch {
    navigate("/");
  }

  const fetchListing = async () => {
    const CurrentRole = GetCurrentUserRoleName(userToken);
    const lang = isArabic ? "ar" : "en";

    try {
      let data = null;
      if (CurrentRole === "Admin") {
        data = await fetchUnApprovedListingById(lang, id, userToken);
      } else {
        data = await fetchListingById(lang, id);
      }
      if (data) setListing(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id, isArabic, userToken]);

  // استخدام useCallback لتحسين الأداء ومنع إعادة التصيير غير الضروري
  const fetchRating = useCallback(async () => {
    if (!listing?.userId || !userToken) return;

    setIsLoadingRating(true);
    try {
      const summary = await getCustomerRating(listing.userId, userToken);
      if (summary) {
        setRatingSummary(summary);

        // إذا كان المستخدم قد قام بالتقييم مسبقاً، نعرض تقييمه
        if (summary.UserRating) {
          setUserRating(summary.UserRating);
        }
      }
    } catch (err) {
      console.error("فشل في جلب التقييمات:", err);
      toast.error(
        isArabic ? "فشل في تحميل التقييمات" : "Failed to load ratings"
      );
    } finally {
      setIsLoadingRating(false);
    }
  }, [listing?.userId, userToken, isArabic]);

  // useEffect لجلب التقييمات عندما يتوفر listing.userId
  useEffect(() => {
    if (listing?.userId && userToken) {
      fetchRating();
    }
  }, [listing?.userId, userToken, fetchRating]);

  // دالة معالجة إرسال التقييم
  const handleRatingSubmit = async (value) => {
    if (!listing?.userId) {
      toast.error(
        isArabic
          ? "لم يتم تحميل بيانات الإعلان بعد"
          : "Listing data not loaded yet"
      );
      return;
    }

    if (!userToken) {
      navigate("/Login", {
        state: {
          fromButton: isArabic ? "التقييم" : "Rating",
          GoTo: `/Listing/${id}`,
        },
      });
      return;
    }

    try {
      await upsertCustomerRating(listing.userId, value, userToken);
      setUserRating(value);
      toast.success(isArabic ? "تم التقييم بنجاح" : "Rating submitted!");

      // إعادة جلب التقييمات لتحديث المتوسط
      await fetchRating();
    } catch (err) {
      console.error("فشل في إرسال التقييم:", err);
      toast.error(
        isArabic ? "فشل في إرسال التقييم" : "Failed to submit rating"
      );
    }
  };

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
          text: shareText,
          url: shareUrl,
        })
        .catch(() => {
          navigator.clipboard.writeText(shareUrl);
          toast.success(isArabic ? "تم نسخ الرابط" : "Link copied", {
            position: "bottom-center",
            autoClose: 2000,
            hideProgressBar: true,
          });
        });
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success(isArabic ? "تم نسخ الرابط" : "Link copied", {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
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

  const getPriceAttribute = () => {
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
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, {
      addSuffix: true,
      locale: isArabic ? ar : enUS,
    });
  };

  const direction = isArabic ? "rtl" : "ltr";
  const isOwner = userId && listing.userId && userId === listing.userId;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title || "Product",
    description: listing.description || "وصف الإعلان غير متوفر حالياً.",
    image: images[0]?.imageUrl || [],
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
        <meta charSet="utf-8" />
        <title>{listing.title}</title>
        <meta
          name="description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta
          name="price"
          content={`${listing.price || getPriceAttribute()} AED`}
        />
        <link rel="canonical" href={window.location.href} />
        <meta property="og:title" content={listing.title} />
        <meta
          property="og:description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta property="og:image" content={images[0]?.imageUrl || ""} />
        <meta property="og:type" content="product" />
        <meta property="og:locale" content={isArabic ? "ar_AR" : "en_US"} />
        <meta
          property="product:price:amount"
          content={listing.price || getPriceAttribute()}
        />
        <meta property="product:price:currency" content="AED" />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={listing.title} />
        <meta
          name="twitter:description"
          content={listing.description || "وصف الإعلان غير متوفر حالياً."}
        />
        <meta name="twitter:image" content={images[0]?.imageUrl || ""} />
        <meta name="twitter:url" content={window.location.href} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div
        dir="ltr"
        className={`sticky top-0 z-50 ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        } border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}
      >
        <NavBar />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {/* بطاقة البائع مع زر التواصل */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`flex flex-col md:flex-row items-start justify-between p-5 rounded-2xl mb-8 ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
              : "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-md"
          }`}
        >
          {/* معلومات البائع */}
          <div className="flex items-start space-x-4 rtl:space-x-reverse w-full md:w-auto">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={
                    isOwner
                      ? localStorage.getItem("userImage") ||
                        "/default-avatar.png"
                      : listing.userImageUrl || "/default-avatar.png"
                  }
                  alt={isOwner ? "Your profile" : listing.ownerName}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl border-2 border-cyan-500/30"
                />
                {!isOwner && listing.userId === 23 && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
                    <FaCrown className="w-3 h-3" />
                  </div>
                )}
              </div>
              {!isOwner && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h3 className="font-bold text-lg">
                  {isOwner ? (
                    isArabic ? (
                      "أنت"
                    ) : (
                      "You"
                    )
                  ) : listing.userId === 23 ? (
                    <span className="flex items-center">
                      <FaCheckCircle className="text-blue-500 mr-1" />
                      {isArabic ? SiteNameAR : SiteNameEN}
                    </span>
                  ) : (
                    listing.ownerName
                  )}
                </h3>
                {listing.userId === 23 && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs flex items-center ${
                      isDarkMode
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <FaStore className="mr-1" />
                    {isArabic ? "متجر معتمد" : "Verified Store"}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="text-amber-500">
                      {star <= Math.round(ratingSummary?.averageRating || 0) ? (
                        <FaStar className="w-4 h-4" />
                      ) : (
                        <FaRegStar className="w-4 h-4" />
                      )}
                    </span>
                  ))}
                </div>
                {ratingSummary && (
                  <span
                    className={`text-sm ml-2 ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    ({ratingSummary.totalRatings || 0})
                  </span>
                )}
              </div>

              {!isOwner && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSendMessageClick}
                  className={`flex items-center space-x-2 rtl:space-x-reverse mt-3 py-2 px-4 rounded-xl ${
                    isDarkMode
                      ? "bg-cyan-700 hover:bg-cyan-600 text-white"
                      : "bg-cyan-500 hover:bg-cyan-600 text-white"
                  } shadow-md transition-all duration-200`}
                >
                  <FiMessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {isArabic ? "تواصل مع البائع" : "Contact Seller"}
                  </span>
                </motion.button>
              )}
            </div>
          </div>

          {/* التقييم والأزرار */}
          <div className="flex flex-col items-end mt-4 md:mt-0 w-full md:w-auto">
            <div
              className={`p-4 rounded-xl mb-4 w-full ${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-100"
              }`}
            >
              <h4 className="font-semibold text-sm mb-2 flex items-center">
                <FaStar className="text-amber-500 mr-1" />
                {isArabic ? "قيم هذا البائع" : "Rate this seller"}
              </h4>

              {isLoadingRating ? (
                <div className="text-center py-2">
                  <span className="text-gray-500 text-sm">
                    {isArabic ? "جاري التحميل..." : "Loading..."}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingSubmit(star)}
                        disabled={isOwner || !userToken}
                        className={`mx-1 text-2xl transition-transform ${
                          isOwner || !userToken
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:scale-125"
                        } ${
                          // التصحيح هنا: استخدام ratingSummary.UserRating بدلاً من userRating
                          (ratingSummary?.UserRating &&
                            ratingSummary.UserRating >= star) ||
                          userRating >= star
                            ? "text-amber-500"
                            : "text-gray-400"
                        }`}
                        title={
                          isOwner
                            ? isArabic
                              ? "لا يمكن تقييم نفسك"
                              : "Cannot rate yourself"
                            : !userToken
                            ? isArabic
                              ? "يجب تسجيل الدخول للتقييم"
                              : "Login to rate"
                            : ""
                        }
                      >
                        {/* استخدام أيقونات مختلفة للتمييز بين التقييم الحالي والتقييمات الأخرى */}
                        {(ratingSummary?.UserRating &&
                          ratingSummary.UserRating >= star) ||
                        userRating >= star ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {ratingSummary ? (
                        <div className="flex flex-col items-center">
                          {/* متوسط التقييم */}
                          <div className="flex items-center justify-center mb-1">
                            <div className="flex items-center bg-amber-500/10 px-3 py-1 rounded-full">
                              <FaStar className="text-amber-500 mr-1" />
                              <span className="font-semibold">
                                {ratingSummary.averageRating?.toFixed(1) || 0}
                                <span className="text-xs opacity-70">/5</span>
                              </span>
                            </div>

                            {/* عدد التقييمات */}
                            <span className="mx-2">•</span>
                            <span>
                              {ratingSummary.totalRatings || 0}{" "}
                              {isArabic ? "تقييم" : "ratings"}
                            </span>
                          </div>

                          {/* إظهار تقييم المستخدم إذا كان موجودًا */}
                          {ratingSummary.UserRating && (
                            <div
                              className={`mt-1 inline-flex items-center px-3 py-1 rounded-full ${
                                isDarkMode
                                  ? "bg-amber-900/30 text-amber-300"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              <FaCheckCircle className="mr-1" />
                              <span className="text-xs font-medium">
                                {isArabic ? "تقييمك: " : "Your rating: "}
                                {ratingSummary.UserRating}/5
                              </span>
                            </div>
                          )}
                        </div>
                      ) : isArabic ? (
                        <div className="flex items-center justify-center text-amber-600">
                          <FaRegStar className="mr-1" />
                          كن أول من يقيم
                        </div>
                      ) : (
                        <div className="flex items-center justify-center text-amber-600">
                          <FaRegStar className="mr-1" />
                          Be the first to rate
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* أزرار المشاركة والإبلاغ */}
            <div className="flex space-x-2 rtl:space-x-reverse self-center md:self-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShareClick}
                className={`p-3 rounded-xl flex items-center ${
                  isDarkMode
                    ? "bg-gray-700 hover:bg-gray-600 text-cyan-400"
                    : "bg-gray-100 hover:bg-gray-200 text-cyan-600"
                } transition-colors duration-200`}
                aria-label={isArabic ? "مشاركة" : "Share"}
              >
                <FiShare2 className="w-5 h-5" />
              </motion.button>

              {!isOwner && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleReportModal}
                  className={`p-3 rounded-xl flex items-center ${
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-red-400"
                      : "bg-gray-100 hover:bg-gray-200 text-red-500"
                  } transition-colors duration-200`}
                  aria-label={isArabic ? "الإبلاغ عن الإعلان" : "Report ad"}
                >
                  <FiFlag className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* باقي الكود بدون تغيير */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative mb-8 rounded-xl overflow-hidden shadow-lg"
        >
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex].imageUrl}
                alt={`Listing Image ${currentImageIndex + 1}`}
                className="w-full h-80 md:h-96 object-cover mb-4 rounded-xl transition-all duration-300"
              />

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

        <div className="flex space-x-2 rtl:space-x-reverse mb-6">
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
                  : getPriceAttribute() || "0 AED"}
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

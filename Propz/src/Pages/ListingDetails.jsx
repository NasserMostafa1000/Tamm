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
import {
  FiMessageCircle,
  FiShare2,
  FiFlag,
  FiStar,
  FiMapPin,
  FiCalendar,
  FiEye,
  FiHeart,
  FiDollarSign,
  FiCheckCircle,
  FiUser,
  FiClock,
} from "react-icons/fi";
import {
  IoShieldCheckmarkOutline,
  IoLocationOutline,
  IoTimeOutline,
  IoStarHalfOutline,
  IoArrowRedoOutline,
} from "react-icons/io5";
import {
  MdOutlineDescription,
  MdOutlinePriceChange,
  MdOutlineVerified,
  MdOutlineLocalOffer,
} from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import {
  addOrUpdateUserSearch,
  API_BASE_URL,
  GetCurrentUserRoleName,
  getOrCreateUserUUID,
  SiteNameAR,
  SiteNameEN,
} from "../Utils/Constant";
import ReportListing from "../Components/ListingReport";
import {
  FaCrown,
  FaStore,
  FaRegStar,
  FaStar,
  FaStarHalfAlt,
  FaWhatsapp,
  FaPhoneAlt,
  FaShareAlt,
  FaExclamationCircle,
} from "react-icons/fa";
import SellerCard from "../Components/sellerCard";
import ListingAttributes from "../Components/ListingAttributes";

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
  const [imageLoading, setImageLoading] = useState(true);
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
  } catch {}

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
    const saveSearch = async () => {
      try {
        const userUUID = getOrCreateUserUUID(); // هنا بناخد او نرجع نفس ال UUID
        await addOrUpdateUserSearch(userUUID, id); // ننده عالـ API ونضيف العملية
      } catch (error) {
        console.error("Error saving search:", error);
      }
    };

    if (id) {
      saveSearch();
    }
  }, [id]);
  useEffect(() => {
    fetchListing();
  }, [id, isArabic, userToken]);

  const fetchRating = useCallback(async () => {
    if (!listing?.userId || !userToken) return;

    setIsLoadingRating(true);
    try {
      const summary = await getCustomerRating(listing.userId, userToken);
      if (summary) {
        setRatingSummary(summary);
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

  useEffect(() => {
    if (listing?.userId && userToken) {
      fetchRating();
    }
  }, [listing?.userId, userToken, fetchRating]);

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

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
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
      className={`min-h-screen font-sans ${
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
        {/* Image Gallery with Modern Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 rounded-2xl overflow-hidden shadow-2xl"
        >
          {images.length > 0 ? (
            <>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex].imageUrl}
                    alt={`Listing Image ${currentImageIndex + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-80 md:h-96 object-cover"
                    onLoad={() => setImageLoading(false)}
                  />
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <IoArrowRedoOutline className="w-5 h-5 rotate-180" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200"
                    >
                      <IoArrowRedoOutline className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`w-3 h-3 rounded-full transition-all duration-200 ${
                        idx === currentImageIndex
                          ? "bg-white scale-125"
                          : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="p-4 bg-gradient-to-t from-black/10 to-transparent">
                <div className="flex overflow-x-auto space-x-3 pb-2 scrollbar-hide">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.imageUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-16 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all duration-200 flex-shrink-0 ${
                        idx === currentImageIndex
                          ? "border-cyan-400 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div
              className={`w-full h-80 md:h-96 flex flex-col items-center justify-center rounded-2xl ${
                isDarkMode ? "bg-gray-800" : "bg-gray-200"
              }`}
            >
              <FiEye className="w-16 h-16 mb-4 opacity-50" />
              <span
                className={`text-lg ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {isArabic ? "لا توجد صور متاحة" : "No images available"}
              </span>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center space-x-4 rtl:space-x-reverse mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareClick}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              isDarkMode
                ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                : "bg-cyan-500 hover:bg-cyan-600 text-white"
            } shadow-lg`}
          >
            <FaShareAlt className="w-4 h-4" />
            <span>{isArabic ? "مشاركة" : "Share"}</span>
          </motion.button>

          {!isOwner && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleReportModal}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                isDarkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              } shadow-lg`}
            >
              <FaExclamationCircle className="w-4 h-4" />
              <span>{isArabic ? "الإبلاغ" : "Report"}</span>
            </motion.button>
          )}
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`p-8 rounded-2xl mb-8 backdrop-blur-sm ${
            isDarkMode
              ? "bg-gray-800/80 border border-gray-700"
              : "bg-white/80 border border-gray-200"
          } shadow-2xl`}
        >
          {/* Header with Title and Price */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                {listing.title}
              </h1>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {listing.isVerified && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <MdOutlineVerified className="w-4 h-4 ml-1" />
                    {isArabic ? "موثوق" : "Verified"}
                  </span>
                )}
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <IoTimeOutline className="w-4 h-4 ml-1" />
                  {formatDate(listing.createdAt)}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <FiDollarSign className="w-6 h-6 text-green-500" />
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-cyan-400" : "text-cyan-600"
                  }`}
                >
                  {listing.price
                    ? `${listing.price} AED`
                    : getPriceAttribute() || "0 AED"}
                </p>
              </div>

              {listing.originalPrice && (
                <p className="text-lg line-through text-gray-500 mt-1">
                  {listing.originalPrice} AED
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <MdOutlineDescription
                className={`w-6 h-6 ${
                  isDarkMode ? "text-cyan-400" : "text-cyan-600"
                }`}
              />
              <h2
                className={`text-xl font-semibold ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {isArabic ? "الوصف" : "Description"}
              </h2>
            </div>
            <p
              className={`leading-relaxed text-lg ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {listing.description ||
                (isArabic ? "لا يوجد وصف متاح" : "No description available")}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-opacity-20 bg-cyan-500">
              <IoLocationOutline className="w-5 h-5 text-cyan-500" />
              <div>
                <p className="text-sm opacity-75">
                  {isArabic ? "الموقع" : "Location"}
                </p>
                <p className="font-semibold">
                  {listing.cityName}, {listing.placeName}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-opacity-20 bg-purple-500">
              <FiCalendar className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm opacity-75">
                  {isArabic ? "تاريخ النشر" : "Posted"}
                </p>
                <p className="font-semibold">{formatDate(listing.createdAt)}</p>
              </div>
            </div>

            {listing.categoryName && (
              <div className="flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg bg-opacity-20 bg-green-500">
                <MdOutlineLocalOffer className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm opacity-75">
                    {isArabic ? "الفئة" : "Category"}
                  </p>
                  <p className="font-semibold">{listing.categoryName}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Attributes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <ListingAttributes
            attributes={attributes}
            isDarkMode={isDarkMode}
            isArabic={isArabic}
          />
        </motion.div>
      </div>

      {/* Seller Card */}
      <SellerCard
        isDarkMode={isDarkMode}
        isArabic={isArabic}
        isOwner={isOwner}
        listing={listing}
        ratingSummary={ratingSummary}
        userRating={userRating}
        isLoadingRating={isLoadingRating}
        userToken={userToken}
        SiteNameAR={SiteNameAR}
        SiteNameEN={SiteNameEN}
        handleSendMessageClick={handleSendMessageClick}
        handleRatingSubmit={handleRatingSubmit}
        handleShareClick={handleShareClick}
        toggleReportModal={toggleReportModal}
      />

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`relative rounded-2xl p-6 max-w-md w-full ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <button
                onClick={toggleReportModal}
                className={`absolute top-4 ${
                  isArabic ? "left-4" : "right-4"
                } p-2 rounded-full ${
                  isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                } transition-colors`}
              >
                &times;
              </button>
              <ReportListing
                userId={userId}
                listingId={listing.listingId}
                onClose={() => setShowReportModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FinalListingDetails;

import React from "react";
import { motion } from "framer-motion";
import {
  FaCrown,
  FaCheckCircle,
  FaStar,
  FaRegStar,
  FaStore,
  FaWhatsapp,
  FaEnvelope,
  FaUserTie,
  FaShieldAlt,
  FaRocket,
} from "react-icons/fa";
import {
  FiMessageCircle,
  FiShare2,
  FiFlag,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";
import { TbRating14Plus } from "react-icons/tb";
import { API_BASE_URL } from "../Utils/Constant";

const SellerCard = ({
  isDarkMode,
  isArabic,
  isOwner,
  listing,
  ratingSummary,
  userRating,
  isLoadingRating,
  userToken,
  SiteNameAR,
  SiteNameEN,
  handleSendMessageClick,
  handleRatingSubmit,
  handleShareClick,
  toggleReportModal,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`flex flex-col md:flex-row items-start justify-between p-6 rounded-3xl mb-8 font-sans ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 shadow-2xl"
          : "bg-gradient-to-br from-white via-gray-50 to-white border border-gray-100 shadow-xl"
      }`}
      style={{
        fontFamily: "'Inter', 'Segoe UI', 'Tajawal', sans-serif",
      }}
    >
      {/* معلومات البائع - تصميم محسّن */}
      <div className="flex items-start space-x-4 rtl:space-x-reverse w-full md:w-auto">
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-lg">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={
                isOwner
                  ? localStorage.getItem("userImage") || "/default-avatar.png"
                  : listing.userImageUrl || "/default-avatar.png"
              }
              alt={isOwner ? "Your profile" : listing.ownerName}
              className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-3xl border-4 border-cyan-400/50"
            />
            {!isOwner && listing.userId === 23 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white p-2 rounded-full shadow-lg"
              >
                <FaCrown className="w-4 h-4" />
              </motion.div>
            )}
          </div>
          {!isOwner && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-1 right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-white dark:border-gray-900 rounded-full shadow-lg"
            ></motion.span>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center space-x-3 rtl:space-x-reverse mb-2">
            <h3 className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {isOwner ? (
                isArabic ? (
                  <span className="flex items-center">
                    <FaUserTie className="ml-2" />
                    أنت
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FaUserTie className="mr-2" />
                    You
                  </span>
                )
              ) : listing.userId === 23 ? (
                <span className="flex items-center">
                  <FaCheckCircle className="text-blue-500 mr-2" />
                  {isArabic ? SiteNameAR : SiteNameEN}
                </span>
              ) : (
                <span className="flex items-center">
                  <FiAward className="mr-2 text-amber-500" />
                  {listing.ownerName}
                </span>
              )}
            </h3>
            {listing.userId === 23 && (
              <motion.span
                whileHover={{ scale: 1.05 }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center shadow-md ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-900/50 to-cyan-900/50 text-blue-300 border border-blue-700/30"
                    : "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
                }`}
              >
                <FaStore className="mr-1.5" />
                {isArabic ? "متجر معتمد" : "Verified Store"}
              </motion.span>
            )}
          </div>

          {/* شريط التقييم المحسّن */}
          <div className="mt-3 flex items-center space-x-3">
            <div className="flex bg-gradient-to-r from-amber-400 to-yellow-400 p-1 rounded-full">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.span
                  key={star}
                  whileHover={{ scale: 1.2 }}
                  className="text-white mx-0.5"
                >
                  {star <= Math.round(ratingSummary?.averageRating || 0) ? (
                    <FaStar className="w-5 h-5 drop-shadow-lg" />
                  ) : (
                    <FaRegStar className="w-5 h-5 opacity-80" />
                  )}
                </motion.span>
              ))}
            </div>
            {ratingSummary && (
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {ratingSummary.totalRatings || 0}{" "}
                {isArabic ? "تقييم" : "ratings"}
              </span>
            )}
          </div>

          {/* أزرار التواصل - تصميم حديث */}
          <div className="flex flex-wrap gap-3 mt-4">
            {!isOwner && (
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSendMessageClick}
                className={`flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-5 rounded-2xl min-w-[140px] font-semibold shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-cyan-700 to-blue-700 hover:from-cyan-600 hover:to-blue-600 text-white"
                    : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
                }`}
              >
                <FiMessageCircle className="w-5 h-5" />
                <span className="text-sm">
                  {isArabic ? "مراسلة" : "Message"}
                </span>
              </motion.button>
            )}

            {listing.whastappNumber && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={`https://wa.me/${listing.whastappNumber.replace(
                  /\D/g,
                  ""
                )}?text=${encodeURIComponent(
                  isArabic
                    ? `مرحبًا، أود الاطلاع على الإعلان هذا: ${API_BASE_URL}Listings/share/listing?id=${listing.listingId}`
                    : `Hello, I would like to check this listing: ${API_BASE_URL}Listings/share/listing?id=${listing.listingId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-5 rounded-2xl min-w-[140px] font-semibold shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                }`}
              >
                <FaWhatsapp className="w-5 h-5" />
                <span className="text-sm">
                  {isArabic ? "واتساب" : "WhatsApp"}
                </span>
              </motion.a>
            )}

            {listing.emailAddress && (
              <motion.a
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${
                  listing.emailAddress
                }?subject=${encodeURIComponent(
                  isArabic ? `استفسار عن الإعلان` : `Inquiry about listing`
                )}&body=${encodeURIComponent(
                  isArabic
                    ? `مرحبًا،\n\nأود الاطلاع على الإعلان هذا: ${API_BASE_URL}Listings/share/listing?id=${listing.listingId}\n\nشكرًا لك.`
                    : `Hello,\n\nI would like to check this listing: ${API_BASE_URL}Listings/share/listing?id=${listing.listingId}\n\nThank you.`
                )}`}
                className={`flex items-center justify-center space-x-2 rtl:space-x-reverse py-3 px-5 rounded-2xl min-w-[140px] font-semibold shadow-lg transition-all duration-200 ${
                  isDarkMode
                    ? "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white"
                    : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                }`}
              >
                <FaEnvelope className="w-5 h-5" />
                <span className="text-sm">{isArabic ? "إيميل" : "Email"}</span>
              </motion.a>
            )}
          </div>
        </div>
      </div>

      {/* قسم التقييم والأزرار الجانبية */}
      <div className="flex flex-col items-end mt-6 md:mt-0 w-full md:w-auto space-y-4">
        {/* بطاقة التقييم المحسّنة */}
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          className={`p-5 rounded-2xl w-full min-w-[280px] border ${
            isDarkMode
              ? "bg-gradient-to-br from-gray-800 to-gray-900 border-amber-500/20"
              : "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
          } shadow-lg`}
        >
          <h4 className="font-bold text-lg mb-3 flex items-center justify-center">
            <TbRating14Plus className="text-amber-500 mr-2 text-xl" />
            {isArabic ? "قيم هذا البائع" : "Rate this seller"}
          </h4>

          {isLoadingRating ? (
            <div className="text-center py-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-2"
              ></motion.div>
              <span className="text-gray-500 text-sm">
                {isArabic ? "جاري التحميل..." : "Loading..."}
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRatingSubmit(star)}
                    disabled={isOwner || !userToken}
                    className={`mx-1 text-3xl transition-all duration-200 ${
                      isOwner || !userToken
                        ? "cursor-not-allowed opacity-40"
                        : "cursor-pointer hover:drop-shadow-lg"
                    } ${
                      (ratingSummary?.UserRating &&
                        ratingSummary.UserRating >= star) ||
                      userRating >= star
                        ? "text-amber-500 drop-shadow-lg"
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
                    {(ratingSummary?.UserRating &&
                      ratingSummary.UserRating >= star) ||
                    userRating >= star ? (
                      <FaStar />
                    ) : (
                      <FaRegStar />
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="text-center mt-3">
                <div
                  className={`text-sm font-semibold ${
                    isDarkMode ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  {ratingSummary ? (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex items-center justify-center space-x-3">
                        <div className="flex items-center bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
                          <FaStar className="mr-2" />
                          <span className="font-bold text-lg">
                            {ratingSummary.averageRating?.toFixed(1) || 0}
                            <span className="text-sm opacity-90">/5</span>
                          </span>
                        </div>
                        <div className="h-8 w-px bg-gray-400/30"></div>
                        <div className="text-center">
                          <div className="font-bold text-lg">
                            {ratingSummary.totalRatings || 0}
                          </div>
                          <div className="text-xs opacity-75">
                            {isArabic ? "تقييم" : "ratings"}
                          </div>
                        </div>
                      </div>
                      {ratingSummary.UserRating && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`inline-flex items-center px-4 py-2 rounded-full border ${
                            isDarkMode
                              ? "bg-amber-900/30 text-amber-300 border-amber-700/50"
                              : "bg-amber-100 text-amber-700 border-amber-300"
                          }`}
                        >
                          <FaCheckCircle className="mr-2" />
                          <span className="font-medium">
                            {isArabic ? "تقييمك: " : "Your rating: "}
                            {ratingSummary.UserRating}/5
                          </span>
                        </motion.div>
                      )}
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-2xl ${
                        isDarkMode
                          ? "bg-gray-700/50 text-amber-400"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      <FaRocket className="text-lg" />
                      <span>
                        {isArabic ? "كن أول من يقيم" : "Be the first to rate"}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* أزرار المشاركة والإبلاغ - تصميم حديث */}
        <div className="flex space-x-3 rtl:space-x-reverse self-center md:self-end">
          <motion.button
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleShareClick}
            className={`p-4 rounded-2xl flex items-center justify-center shadow-lg border ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-cyan-400 border-cyan-700/30"
                : "bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-cyan-600 border-cyan-200"
            } transition-all duration-200`}
            aria-label={isArabic ? "مشاركة" : "Share"}
          >
            <FiShare2 className="w-6 h-6" />
          </motion.button>

          {!isOwner && (
            <motion.button
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleReportModal}
              className={`p-4 rounded-2xl flex items-center justify-center shadow-lg border ${
                isDarkMode
                  ? "bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-red-400 border-red-700/30"
                  : "bg-gradient-to-br from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-red-500 border-red-200"
              } transition-all duration-200`}
              aria-label={isArabic ? "الإبلاغ عن الإعلان" : "Report ad"}
            >
              <FiFlag className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SellerCard;

import React, { useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { addToFavorites } from "../Services/Favorites";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingCart, FiMapPin } from "react-icons/fi";
import {
  RiHeartFill,
  RiHeartLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";

export default function AdPreview({ ad }) {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const token = localStorage.getItem("userToken");

  const handleAddFavorite = async (e) => {
    e.stopPropagation();

    if (!token) {
      setMessage(isArabic ? "يجب تسجيل الدخول أولاً" : "You must login first");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await addToFavorites(ad.listingId, token);
      setIsFavorite(true);
      setMessage(
        isArabic ? "تمت الإضافة للمفضلة بنجاح" : "Added to favorites!"
      );
    } catch (error) {
      setMessage(
        error.message ||
          (isArabic ? "حدث خطأ أثناء الإضافة" : "Error adding to favorites")
      );
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleClick = () => {
    navigate(`/Listing/${ad.listingId}`);
  };

  // ألوان مخصصة لكل وضع
  const themeStyles = {
    dark: {
      bg: "bg-gray-800",
      cardHover: "hover:bg-gray-700",
      text: "text-gray-100",
      secondaryText: "text-gray-400",
      icon: "text-gray-300",
      placeholderBg: "bg-gray-700",
      placeholderIcon: "text-gray-500",
      border: "border-gray-700",
      buttonBg: "bg-black/30 hover:bg-black/50",
      buttonText: "text-pink-400 hover:text-pink-300",
      price: "text-green-400",
      attributeName: "text-gray-300",
      attributeValue: "text-gray-400",
    },
    light: {
      bg: "bg-white",
      cardHover: "hover:bg-gray-50",
      text: "text-gray-800",
      secondaryText: "text-gray-600",
      icon: "text-gray-600",
      placeholderBg: "bg-gray-200",
      placeholderIcon: "text-gray-400",
      border: "border-gray-200",
      buttonBg: "bg-white/80 hover:bg-white",
      buttonText: "text-pink-500 hover:text-pink-600",
      price: "text-green-600",
      attributeName: "text-gray-600",
      attributeValue: "text-gray-500",
    },
  };

  const currentTheme = isDark ? themeStyles.dark : themeStyles.light;

  return (
    <motion.div
      onClick={handleClick}
      className={`relative rounded-xl overflow-hidden shadow-lg transition-all ${currentTheme.bg} ${currentTheme.cardHover} ${currentTheme.border} border cursor-pointer group`}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Favorite Button */}
      <button
        onClick={handleAddFavorite}
        disabled={loading}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm ${currentTheme.buttonBg} ${currentTheme.buttonText} transition-all duration-300 shadow-md`}
        aria-label={isArabic ? "إضافة للمفضلة" : "Add to favorites"}
      >
        {isFavorite ? (
          <RiHeartFill className="text-xl" />
        ) : (
          <RiHeartLine className="text-xl" />
        )}
      </button>

      {/* Status Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-14 right-3 px-3 py-1.5 rounded-full text-xs font-medium ${
              message.includes("نجاح") || message.includes("Added")
                ? "bg-green-500/90 text-white"
                : "bg-red-500/90 text-white"
            } shadow-md`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image */}
      <div className="relative overflow-hidden aspect-square">
        {ad.imageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${currentTheme.placeholderBg}`}
          >
            <FiShoppingCart
              className={`text-3xl ${currentTheme.placeholderIcon}`}
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white font-medium">
            {isArabic ? "عرض التفاصيل" : "View Details"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className={`font-semibold text-lg mb-2 line-clamp-2 ${currentTheme.text}`}
          title={ad.title}
        >
          {ad.title}
        </h3>

        {ad.price > 0 && (
          <div
            className={`flex items-center ${currentTheme.price} font-bold mb-3`}
          >
            <RiMoneyDollarCircleLine className="mr-1" />
            <span>{ad.price} AED</span>
          </div>
        )}

        <div className="space-y-2 text-sm">
          {ad.location && (
            <div className={`flex items-center ${currentTheme.secondaryText}`}>
              <FiMapPin className={`mr-1.5 ${currentTheme.icon}`} />
              <span className="line-clamp-1">{ad.location}</span>
            </div>
          )}

          {ad.firstAttributeName && (
            <div className="flex">
              <span
                className={`font-medium mr-1 ${currentTheme.attributeName}`}
              >
                {ad.firstAttributeName}:
              </span>
              <span className={currentTheme.attributeValue}>
                {ad.firstAttributeValue}
              </span>
            </div>
          )}

          {ad.secondAttributeName && (
            <div className="flex">
              <span
                className={`font-medium mr-1 ${currentTheme.attributeName}`}
              >
                {ad.secondAttributeName}:
              </span>
              <span className={currentTheme.attributeValue}>
                {ad.secondAttributeValue}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

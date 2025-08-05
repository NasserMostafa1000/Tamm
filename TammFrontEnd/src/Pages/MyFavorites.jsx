import React, { useEffect, useState } from "react";
import { getUserFavorites, deleteFavorite } from "../Services/MyFavorites";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiHeart, FiTrash2 } from "react-icons/fi";
import { RiHeartFill, RiHeartLine } from "react-icons/ri";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { useAuth } from "../Context/TokenContext";

export default function FavoriteListings() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const darkMode = mode === "dark";
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userToken } = useAuth();
  console.log(favorites);
  // كل الدوال والـ useEffect تبقى كما هي بدون تغيير
  const fetchFavorites = async () => {
    try {
      const response = await getUserFavorites(language, userToken);
      setFavorites(response);
    } catch (error) {
      console.error("Error loading favorites:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId) => {
    try {
      await deleteFavorite(favoriteId, userToken);
      setFavorites((prev) => prev.filter((f) => f.favoriteId !== favoriteId));
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [language]);

  if (loading) {
    return (
      <LoadingSpinner
        text={
          language === "العربية"
            ? "جاري تحميل المفضلة..."
            : "Loading favorites..."
        }
      />
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
            {language === "العربية"
              ? "إعلاناتي المفضلة"
              : "My Favorite Listings"}
          </h2>
          <p
            className={`mt-2 text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {language === "العربية"
              ? "كل الإعلانات التي حفظتها في قائمتك المفضلة"
              : "All ads you've saved to your favorites"}
          </p>
        </div>

        {/* Favorites Grid */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <RiHeartLine className="text-5xl text-gray-400 mb-4" />
            <p className="text-lg text-center">
              {language === "العربية"
                ? "لا يوجد إعلانات مفضلة بعد."
                : "No favorite ads yet."}
            </p>
            <button
              onClick={() => navigate("/")}
              className={`mt-4 px-6 py-2 rounded-full text-sm font-medium transition-all ${
                darkMode
                  ? "bg-pink-600 hover:bg-pink-700 text-white"
                  : "bg-pink-500 hover:bg-pink-600 text-white"
              } shadow-md hover:shadow-lg`}
            >
              {language === "العربية" ? "تصفح الإعلانات" : "Browse Listings"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((fav) => (
              <div
                key={fav.favoriteId}
                className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                  darkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                {/* Listing Image */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() => navigate(`/Listing/${fav.listingId}`)}
                >
                  <img
                    src={fav.imageUrl}
                    alt={language === "العربية" ? fav.titleAr : fav.titleEn}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">
                      {language === "العربية" ? "عرض التفاصيل" : "View Details"}
                    </span>
                  </div>
                </div>

                {/* Listing Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                    {language === "العربية" ? fav.titleAr : fav.titleEn}
                  </h3>
                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    } mb-2 line-clamp-2`}
                  >
                    {language === "العربية"
                      ? fav.descriptionAr
                      : fav.descriptionEn}
                  </p>
                  <p className="text-lg font-bold text-pink-500">
                    {fav.price} AED
                  </p>
                </div>

                {/* Remove Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFavorite(fav.favoriteId);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm ${
                    darkMode
                      ? "bg-black/30 hover:bg-black/50 text-pink-400 hover:text-pink-300"
                      : "bg-white/80 hover:bg-white text-pink-500 hover:text-pink-600"
                  } transition-all duration-300 shadow-md`}
                  aria-label={
                    language === "العربية"
                      ? "إزالة من المفضلة"
                      : "Remove favorite"
                  }
                >
                  <RiHeartFill className="text-xl" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

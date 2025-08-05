import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { API_BASE_URL, SiteNameAR, SiteNameEN } from "../Utils/Constant";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { addToFavorites } from "../Services/Favorites";
import { FiHeart, FiMapPin, FiDollarSign } from "react-icons/fi";
import { RiHeartFill, RiSearchLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "../Loader/LoadingSpinner";
import { Helmet } from "react-helmet";

export default function SearchingPage({ searchTerm: propSearchTerm }) {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isArabic = language === "العربية";
  const location = useLocation();
  const searchTerm = propSearchTerm || location.state?.searchTerm || "";
  const [ads, setAds] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState(null);
  const loadMoreRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const handleAddFavorite = async (e, listingId) => {
    e.stopPropagation();

    if (!token) {
      setFavoriteMessage(
        isArabic ? "يجب تسجيل الدخول أولاً" : "You must login first"
      );
      setTimeout(() => setFavoriteMessage(null), 3000);
      return;
    }

    setFavoriteLoading(true);
    setFavoriteMessage(null);

    try {
      await addToFavorites(listingId, token);
      setFavoriteMessage(
        isArabic ? "تمت الإضافة للمفضلة بنجاح" : "Added to favorites!"
      );
      setAds((prev) =>
        prev.map((ad) =>
          ad.listingId === listingId ? { ...ad, isFavorite: true } : ad
        )
      );
    } catch (error) {
      setFavoriteMessage(
        error.message ||
          (isArabic ? "حدث خطأ أثناء الإضافة" : "Error adding to favorites")
      );
    } finally {
      setFavoriteLoading(false);
      setTimeout(() => setFavoriteMessage(null), 3000);
    }
  };

  const handleClick = (listingId) => {
    navigate(`/Listing/${listingId}`);
  };

  useEffect(() => {
    setAds([]);
    setPageNumber(1);
    setHasMore(true);
  }, [searchTerm, language]);

  useEffect(() => {
    const fetchAds = async () => {
      if (!searchTerm || loading || !hasMore) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}Listings/Search?lang=${
            isArabic ? "ar" : "en"
          }&filterWith=${encodeURIComponent(
            searchTerm
          )}&pageNumber=${pageNumber}&pageSize=10`
        );
        const data = await response.json();

        if (data.listings?.length > 0) {
          setAds((prev) => [...prev, ...data.listings]);
          setHasMore(data.listings.length === 10);
        } else {
          setHasMore(false);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [language, searchTerm, pageNumber, isArabic]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPageNumber((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [hasMore, loading]);

  const pageTitle = isArabic
    ? `نتائج البحث عن "${searchTerm}" - ${SiteNameAR}`
    : `Search Results for "${searchTerm}" - ${SiteNameEN}`;

  const pageDescription = isArabic
    ? `عرض نتائج البحث عن "${searchTerm}" في ${SiteNameAR}. اكتشف إعلانات العقارات، السيارات، الوظائف والمزيد.`
    : `Showing search results for "${searchTerm}" on ${SiteNameEN}. Find ads for real estate, cars, jobs, and more.`;

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <Helmet>
        <html lang={isArabic ? "ar" : "en"} />
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: pageTitle,
            description: pageDescription,
            numberOfItems: ads.length,
            itemListElement: ads.map((ad, index) => ({
              "@type": "ListItem",
              position: index + 1,
              url: `${window.location.origin}/Listing/${ad.listingId}`,
              name: ad.title,
              image:
                ad.imageUrl || `${window.location.origin}/Images/default.jpg`,
              description: ad.description,
              offers: {
                "@type": "Offer",
                price: ad.price || "0",
                priceCurrency: "AED",
              },
            })),
          })}
        </script>
      </Helmet>

      <NavBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header - الجزء المعدل */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center mb-4">
            <RiSearchLine
              className={`text-3xl ${
                isDark ? "text-blue-400" : "text-blue-600"
              } mr-3`}
            />
            <h1
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {isArabic ? "نتائج البحث" : "Search Results"}
            </h1>
          </div>
          <p
            className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}
          >
            {isArabic
              ? `عرض النتائج لـ "${searchTerm}"`
              : `Showing results for "${searchTerm}"`}
          </p>
        </div>

        {/* Results Grid */}
        {ads.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div
              className={`mx-auto w-24 h-24 rounded-full ${
                isDark ? "bg-gray-700" : "bg-gray-200"
              } flex items-center justify-center mb-4`}
            >
              <RiSearchLine className="text-3xl text-gray-400" />
            </div>
            <h3
              className={`text-xl font-semibold mb-2 ${
                isDark ? "text-white" : "text-gray-800"
              }`}
            >
              {isArabic ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {isArabic
                ? "حاول استخدام كلمات بحث مختلفة"
                : "Try using different search terms"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ads.map((item) => (
              <motion.div
                key={item.listingId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer group ${
                  isDark ? "bg-gray-800" : "bg-white"
                }`}
                onClick={() => handleClick(item.listingId)}
              >
                {/* Favorite Button */}
                <button
                  onClick={(e) => handleAddFavorite(e, item.listingId)}
                  disabled={favoriteLoading}
                  className={`absolute top-3 right-3 z-10 p-2 rounded-full backdrop-blur-sm ${
                    isDark
                      ? "bg-black/30 hover:bg-black/50 text-pink-400 hover:text-pink-300"
                      : "bg-white/80 hover:bg-white text-pink-500 hover:text-pink-600"
                  } transition-all duration-300 shadow-md`}
                  aria-label={isArabic ? "إضافة للمفضلة" : "Add to favorites"}
                >
                  {item.isFavorite ? (
                    <RiHeartFill className="text-xl" />
                  ) : (
                    <FiHeart className="text-xl" />
                  )}
                </button>

                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imageUrl || "/Images/default.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium">
                      {isArabic ? "عرض التفاصيل" : "View Details"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3
                    className={`font-semibold text-lg mb-2 line-clamp-2 ${
                      isDark ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-sm mb-3 line-clamp-2 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {item.description}
                  </p>

                  {item.price && (
                    <div className="flex items-center text-green-500 font-bold mb-3">
                      <FiDollarSign className="mr-1" />
                      <span>
                        {item.price
                          ? `${item.price} AED`
                          : isArabic
                          ? "غير محدد"
                          : "Not specified"}
                      </span>
                    </div>
                  )}

                  {item.cityName && item.placeName && (
                    <div
                      className={`flex items-center text-sm ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <FiMapPin className="mr-1.5" />
                      <span className="line-clamp-1">
                        {item.cityName} - {item.placeName}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="mt-10 flex justify-center">
            <LoadingSpinner
              text={isArabic ? "جاري تحميل المزيد..." : "Loading more..."}
              darkMode={isDark}
            />
          </div>
        )}

        {/* Load More Trigger */}
        <div ref={loadMoreRef} className="h-10" />

        {/* Favorite Message */}
        <AnimatePresence>
          {favoriteMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`fixed bottom-6 right-6 px-4 py-2 rounded-full text-sm font-medium ${
                favoriteMessage.includes("نجاح") ||
                favoriteMessage.includes("Added")
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              } shadow-lg z-50`}
            >
              {favoriteMessage}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

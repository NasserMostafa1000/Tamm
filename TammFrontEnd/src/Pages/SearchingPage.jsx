import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { API_BASE_URL, SiteNameAR, SiteNameEN } from "../Utils/Constant";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { addToFavorites } from "../Services/Favorites";
import { FiHeart, FiMapPin, FiDollarSign, FiFilter } from "react-icons/fi";
import { RiHeartFill, RiSearchLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";
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
  const [min, setmin] = useState(0);
  const [max, setMax] = useState(999999999);
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
          )}&pageNumber=${pageNumber}&pageSize=10&min=${min}&max=${max}`
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
  }, [language, searchTerm, pageNumber, isArabic, min, max]);

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
        <html lang={isArabic ? "ar" : "en"} dir={isArabic ? "rtl" : "ltr"} />
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

      <div className="w-full" style={{ direction: "ltr" }}>
        <NavBar />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
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

        <div className="mb-8">
          <div
            className={`p-5 rounded-2xl shadow-lg ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            } border`}
          >
            <div className="flex items-center justify-between mb-5">
              <h3
                className={`text-xl font-bold flex items-center ${
                  isDark ? "text-white" : "text-gray-800"
                }`}
              >
                <FiFilter
                  className={`mr-2 ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                />
                {isArabic ? "تصفية النتائج" : "Filter Results"}
              </h3>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {ads.length} {isArabic ? "نتيجة" : "results"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Minimum Price */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {isArabic ? "السعر الأدنى (درهم)" : "Minimum Price (AED)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => {
                      const value = Math.max(
                        0,
                        e.target.value ? parseInt(e.target.value) : 0
                      );
                      setmin(value);
                      setAds([]);
                      setPageNumber(1);
                      setHasMore(true);
                    }}
                    min="0"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-800 border-gray-300"
                    }`}
                    placeholder={isArabic ? "0" : "0"}
                  />
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <FiDollarSign className="text-xl" />
                  </div>
                </div>
              </div>

              {/* Maximum Price */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {isArabic ? "السعر الأقصى (درهم)" : "Maximum Price (AED)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={max === 999999999 ? "" : max}
                    onChange={(e) => {
                      const value = e.target.value
                        ? parseInt(e.target.value)
                        : 999999999;
                      setMax(value);
                      setAds([]);
                      setPageNumber(1);
                      setHasMore(true);
                    }}
                    min="0"
                    className={`w-full px-4 py-3 pl-12 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      isDark
                        ? "bg-gray-700 text-white border-gray-600"
                        : "bg-gray-50 text-gray-800 border-gray-300"
                    }`}
                    placeholder={isArabic ? "لا حد" : "No limit"}
                  />
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <FiDollarSign className="text-xl" />
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setmin(0);
                    setMax(999999999);
                    setAds([]);
                    setPageNumber(1);
                    setHasMore(true);
                  }}
                  className={`w-full py-3 rounded-xl font-medium transition-colors ${
                    isDark
                      ? "bg-gray-700 text-white hover:bg-gray-600 border border-gray-600"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300"
                  }`}
                >
                  {isArabic ? "إعادة الضبط" : "Reset Filters"}
                </button>
              </div>
            </div>

            {/* Range Slider */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  0 AED
                </span>
                <span
                  className={`text-sm font-medium ${
                    isDark ? "text-blue-400" : "text-blue-600"
                  }`}
                >
                  {max === 999999999
                    ? isArabic
                      ? "لا حد"
                      : "No limit"
                    : `${max.toLocaleString()} AED`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10000000"
                value={max === 999999999 ? 10000000 : Math.min(max, 10000000)}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setMax(value === 10000000 ? 999999999 : value);
                  setAds([]);
                  setPageNumber(1);
                  setHasMore(true);
                }}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
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

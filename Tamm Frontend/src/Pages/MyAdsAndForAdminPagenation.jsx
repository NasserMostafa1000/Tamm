import React, { useEffect, useState } from "react";
import { getMyListings, deleteListing } from "../Services/MyAds";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/TokenContext";
import { useNavigate } from "react-router-dom";
import { GetCurrentUserId } from "../Utils/Constant";
import { useLocation } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye, FiFilter } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function MyListings() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { userToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // 'all', 'published', 'suspended', 'under-review'
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userIdFromState = location.state?.userId;
  const isArabic = language === "العربية";

  useEffect(() => {
    async function loadListings() {
      const userIdToUse = userIdFromState || GetCurrentUserId(userToken);

      try {
        const data = await getMyListings(
          isArabic ? "ar" : "en",
          userToken,
          userIdToUse
        );
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [language, userToken, location.state, isArabic, userIdFromState]);

  // تطبيق الفلتر عند تغيير activeFilter أو listings
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredListings(listings);
    } else {
      const filtered = listings.filter((item) => {
        const status = getListingStatus(item);

        if (activeFilter === "published") {
          return status.text === (isArabic ? "منشور" : "Published");
        } else if (activeFilter === "suspended") {
          return status.text.includes(isArabic ? "معلق" : "Suspended");
        } else if (activeFilter === "under-review") {
          return status.text === (isArabic ? "تحت المراجعة" : "Under Review");
        }
        return true;
      });

      setFilteredListings(filtered);
    }
  }, [activeFilter, listings, isArabic]);

  async function handleDelete(listingId, event) {
    event.stopPropagation();
    if (
      !window.confirm(
        isArabic ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?"
      )
    )
      return;

    try {
      setDeletingId(listingId);
      await deleteListing(listingId, userToken);
      setListings((prev) =>
        prev.filter((item) => item.listingId !== listingId)
      );
    } catch {
      alert(isArabic ? "فشل حذف الإعلان" : "Failed to delete ad");
    } finally {
      setDeletingId(null);
    }
  }

  function handleCardClick(listingId) {
    navigate(`/Listing/${listingId}`);
  }

  function handleEditListing(e, listingId) {
    navigate(`/EditListing/${listingId}`);
  }

  // دالة لتحديد حالة الإعلان
  function getListingStatus(item) {
    if (item.isApproved === "منشور") {
      return {
        text: isArabic ? "منشور" : "Published",
        color: "text-green-500",
        bgColor: "bg-green-100",
        darkBgColor: "bg-green-900/20",
        borderColor: "border-green-300",
        type: "published",
      };
    }

    if (item.isApproved === "غير منشور" && !item.isAbleToiditedReason) {
      return {
        text: isArabic ? "تحت المراجعة" : "Under Review",
        color: "text-yellow-500",
        bgColor: "bg-yellow-100",
        darkBgColor: "bg-yellow-900/20",
        borderColor: "border-yellow-300",
        type: "under-review",
      };
    }

    if (item.isApproved === "غير منشور" && item.isAbleToiditedReason) {
      return {
        text: isArabic
          ? `معلق: ${item.isAbleToiditedReason}`
          : `Suspended: ${item.isAbleToiditedReason}`,
        color: "text-red-500",
        bgColor: "bg-red-100",
        darkBgColor: "bg-red-900/20",
        borderColor: "border-red-300",
        type: "suspended",
      };
    }

    return {
      text: "",
      color: "",
      bgColor: "",
      darkBgColor: "",
      borderColor: "",
      type: "unknown",
    };
  }

  // إحصائيات الحالات
  const statusStats = {
    all: listings.length,
    published: listings.filter(
      (item) => getListingStatus(item).type === "published"
    ).length,
    suspended: listings.filter(
      (item) => getListingStatus(item).type === "suspended"
    ).length,
    "under-review": listings.filter(
      (item) => getListingStatus(item).type === "under-review"
    ).length,
  };

  if (loading) {
    return (
      <LoadingSpinner
        text={isArabic ? "جارٍ التحميل..." : "Loading..."}
        darkMode={isDark}
      />
    );
  }

  if (!listings.length) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center p-8 max-w-md">
          <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
            <RiMoneyDollarCircleLine className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {isArabic ? "لا توجد إعلانات" : "No ads found"}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {isArabic
              ? "يمكنك البدء بإضافة إعلان جديد الآن"
              : "You can start by adding a new ad now"}
          </p>
          <button
            onClick={() => navigate("/PostAd")}
            className={`px-6 py-2 rounded-full font-medium ${
              isDark
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white transition-all shadow-md hover:shadow-lg`}
          >
            {isArabic ? "إضافة إعلان جديد" : "Add New ad"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            {userIdFromState
              ? isArabic
                ? "إعلانات المستخدم"
                : "User's ads"
              : isArabic
              ? "إعلاناتي"
              : "My ads"}
          </h2>
          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {isArabic
              ? "إدارة جميع إعلاناتك في مكان واحد"
              : "Manage all your ads in one place"}
          </p>
        </div>

        {/* Filters Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark ? "bg-gray-800" : "bg-white"
                } border ${
                  isDark ? "border-gray-700" : "border-gray-200"
                } shadow-sm`}
              >
                <FiFilter className="text-lg" />
                <span>{isArabic ? "تصفية" : "Filter"}</span>
              </button>

              {/* Filter pills for quick access */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeFilter === "all"
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "الكل" : "All"} ({statusStats.all})
                </button>
                <button
                  onClick={() => setActiveFilter("published")}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeFilter === "published"
                      ? "bg-green-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "منشور" : "Published"} ({statusStats.published})
                </button>
                <button
                  onClick={() => setActiveFilter("under-review")}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeFilter === "under-review"
                      ? "bg-yellow-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "تحت المراجعة" : "Under Review"} (
                  {statusStats["under-review"]})
                </button>
                <button
                  onClick={() => setActiveFilter("suspended")}
                  className={`px-3 py-1 text-sm rounded-full transition-all ${
                    activeFilter === "suspended"
                      ? "bg-red-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "معلق" : "Suspended"} ({statusStats.suspended})
                </button>
              </div>
            </div>

            <div className="text-sm">
              <span className={isDark ? "text-gray-400" : "text-gray-500"}>
                {isArabic ? "عرض" : "Showing"} {filteredListings.length}{" "}
                {isArabic ? "من" : "of"} {listings.length}{" "}
                {isArabic ? "إعلان" : "ads"}
              </span>
            </div>
          </div>

          {/* Expanded filters for mobile */}
          {showFilters && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                isDark ? "bg-gray-800" : "bg-white"
              } border ${
                isDark ? "border-gray-700" : "border-gray-200"
              } shadow-sm`}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setActiveFilter("all")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    activeFilter === "all"
                      ? isDark
                        ? "bg-blue-600 text-white"
                        : "bg-blue-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "الكل" : "All"} ({statusStats.all})
                </button>
                <button
                  onClick={() => setActiveFilter("published")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    activeFilter === "published"
                      ? "bg-green-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "منشور" : "Published"} ({statusStats.published})
                </button>
                <button
                  onClick={() => setActiveFilter("under-review")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    activeFilter === "under-review"
                      ? "bg-yellow-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "تحت المراجعة" : "Under Review"} (
                  {statusStats["under-review"]})
                </button>
                <button
                  onClick={() => setActiveFilter("suspended")}
                  className={`px-3 py-2 text-sm rounded-lg transition-all ${
                    activeFilter === "suspended"
                      ? "bg-red-500 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {isArabic ? "معلق" : "Suspended"} ({statusStats.suspended})
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((item) => {
            const status = getListingStatus(item);

            return (
              <div
                key={item.listingId}
                className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                  isDark ? "bg-gray-800" : "bg-white"
                } flex flex-col relative`}
              >
                {/* Status Badge - Positioned at top right */}
                {/* Status Badge - Positioned at top right */}
                <div className="absolute top-3 right-3 z-10">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium border shadow-md
      ${status.borderColor} 
      ${isDark ? status.darkBgColor : status.bgColor} 
      ${status.color}
      backdrop-blur-sm`}
                    style={{ minWidth: "70px", textAlign: "center" }}
                    title={status.text}
                  >
                    {status.text.split(":")[0]}
                    {status.type === "suspended" &&
                      status.text.split(":")[1] && (
                        <div className="text-[10px] mt-1 truncate">
                          {status.text.split(":")[1].trim()}
                        </div>
                      )}
                  </div>
                </div>

                {/* Image with overlay */}
                <div
                  className="relative group cursor-pointer"
                  onClick={() => handleCardClick(item.listingId)}
                >
                  <img
                    src={item.imageUrl || "/no-image.png"}
                    alt={item.title}
                    className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-medium flex items-center">
                      <FiEye className="mr-1" />
                      {isArabic ? "عرض التفاصيل" : "View Details"}
                    </span>
                  </div>
                </div>

                {/* Listing Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3
                    className="font-semibold text-lg mb-2 line-clamp-2"
                    title={item.title}
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

                  <div className="flex items-center text-sm mb-3">
                    <IoLocationOutline className="mr-1 text-gray-400" />
                    <span
                      className={`${
                        isDark ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {item.cityName} - {item.placeName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-blue-500 font-bold text-lg flex items-center">
                      <RiMoneyDollarCircleLine className="mr-1" />
                      {item.price} AED
                    </p>

                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => handleDelete(item.listingId, e)}
                        disabled={deletingId === item.listingId}
                        className={`p-2 rounded-full ${
                          isDark
                            ? "bg-gray-700 hover:bg-gray-600 text-red-400"
                            : "bg-red-50 hover:bg-red-100 text-red-500"
                        } transition-colors disabled:opacity-50`}
                        title={isArabic ? "حذف" : "Delete"}
                      >
                        {deletingId === item.listingId ? (
                          <div className="animate-spin h-4 w-4 border-t-2 border-b-2 border-red-500 rounded-full"></div>
                        ) : (
                          <FiTrash2 />
                        )}
                      </button>
                      <button
                        onClick={(e) => handleEditListing(e, item.listingId)}
                        className={`p-2 rounded-full ${
                          isDark
                            ? "bg-gray-700 hover:bg-gray-600 text-white"
                            : "bg-gray-50 hover:bg-gray-100 text-gray-500"
                        }`}
                        title={isArabic ? "تعديل" : "Edit"}
                      >
                        <FiEdit />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state when no results match filter */}
        {filteredListings.length === 0 && listings.length > 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
              <FiFilter className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {isArabic ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {isArabic
                ? "لا توجد إعلانات تطابق الفلتر المحدد"
                : "No ads match the selected filter"}
            </p>
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium ${
                isDark
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {isArabic ? "عرض جميع الإعلانات" : "Show all ads"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

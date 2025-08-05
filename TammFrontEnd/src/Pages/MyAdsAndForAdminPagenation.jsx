import React, { useEffect, useState } from "react";
import { getMyListings, deleteListing } from "../Services/MyAds";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/TokenContext";
import { useNavigate } from "react-router-dom";
import { GetCurrentUserId } from "../Utils/Constant";
import { useLocation } from "react-router-dom";
import { FiTrash2, FiEdit, FiEye } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoLocationOutline } from "react-icons/io5";
import LoadingSpinner from "../Loader/LoadingSpinner";

export default function MyListings() {
  const { language } = useLanguage();
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const { userToken } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadListings();
  }, [language, userToken, location.state, isArabic, userIdFromState]);

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
    e.stopPropagation();
    navigate(`/EditListing/${listingId}`);
  }

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
        <div className="text-center mb-12">
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

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((item) => (
            <div
              key={item.listingId}
              className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl ${
                isDark ? "bg-gray-800" : "bg-white"
              } flex flex-col`}
            >
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
                    className={`${isDark ? "text-gray-300" : "text-gray-600"}`}
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
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Components/FavoriteButton.jsx

import React, { useState } from "react";
import { addToFavorites } from "../Services/Favorites";
import { useLanguage } from "../Context/LangContext";

export default function FavoriteButton({ listingId }) {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleAddFavorite = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("userToken");

    if (!token) {
      setMessage(isArabic ? "يجب تسجيل الدخول أولاً" : "You must login first");
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      await addToFavorites(listingId, token);
      setMessage(isArabic ? "تمت الإضافة للمفضلة" : "Added to favorites!");
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

  return (
    <>
      <button
        onClick={handleAddFavorite}
        disabled={loading}
        className={`absolute top-3 right-3 z-10 px-2 py-1 rounded bg-teal-500 text-white text-xs font-semibold shadow-md hover:bg-teal-600 transition
          ${loading ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {loading
          ? isArabic
            ? "جاري الإضافة..."
            : "Adding..."
          : isArabic
          ? "أضف للمفضلة"
          : "Add to Favorites"}
      </button>

      {message && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black text-white text-sm py-1 px-3 rounded shadow-lg">
          {message}
        </div>
      )}
    </>
  );
}

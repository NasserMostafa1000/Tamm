import React, { useEffect, useState, useRef, useCallback } from "react";
import { fetchAdsPreview } from "../Services/Ad";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { useLocationContext } from "../Context/LocationProvider";
import AdPreview from "../Components/AdPreveiw";
import { useNavigate } from "react-router-dom";

function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function AdsDiv({ filterWith }) {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const { isDarkMode } = useTheme();
  const { currentPlace } = useLocationContext();
  const [ads, setAds] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const adsContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (filterWith || currentPlace) {
      fetchAdsPreview(isArabic ? "ar" : "en", filterWith, currentPlace).then(
        setAds
      );
    }
  }, [filterWith, isArabic, currentPlace]);

  const checkScroll = useCallback(() => {
    const container = adsContainerRef.current;
    if (!container) return;

    let scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const scrollEnd = Math.max(scrollWidth - clientWidth, 1);

    if (isArabic) {
      scrollLeft = Math.abs(scrollLeft);
    }

    const margin = clientWidth * 0.2;
    const isNearEnd = scrollLeft >= scrollEnd - margin;

    setShowButton((prev) => (prev !== isNearEnd ? isNearEnd : prev));
  }, [isArabic]);

  const debouncedCheckScroll = useCallback(debounce(checkScroll, 100), [
    checkScroll,
  ]);

  useEffect(() => {
    const container = adsContainerRef.current;
    if (!container) return;

    checkScroll();

    container.addEventListener("scroll", debouncedCheckScroll, {
      passive: true,
    });
    window.addEventListener("resize", checkScroll);

    return () => {
      container.removeEventListener("scroll", debouncedCheckScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [ads, debouncedCheckScroll, checkScroll]);

  const handleViewMore = () => {
    navigate("/ViewMore", { state: { searchTerm: filterWith } });
  };

  return (
    <div className="w-full py-6">
      <div
        className={`flex items-center relative flex-col ${
          isArabic ? "items-end" : "items-start"
        }`}
      >
        <div
          ref={adsContainerRef}
          className="flex overflow-x-auto gap-6 p-4 w-full scrollbar"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: isDarkMode ? "#4a5568 #2d3748" : "#c1c1c1 #f1f1f1",
            direction: isArabic ? "rtl" : "ltr",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {ads.map((ad) => (
            <div key={ad.listingId} className="flex-shrink-0 w-[300px]">
              <AdPreview ad={ad} />
            </div>
          ))}
        </div>

        {/* زر عرض المزيد في المنتصف أسفل الديف */}
        {ads.length > 0 && (
          <div className="mt-6 flex justify-center w-full">
            <button
              onClick={handleViewMore}
              className={`px-6 py-2 rounded-full font-medium shadow-md whitespace-nowrap ${
                isDarkMode
                  ? "bg-white text-gray-800 hover:bg-gray-200"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {isArabic ? "عرض المزيد" : "View More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

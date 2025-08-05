import React, { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { useTheme } from "../Context/ThemeContext";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const bgImages = [
  "/ProjectsImages/Uae1.jpeg",
  "/ProjectsImages/uae4.jpg",
  "/ProjectsImages/uae6.jpeg",
];

// استخدم hook خارجي لاستقبال كويري باراميتر
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchBar({ onSearch, suggestions = [] }) {
  const { language } = useLanguage();
  const isArabic = language === "العربية";
  const { mode } = useTheme();
  const isDarkMode = mode === "dark";

  const queryParams = useQuery();
  const searchTermFromUrl = queryParams.get("search") || "";

  // state لحقول البحث (input)
  const [query, setQuery] = useState(searchTermFromUrl);

  const [bgIndex, setBgIndex] = useState(0);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  // تحديث قيمة البحث لو تغيرت في الـ URL (مثلاً لو المستخدم رجع أو شارك رابط)
  useEffect(() => {
    setQuery(searchTermFromUrl);
  }, [searchTermFromUrl]);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed) onSearch(trimmed);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // تغيير خلفية الصورة كل 5 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // فلترة الاقتراحات بناءً على النص المكتوب
  useEffect(() => {
    const handler = setTimeout(() => {
      const normalizedQuery = query.trim();

      if (normalizedQuery === "") {
        setFilteredSuggestions([]);
      } else {
        const matched = suggestions.filter((s) => {
          const queryLower = normalizedQuery.toLowerCase();
          const suggestionLower = s.label.toLowerCase();
          return suggestionLower.includes(queryLower);
        });
        setFilteredSuggestions(matched);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query, suggestions]);

  // أنيميشن الكتابة والمسح للـ placeholder
  useEffect(() => {
    if (suggestions.length === 0) return;

    const currentSuggestion = suggestions[placeholderIndex]?.label || "";

    let timeout;

    if (isTyping) {
      if (displayText.length < currentSuggestion.length) {
        timeout = setTimeout(() => {
          setDisplayText(
            currentSuggestion.substring(0, displayText.length + 1)
          );
        }, 100); // سرعة الكتابة
      } else {
        timeout = setTimeout(() => setIsTyping(false), 1500); // انتظار بعد اكتمال الكتابة
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 50); // سرعة المسح
      } else {
        setIsTyping(true);
        setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, placeholderIndex, suggestions]);

  // تغيير الاقتراح كل 5 ثواني (بعد اكتمال دورة الكتابة والمسح)
  useEffect(() => {
    if (suggestions.length === 0) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % suggestions.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [suggestions]);

  // إنشاء النص المتحرك للـ placeholder
  const renderAnimatedPlaceholder = () => {
    if (suggestions.length === 0) {
      return (
        <span className="text-gray-400">
          {isArabic ? "ابحث عن أي شيء..." : "Search for anything..."}
        </span>
      );
    }

    const baseText = isArabic ? "ابحث عن " : "Search for ";

    return (
      <div className="flex items-center gap-2">
        <span>{baseText}</span>
        <div className="relative">
          <span
            className={`min-w-[120px] inline-block ${
              isArabic ? "text-right" : "text-left"
            }`}
            style={{
              color: isDarkMode ? "#a78bfa" : "#3b82f6",
              fontWeight: "500",
              paddingRight: isTyping ? "8px" : "0",
            }}
          >
            {displayText}
            {isTyping && (
              <span
                className={`absolute top-1/2 -translate-y-1/2 ${
                  isArabic ? "left-0" : "right-0"
                } w-0.5 h-5 ${
                  isDarkMode ? "bg-purple-400" : "bg-blue-500"
                } animate-blink`}
              />
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className="w-full h-[80vh] bg-fixed bg-cover flex flex-col justify-center items-center 
         m-0 p-0 border-none rounded-none animate-fade-in duration-1000"
      style={{
        backgroundImage: `url(${bgImages[bgIndex]})`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        transition: "background-image 1s ease-in-out",
      }}
    >
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
      `}</style>

      <div className="relative flex flex-col items-center w-full max-w-xl px-4">
        <div
          className={`flex items-center px-5 py-3 rounded-2xl shadow-lg border-2 focus-within:ring-2 w-full transition-colors duration-300 ${
            isDarkMode
              ? "bg-black bg-opacity-60 text-white border-gray-600 ring-purple-500"
              : "bg-white bg-opacity-80 text-black border-gray-300 ring-blue-400"
          }`}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder=" "
            className={`flex-grow outline-none text-base px-2 bg-transparent ${
              isDarkMode ? "text-white" : "text-black"
            }`}
            dir={isArabic ? "rtl" : "ltr"}
          />

          {/* العنصر المخصص للـ placeholder */}
          <div
            className={`absolute pointer-events-none flex items-center ${
              query ? "opacity-0" : "opacity-80"
            } transition-opacity duration-200 ${
              isArabic ? "right-16" : "left-16"
            }`}
            style={{
              width: "calc(100% - 80px)",
              direction: isArabic ? "rtl" : "ltr",
            }}
          >
            {renderAnimatedPlaceholder()}
          </div>

          <div className="w-8 flex justify-center">
            <FaSearch
              className={`cursor-pointer text-xl hover:scale-110 transition-transform duration-200 ${
                isDarkMode ? "text-purple-300" : "text-blue-500"
              }`}
              onClick={handleSearch}
            />
          </div>
        </div>

        {/* الاقتراحات أثناء الكتابة */}
        {filteredSuggestions.length > 0 && (
          <div
            className={`mt-2 w-full rounded-xl shadow-lg overflow-hidden z-10 absolute top-full ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            {filteredSuggestions.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setQuery(item.label);
                  onSearch(item.label);
                }}
                className={`px-4 py-3 cursor-pointer text-sm border-b last:border-b-0 transition-colors duration-200 flex items-center gap-3 ${
                  isDarkMode
                    ? "hover:bg-gray-700 text-white border-gray-700"
                    : "hover:bg-gray-100 text-gray-800 border-gray-100"
                }`}
              >
                <FaSearch className="text-xs opacity-70 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

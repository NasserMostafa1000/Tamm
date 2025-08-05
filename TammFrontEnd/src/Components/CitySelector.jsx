import { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { fetchCities } from "../Services/PostAd.js";

export default function CitySelector({ onCitySelect }) {
  const { language } = useLanguage();
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCityId, setSelectedCityId] = useState(null);

  useEffect(() => {
    const getCities = async () => {
      setLoading(true);
      try {
        const data = await fetchCities(language);
        setCities(data);
      } catch (error) {
        console.error(error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    getCities();
  }, [language]);

  const handleSelect = (city) => {
    setSelectedCityId(city.id);
    onCitySelect(city);
  };

  const isArabic = language === "العربية";

  return (
    <div
      className={`w-full max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 ${
        isArabic ? "text-right" : "text-left"
      }`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <h1 className="text-2xl font-bold mb-3">
        {isArabic
          ? "في أي إمارة ترغب في نشر إعلانك؟"
          : "Which Emirate do you want to post your ad?"}
      </h1>
      <h2 className="mb-5 text-lg font-semibold text-yellow-600 dark:text-yellow-400 select-none">
        {isArabic ? "اختر الإمارة" : "Select City"}
      </h2>

      {loading ? (
        <p className="text-center text-yellow-500 dark:text-yellow-300 animate-pulse">
          {isArabic ? "جاري تحميل المدن..." : "Loading cities..."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {cities.map((city) => (
            <button
              key={city.id}
              onClick={() => handleSelect(city)}
              className={`p-5 rounded-2xl border-2 font-semibold text-center transition-shadow duration-300 shadow-sm
                ${
                  selectedCityId === city.id
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-yellow-400"
                    : "bg-white dark:bg-gray-900 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:shadow-yellow-300 hover:border-yellow-400"
                }
              `}
            >
              {city.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

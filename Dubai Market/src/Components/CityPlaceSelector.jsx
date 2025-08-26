import { useEffect, useState } from "react";
import { useLanguage } from "../Context/LangContext";
import { fetchCityPlaces, addNewPlace } from "../Services/PostAd.js";

export default function CityPlaceSelector({
  cityId,
  cityName,
  onPlaceSelect,
  setCityPlaceId,
}) {
  const { language } = useLanguage();
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [placeNameAr, setPlaceNameAr] = useState("");
  const [placeNameEn, setPlaceNameEn] = useState("");

  const isArabic = language === "العربية";

  useEffect(() => {
    if (!cityId) return;

    const loadPlaces = async () => {
      setLoading(true);
      try {
        const data = await fetchCityPlaces(language, cityName);
        setPlaces(data);
      } catch (err) {
        console.error("Error loading places:", err);
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [cityId, cityName, language]);

  const handleSelectPlace = (placeName, CityPlaceId) => {
    setCityPlaceId(CityPlaceId);
    setSelectedPlace(placeName);
    onPlaceSelect(placeName);
  };

  const handleAddPlace = async () => {
    if (!placeNameAr || !placeNameEn) return;

    const { success, error } = await addNewPlace({
      cityId,
      placeNameAr,
      placeNameEn,
    });

    if (success) {
      const newPlaceName = isArabic ? placeNameAr : placeNameEn;

      setPlaces((prev) => [
        ...prev,
        {
          placeName: newPlaceName,
          cityId,
          cityName,
        },
      ]);
      setSelectedPlace(newPlaceName);
      onPlaceSelect(newPlaceName);
      setPlaceNameAr("");
      setPlaceNameEn("");
      setShowAddForm(false);
    } else {
      alert(error || "Error adding place");
    }
  };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className={`w-full max-w-3xl mx-auto mt-6 px-4 sm:px-6 lg:px-8 ${
        isArabic ? "text-right" : "text-left"
      }`}
    >
      <label className="block mb-4 text-lg font-semibold text-yellow-600 dark:text-yellow-400 select-none">
        {isArabic ? "اختر المكان" : "Select Place"}
      </label>

      {loading ? (
        <p className="text-center text-yellow-500 dark:text-yellow-300 animate-pulse">
          {isArabic ? "جاري التحميل..." : "Loading..."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {places.map((place, index) => (
            <button
              key={index}
              onClick={() =>
                handleSelectPlace(place.placeName, place.cityPlaceId)
              }
              className={`p-4 rounded-2xl border-2 font-semibold text-center transition-shadow duration-300 shadow-sm
                ${
                  selectedPlace === place.placeName
                    ? "bg-yellow-500 border-yellow-500 text-white shadow-yellow-400"
                    : "bg-white dark:bg-gray-900 border-yellow-300 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 hover:shadow-yellow-300 hover:border-yellow-400"
                }
              `}
            >
              {place.placeName}
            </button>
          ))}
        </div>
      )}

      <button
        className="mt-5 text-yellow-600 dark:text-yellow-400 underline hover:text-yellow-800 dark:hover:text-yellow-300 transition"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {isArabic ? "إضافة مكان جديد" : "Add New Place"}
      </button>

      {showAddForm && (
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900 p-6 rounded-xl space-y-5 shadow-lg">
          <input
            type="text"
            placeholder={
              isArabic
                ? "أدخل اسم المكان باللغة العربية"
                : "Enter place name in Arabic"
            }
            value={placeNameAr}
            onChange={(e) => setPlaceNameAr(e.target.value)}
            className="w-full p-3 rounded border border-yellow-400 dark:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
          />

          <input
            type="text"
            placeholder={
              isArabic
                ? "أدخل اسم المكان باللغة الإنجليزية"
                : "Enter place name in English"
            }
            value={placeNameEn}
            onChange={(e) => setPlaceNameEn(e.target.value)}
            className="w-full p-3 rounded border border-yellow-400 dark:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
          />

          <button
            onClick={handleAddPlace}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold transition shadow-md"
          >
            {isArabic ? "إضافة" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
}

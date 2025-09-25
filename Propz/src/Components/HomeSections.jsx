import { useEffect, useState } from "react";
import AdsDiv from "../Components/AdsDiv";
import { useLanguage } from "../Context/LangContext";
import { API_BASE_URL, getOrCreateUserUUID } from "../Utils/Constant";

export default function HomeSections() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";

  const [forYouCategory, setForYouCategory] = useState(null);

  const sections = [
    {
      key: "عقارات",
      ar: "الأكثر شهرة في قسم العقارات",
      en: "Most Popular in Real Estate",
    },
    {
      key: "سيارات",
      ar: "الأكثر شهرة في قسم سيارات للبيع",
      en: "Most Popular in Cars for Sale",
    },
    {
      key: "سيارات للايجار",
      ar: "الأكثر شهرة في قسم سيارات للإيجار",
      en: "Most Popular in Cars for Rent",
    },
    {
      key: "هواتف",
      ar: "الأكثر شهرة في قسم الهواتف",
      en: "Most Popular in Phones ",
    },
  ];

  // 🟢 جلب الكاتيجوري الخاص بالمستخدم (For You)
  useEffect(() => {
    const userUUID = getOrCreateUserUUID();

    const fetchForYou = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}SearchingExpections/GetUserLastCategory?userUUID=${userUUID}`
        );
        if (!response.ok) return;
        const data = await response.text();
        if (data) {
          setForYouCategory(data); // مباشرةً
        }
      } catch (err) {
        console.error("Error fetching For You category:", err);
      }
    };

    fetchForYou();
  }, []);

  return (
    <>
      {/* 🟢 قسم "لك / For You" */}
      {forYouCategory && (
        <section
          dir={isArabic ? "rtl" : "ltr"}
          className="max-w-7xl mx-auto px-0"
        >
          <h1
            className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
              isArabic
                ? "text-right border-yellow-500 text-yellow-600"
                : "text-left border-yellow-400 text-yellow-600"
            }`}
          >
            {isArabic ? "لك" : "For You"}
          </h1>
          {/* 🔹 نعرض الإعلانات بناءً على الكاتيجوري اللي راجع */}
          <AdsDiv filterWith={forYouCategory} />
        </section>
      )}

      {/* 🟢 باقي الأقسام */}
      {sections.map(({ key, ar, en }) => (
        <section
          key={key}
          dir={isArabic ? "rtl" : "ltr"}
          className="max-w-7xl mx-auto px-0"
        >
          <h1
            className={`text-2xl font-bold mb-4 border-b-2 pb-2 ${
              isArabic
                ? "text-right border-blue-500"
                : "text-left border-purple-500"
            }`}
          >
            {isArabic ? ar : en}
          </h1>
          <AdsDiv filterWith={key} />
        </section>
      ))}
    </>
  );
}

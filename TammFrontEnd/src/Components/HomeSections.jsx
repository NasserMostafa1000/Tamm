// HomeSections.jsx
import AdsDiv from "../Components/AdsDiv";
import { useLanguage } from "../Context/LangContext";

export default function HomeSections() {
  const { language } = useLanguage();
  const isArabic = language === "العربية";

  const sections = [
    {
      key: "شقة للإيجار",
      ar: "الأكثر شهرة في قسم شقق للإيجار",
      en: "Most Popular in Apartments for Rent",
    },
    {
      key: "عقار للبيع",
      ar: "الأكثر شهرة في قسم عقارات للبيع",
      en: "Most Popular in Properties for Sale",
    },
    {
      key: "عقار للإيجار",
      ar: "الأكثر شهرة في قسم عقارات للإيجار",
      en: "Most Popular in Properties for Rent",
    },
    {
      key: "أرض للبيع",
      ar: "الأكثر شهرة في قسم أراضي للبيع",
      en: "Most Popular in Lands for Sale",
    },
    {
      key: "أرض للإيجار",
      ar: "الأكثر شهرة في قسم أراضي للإيجار",
      en: "Most Popular in Lands for Rent",
    },
  ];

  return (
    <>
      {sections.map(({ key, ar, en }) => (
        <section
          key={key}
          dir={isArabic ? "rtl" : "ltr"}
          className="max-w-7xl mx-auto"
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

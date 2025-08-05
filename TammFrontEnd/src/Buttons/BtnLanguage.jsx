// BtnLangusage.jsx
import { useLanguage } from "../Context/LangContext.jsx";

export default function BtnLanguage({
  bgColor = "bg-white",
  textColor = "text-black",
}) {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className={`px-4 py-2 rounded-full font-semibold transition duration-200 shadow-sm ${bgColor} ${textColor}`}
    >
      {language}
    </button>
  );
}

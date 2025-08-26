import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("appLanguage") || "English";
  });

  useEffect(() => {
    localStorage.setItem("appLanguage", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "العربية" ? "English" : "العربية"));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

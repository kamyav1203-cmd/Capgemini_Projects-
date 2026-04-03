import React, { createContext, useState } from "react";

export const LanguageContext = createContext();

const translations = {
  en: {
    title: "Welcome",
    description: "This is a multilingual React application.",
  },
  hi: {
    title: "स्वागत है",
    description: "यह एक बहुभाषी रिएक्ट एप्लिकेशन है।",
  },
  es: {
    title: "Bienvenido",
    description: "Esta es una aplicación React multilingüe.",
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, text: translations[language] }}
    >
      {children}
    </LanguageContext.Provider>
  );
};
// App.jsx - Fix to properly apply language and direction changes
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import i18n from "./i18n";

function App() {
  useEffect(() => {
    const handleLanguageChange = (lng) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    };

    const localLang = localStorage.getItem("appLanguage");
    const browserLang = navigator.language?.slice(0, 2) || "fr";
    const defaultLang = localLang || browserLang || "fr";

    i18n.changeLanguage(defaultLang);
    handleLanguageChange(defaultLang);

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []); 

  return <RouterProvider router={routes} />;
}

export default App;
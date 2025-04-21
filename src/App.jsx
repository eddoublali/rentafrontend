// App.jsx - Fix to properly apply language and direction changes
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { routes } from "./routes/routes";
import i18n from "./i18n";

function App() {
  useEffect(() => {
    // Set up a listener for language changes
    const handleLanguageChange = (lng) => {
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    };

    // Get initial language
    const localLang = localStorage.getItem("appLanguage");
    const browserLang = navigator.language?.slice(0, 2) || "fr";
    const defaultLang = localLang || browserLang || "fr";

    // Set initial language
    i18n.changeLanguage(defaultLang);
    handleLanguageChange(defaultLang);

    // Add event listener for language changes
    i18n.on('languageChanged', handleLanguageChange);

    // Cleanup
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []); 

  return <RouterProvider router={routes} />;
}

export default App;
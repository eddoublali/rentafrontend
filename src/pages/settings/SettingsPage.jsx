import React, { useState, useEffect } from "react";
import { User, Palette, Globe, Settings2 } from "lucide-react";
import ThemeToggle from "../../components/ThemeToggle";
import { useTranslation } from "react-i18next";

export default function SettingsPage() {
 const { i18n, t } = useTranslation();

 const languageMap = {
   en: "English",
   ar: "العربية",
   fr: "Français",
   es: "Español",
 };

 const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

 useEffect(() => {
   setCurrentLanguage(i18n.language);
 }, [i18n.language]);

 const changeLanguage = (languageCode) => {
   i18n.changeLanguage(languageCode);
   localStorage.setItem("appLanguage", languageCode);
   location.reload();
 };

 return (
   <div className="min-h-screen bg-base-200 p-8">
     <div className="max-w-7xl mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     
         <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
           <div className="card-body flex items-center gap-4">
             <User className="w-8 h-8 text-primary" />
             <div>
               <h2 className="card-title">{t('profile')}</h2>
               <p>{t('profileDescription')}</p>
             </div>
           </div>
         </div>

         <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
           <div className="card-body flex items-center gap-4">
             <ThemeToggle />
             <div>
               <h2 className="card-title">{t('theme')}</h2>
               <p>{t('themeDescription')}</p>
             </div>
           </div>
         </div>

         <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
           <div className="card-body flex items-center gap-4">
             <Globe className="w-8 h-8 text-primary" />
             <div>
               <h2 className="card-title">{t('language')}</h2>
               <select
                 value={currentLanguage}
                 onChange={(e) => changeLanguage(e.target.value)}
                 className="select select-bordered mt-2 w-full"
               >
                 {Object.entries(languageMap).map(([code, label]) => (
                   <option key={code} value={code}>
                     {label}
                   </option>
                 ))}
               </select>
             </div>
           </div>
         </div>

         <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
           <div className="card-body flex items-center gap-4">
             <Palette className="w-8 h-8 text-primary" />
             <div>
               <h2 className="card-title">{t('appearance')}</h2>
               <p>{t('appearanceDescription')}</p>
             </div>
           </div>
         </div>

         <div className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
           <div className="card-body flex items-center gap-4">
             <Settings2 className="w-8 h-8 text-primary" />
             <div>
               <h2 className="card-title">{t('general')}</h2>
               <p>{t('generalDescription')}</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
}
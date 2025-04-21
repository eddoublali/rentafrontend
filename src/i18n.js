import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import frTranslation from './locales/fr.json';
import enTranslation from './locales/en.json';
import arTranslation from './locales/ar.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    resources: {
      fr: { translation: frTranslation },
      en: { translation: enTranslation },
      ar: { translation: arTranslation },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
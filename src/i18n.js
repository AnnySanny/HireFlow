import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        greeting: "Good Morning!",
      },
    },
    ua: {
      translation: {
        greeting: "Доброго ранку!",
      },
    },
  },
  lng: "ua",
  fallbackLng: "ua",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
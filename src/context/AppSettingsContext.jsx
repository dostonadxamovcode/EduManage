import { createContext, useContext, useEffect, useState } from "react";
import { STATUS_KEYS, translations } from "../i18n/translations";

const AppSettingsContext = createContext(null);

const SETTINGS_KEY = "edu_manage_settings";
const LOCALE_MAP = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };

function readStoredSettings() {
  if (typeof window === "undefined") {
    return { language: "uz", theme: "light" };
  }

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        language: parsed.language || "uz",
        theme: parsed.theme || "light",
      };
    }
  } catch {
    localStorage.removeItem(SETTINGS_KEY);
  }

  return {
    language: "uz",
    theme: window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  };
}

export function AppSettingsProvider({ children }) {
  const [{ language, theme }, setSettings] = useState(readStoredSettings);

  function setLanguage(nextLanguage) {
    setSettings((prev) => ({ ...prev, language: nextLanguage }));
  }

  function setTheme(nextTheme) {
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  }

  function t(path, params) {
    let text = path.split(".").reduce((obj, key) => obj?.[key], translations[language]);
    text = text ?? path.split(".").reduce((obj, key) => obj?.[key], translations.uz) ?? path;

    if (typeof text !== "string" || !params) return text;

    Object.keys(params).forEach((key) => {
      text = text.replaceAll(`{${key}}`, params[key]);
    });

    return text;
  }

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language, theme }));
    document.documentElement.lang = language;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    document.title = translations[language]?.meta?.title || "EduManage";
  }, [language, theme]);

  const value = {
    language,
    setLanguage,
    theme,
    setTheme,
    toggleTheme: () => setTheme(theme === "dark" ? "light" : "dark"),
    locale: LOCALE_MAP[language] ?? "uz-UZ",
    t,
    subjectLabel: (subject) => t(`subjects.${subject}`),
    statusLabel: (status) => t(`status.${STATUS_KEYS[status]}`),
  };

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}

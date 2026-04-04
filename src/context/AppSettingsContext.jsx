import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STATUS_KEYS, translations } from "../i18n/translations";

const AppSettingsContext = createContext(null);

const SETTINGS_KEY = "edu_manage_settings";
const LOCALE_MAP = { uz: "uz-UZ", ru: "ru-RU", en: "en-US" };

function getByPath(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

function formatText(template, params) {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

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
  const setLanguage = (nextLanguage) => setSettings((prev) => ({ ...prev, language: nextLanguage }));
  const setTheme = (nextTheme) => setSettings((prev) => ({ ...prev, theme: typeof nextTheme === "function" ? nextTheme(prev.theme) : nextTheme }));

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ language, theme }));
    document.documentElement.lang = language;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark", theme === "dark");
    document.title = getByPath(translations[language], "meta.title");
  }, [language, theme]);

  const value = useMemo(() => {
    const current = translations[language] ?? translations.uz;
    const t = (path, params) => {
      const valueAtPath = getByPath(current, path) ?? getByPath(translations.uz, path) ?? path;
      return typeof valueAtPath === "string" ? formatText(valueAtPath, params) : valueAtPath;
    };

    return {
      language,
      setLanguage,
      theme,
      setTheme,
      toggleTheme: () => setTheme((prev) => (prev === "dark" ? "light" : "dark")),
      locale: LOCALE_MAP[language] ?? "uz-UZ",
      t,
      subjectLabel: (subject) => t(`subjects.${subject}`),
      statusLabel: (status) => t(`status.${STATUS_KEYS[status]}`),
    };
  }, [language, theme]);

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used within AppSettingsProvider");
  return ctx;
}

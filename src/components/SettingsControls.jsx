import { Languages, Moon, Sun } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";

export default function SettingsControls({ compact = false, className = "" }) {
  const { language, setLanguage, theme, toggleTheme, t } = useAppSettings();
  const languages = [
    { value: "uz", label: t("controls.uz"), short: "UZ" },
    { value: "ru", label: t("controls.ru"), short: "RU" },
    { value: "en", label: t("controls.en"), short: "EN" },
  ];

  return (
    <div className={`relative z-[120] flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 ${className}`}>
      <label className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-stone-600 dark:text-slate-200">
        <Languages size={15} />
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
          aria-label={t("controls.language")}
          className="bg-transparent text-[11px] font-semibold outline-none sm:text-xs"
        >
          {languages.map((item) => (
            <option key={item.value} value={item.value}>
              {compact ? item.short : item.label}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={t("controls.theme")}
        className="flex items-center gap-1 rounded-xl bg-stone-100 px-2 py-1.5 text-[11px] sm:text-xs font-semibold text-stone-600 transition-colors hover:bg-stone-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
      >
        {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        {!compact && (theme === "dark" ? t("controls.light") : t("controls.dark"))}
      </button>
    </div>
  );
}

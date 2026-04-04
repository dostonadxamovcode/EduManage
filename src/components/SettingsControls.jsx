import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Languages, Moon, Sun } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";

export default function SettingsControls({ compact = false, className = "" }) {
  const { language, setLanguage, theme, toggleTheme, t } = useAppSettings();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const languages = [
    { value: "uz", label: t("controls.uz"), short: "UZ" },
    { value: "ru", label: t("controls.ru"), short: "RU" },
    { value: "en", label: t("controls.en"), short: "EN" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (!wrapRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapRef} className={`relative z-[120] flex items-center gap-1.5 rounded-2xl border border-stone-200 bg-white/90 px-2 py-1.5 shadow-sm backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/90 ${className}`}>
      <div className="relative z-[121]">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={t("controls.language")}
          className="flex items-center gap-1.5 rounded-xl px-2 py-1.5 text-stone-600 transition-colors hover:bg-stone-100 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Languages size={15} />
          <span className="text-[11px] sm:text-xs font-semibold">
            {compact ? languages.find((item) => item.value === language)?.short : languages.find((item) => item.value === language)?.label}
          </span>
          <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] z-[130] min-w-36 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {languages.map((item) => {
              const active = item.value === language;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setLanguage(item.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                    active
                      ? "bg-brand-50 text-brand-700 dark:bg-slate-800 dark:text-brand-200"
                      : "text-stone-600 hover:bg-stone-50 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  <span>{compact ? item.short : item.label}</span>
                  {active && <Check size={14} />}
                </button>
              );
            })}
          </div>
        )}
      </div>
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

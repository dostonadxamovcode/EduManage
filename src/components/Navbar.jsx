import { useState } from "react";
import { LogOut, LayoutDashboard, Users, Home, ChevronDown } from "lucide-react";
import BrandLogo from "./BrandLogo";
import SettingsControls from "./SettingsControls";
import { useAppSettings } from "../context/AppSettingsContext";
import { logoutAdmin, isAdminLoggedIn } from "../utils/store";

function MobilePageSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find((item) => item.key === value) || options[0];

  return (
    <div className="relative min-w-[110px] max-w-[132px]">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50/95 px-3 py-2 text-left text-[12px] font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[140] overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          {options.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onChange(item.key);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors ${
                item.key === current?.key
                  ? "bg-sky-600 text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar({ page, navigate }) {
  const isAdmin = isAdminLoggedIn();
  const { t } = useAppSettings();

  const links = [
    { key: "home", label: t("common.home"), icon: Home },
    { key: "students", label: t("common.students"), icon: Users },
    ...(isAdmin ? [{ key: "dashboard", label: t("shell.nav.dashboard"), icon: LayoutDashboard }] : []),
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate("home");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/95 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-2">
          <button
            onClick={() => navigate("home")}
            className="hidden min-w-0 items-center gap-2 transition-colors sm:flex"
          >
            <BrandLogo textClassName="text-sky-700 dark:text-white" showSubtitle={false} compact={false} />
          </button>

          <button
            onClick={() => navigate("home")}
            className="flex items-center transition-colors sm:hidden"
          >
            <BrandLogo textClassName="text-sky-700 dark:text-white" showSubtitle={false} compact size="md" />
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => navigate(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  page === key
                    ? "bg-sky-50 text-sky-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-sky-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-400"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <SettingsControls compact />
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-500/10"
              >
                <LogOut size={16} /> Chiqish
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("register")}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  {t("common.register")}
                </button>
                <button
                  onClick={() => navigate("login")}
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-sky-600 text-white hover:bg-sky-700 shadow-sky transition-all"
                >
                  {t("common.login")}
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:hidden shrink-0">
            <MobilePageSelect
              value={page}
              options={links}
              onChange={navigate}
            />
            <SettingsControls compact className="scale-[0.88]" />
          </div>
        </div>
      </div>
    </nav>
  );
}

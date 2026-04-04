import { useState } from "react";
import {
  Users, BookOpen, DollarSign,
  TrendingUp, Inbox, Settings, LogOut,
  Bell, Mail, ChevronsLeft, ChevronsRight, ChevronDown, ArrowLeft
} from "lucide-react";
import BrandLogo from "./BrandLogo";
import SettingsControls from "./SettingsControls";
import { useAppSettings } from "../context/AppSettingsContext";
import { logoutAdmin, isAdminLoggedIn } from "../utils/store";

function MobilePageSelect({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const current = options.find((item) => item.key === value) || options[0];

  return (
    <div className="relative min-w-0 flex-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl border border-stone-200 bg-stone-50/95 px-3 py-2 text-left text-[13px] font-bold text-stone-700 shadow-sm transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800/95 dark:text-slate-100 dark:hover:bg-slate-700"
      >
        <span className="truncate">{current?.label}</span>
        <ChevronDown size={15} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[140] overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
          {options.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                onChange(item.key);
                setOpen(false);
              }}
              className={`flex w-full items-center rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-colors ${
                item.key === current?.key
                  ? "bg-brand-500 text-white"
                  : "text-stone-600 hover:bg-stone-50 dark:text-slate-200 dark:hover:bg-slate-800"
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

export default function AppShell({ page, navigate, children }) {
  const [sideCollapsed, setSideCollapsed] = useState(false);
  const admin = isAdminLoggedIn();
  const { t } = useAppSettings();
  const navTop = [
    { key: "students", label: t("shell.nav.students"), icon: Users },
    { key: "plan", label: t("shell.nav.plan"), icon: BookOpen },
  ];
  const navBuild = [
    { key: "course", label: t("shell.nav.course"), icon: BookOpen },
    { key: "pricing", label: t("shell.nav.pricing"), icon: DollarSign },
    { key: "revenue", label: t("shell.nav.revenue"), icon: TrendingUp },
    { key: "inbox", label: t("shell.nav.inbox"), icon: Inbox },
  ];

  const mobileNav = [
    ...(admin ? [{ key: "dashboard", label: t("shell.nav.dashboard") }] : []),
    { key: "students", label: t("studentsPage.title") },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        <button
          onClick={() => navigate("home")}
          className={`flex min-w-0 items-center gap-2 ${sideCollapsed ? "justify-center" : ""}`}
        >
          <BrandLogo
            textClassName="text-brand-700 dark:text-brand-200"
            showSubtitle={false}
            compact={sideCollapsed}
          />
        </button>
      </div>

      {/* Nav top */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navTop.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => { navigate(key); }}
            aria-label={sideCollapsed ? label : undefined}
            title={sideCollapsed ? label : undefined}
            className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
              ${sideCollapsed ? "justify-center gap-0" : "gap-3"}
              ${page === key
                ? "bg-brand-500 text-white shadow-md"
                : "text-stone-500 hover:bg-brand-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200"}`}
          >
            <Icon size={17} className="shrink-0" />
            {!sideCollapsed && <span className="truncate">{label}</span>}
          </button>
        ))}

        {!sideCollapsed && (
          <div className="pt-4 pb-1 px-3">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider dark:text-slate-400">{t("shell.nav.build")}</span>
          </div>
        )}
        {navBuild.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {}}
            aria-label={sideCollapsed ? label : undefined}
            title={sideCollapsed ? label : undefined}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-500 transition-all hover:bg-brand-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200 ${sideCollapsed ? "justify-center gap-0" : "gap-3"}`}
          >
            <Icon size={17} className="shrink-0" />
            {!sideCollapsed && <span className="truncate">{label}</span>}
          </button>
        ))}

        <div className="pt-4">
          <button
            onClick={() => {}}
            aria-label={sideCollapsed ? t("shell.nav.settings") : undefined}
            title={sideCollapsed ? t("shell.nav.settings") : undefined}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-500 transition-all hover:bg-brand-100 hover:text-brand-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-brand-200 ${sideCollapsed ? "justify-center gap-0" : "gap-3"}`}
          >
            <Settings size={17} className="shrink-0" />
            {!sideCollapsed && <span className="truncate">{t("shell.nav.settings")}</span>}
          </button>
        </div>
      </nav>

      {/* Logout */}
      <div className="border-t border-stone-200/80 px-3 pb-5 pt-3 dark:border-slate-800">
        {admin ? (
          <button
            onClick={() => { logoutAdmin(); navigate("home"); }}
            aria-label={sideCollapsed ? t("shell.auth.logout") : undefined}
            title={sideCollapsed ? t("shell.auth.logout") : undefined}
            className={`w-full flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-stone-500 transition-all hover:bg-red-50 hover:text-red-500 dark:text-slate-300 dark:hover:bg-red-500/10 ${sideCollapsed ? "justify-center gap-0" : "gap-3"}`}
          >
            <LogOut size={17} className="shrink-0" />
            {!sideCollapsed && <span className="truncate">{t("shell.auth.logout")}</span>}
          </button>
        ) : (
          <button
            onClick={() => navigate("login")}
            aria-label={sideCollapsed ? t("shell.auth.adminLogin") : undefined}
            title={sideCollapsed ? t("shell.auth.adminLogin") : undefined}
            className={`w-full flex items-center rounded-xl bg-brand-500 px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 ${sideCollapsed ? "justify-center gap-0" : "gap-3"}`}
          >
            <LogOut size={17} className="shrink-0" />
            {!sideCollapsed && <span className="truncate">{t("shell.auth.adminLogin")}</span>}
          </button>
        )}
      </div>
    </div>
  );

  /* ── page title map ── */
  const titles = {
    dashboard: t("shell.nav.dashboard"),
    students: t("studentsPage.title"),
    plan: t("shell.nav.plan"),
  };
  const backTarget = page === "dashboard" ? "home" : admin ? "dashboard" : "home";
  const backLabel = page === "dashboard" ? t("common.home") : t("common.back");

  return (
    <div className="flex h-screen bg-warm overflow-hidden dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden shrink-0 border-r border-stone-200/80 bg-sidebar transition-[width] duration-300 ease-out dark:border-slate-800 dark:bg-slate-900 md:flex md:flex-col ${
          sideCollapsed ? "w-20" : "w-64"
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="relative z-[110] flex shrink-0 items-center justify-between border-b border-stone-200/80 bg-white px-3 py-2.5 sm:h-16 sm:px-5 sm:py-0 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSideCollapsed((prev) => !prev)}
              className="hidden rounded-lg p-1.5 text-stone-500 transition-colors hover:bg-stone-100 dark:text-slate-300 dark:hover:bg-slate-800 md:flex"
              aria-label={sideCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sideCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            </button>
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => navigate(backTarget)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                aria-label={backLabel}
              >
                <ArrowLeft size={16} />
              </button>
            </div>
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(backTarget)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 transition-colors hover:bg-stone-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                  aria-label={backLabel}
                >
                  <ArrowLeft size={16} />
                </button>
                <h1 className="font-bold text-stone-800 text-sm sm:text-base truncate dark:text-slate-100">{titles[page] || page}</h1>
              </div>
            </div>
            <div className="md:hidden min-w-0 flex-1 max-w-[170px]">
              <MobilePageSelect
                value={mobileNav.some((item) => item.key === page) ? page : mobileNav[0]?.key}
                options={mobileNav}
                onChange={navigate}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <SettingsControls compact className="hidden sm:flex" />
            {/* Search */}
            <div className="hidden w-52 items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 lg:flex">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              {t("shell.search")}
            </div>
            <button className="hidden sm:flex relative p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full" />
            </button>
            <button className="hidden sm:flex p-2 rounded-xl hover:bg-stone-100 text-stone-500 transition-colors dark:text-slate-300 dark:hover:bg-slate-800">
              <Mail size={18} />
            </button>
            <SettingsControls compact className="sm:hidden scale-[0.96]" />
          </div>
        </header>

        {/* Page content */}
        <main className="relative z-0 flex-1 overflow-y-auto p-3 sm:p-5">
          {children}
        </main>
      </div>
    </div>
  );
}

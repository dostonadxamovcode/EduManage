export default function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-warm px-4 dark:bg-slate-950">
      <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/88 px-4 py-3 shadow-[0_18px_40px_rgba(148,163,184,0.18)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/88 dark:shadow-[0_18px_40px_rgba(2,6,23,0.45)]">
        <div className="loader-spinner flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 dark:bg-brand-400/10">
          <div className="loader-spinner-dot h-3.5 w-3.5 rounded-full bg-brand-500 dark:bg-brand-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800 dark:text-slate-100">Yuklanmoqda</p>
          <p className="text-xs text-stone-400 dark:text-slate-400">Sahifa tayyorlanyapti...</p>
        </div>
      </div>
    </div>
  );
}

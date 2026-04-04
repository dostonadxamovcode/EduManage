import { useState } from "react";
import { User, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { checkAdmin, loginAdmin } from "../utils/store";

export default function LoginPage({ navigate, onLogin }) {
  const { t } = useAppSettings();
  const [form,   setForm]   = useState({ username:"", password:"" });
  const [showPw, setShowPw] = useState(false);
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if(!form.username||!form.password){ setError(t("login.fillFields")); return; }
    setLoading(true);
    setTimeout(()=>{
      if(checkAdmin(form.username,form.password)){ loginAdmin(); onLogin(true); }
      else { setError(t("login.invalid")); setLoading(false); }
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#eef5ff_100%)] p-3 sm:p-4 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-10%] h-72 w-72 rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/12" />
        <div className="absolute bottom-[-14%] right-[-8%] h-80 w-80 rounded-full bg-amber-100/70 blur-3xl dark:bg-cyan-400/10" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.1))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.04))]" />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-sm animate-fade-up">
        <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(148,163,184,0.24)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_24px_80px_rgba(2,6,23,0.55)]">
          <div className="bg-[linear-gradient(135deg,#0ea5e9_0%,#14b8a6_52%,#f59e0b_100%)] px-5 py-6 sm:px-7 sm:py-7">
            <button onClick={()=>navigate("home")} className="flex items-center gap-1.5 text-brand-200 hover:text-white text-xs mb-5 transition-colors">
              <ArrowLeft size={14}/> {t("common.back")}
            </button>
            <div className="flex items-center gap-2.5 mb-0.5">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <ShieldCheck size={18} className="text-white"/>
              </div>
              <div>
                <div className="font-bold text-white text-base sm:text-lg">{t("login.title")}</div>
                <div className="text-brand-200 text-xs">{t("login.subtitle")}</div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            {error && (
              <div className="animate-fade-in rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-200">
                ⚠️ {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 dark:text-slate-300">{t("login.username")}</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
                <input value={form.username} onChange={e=>setForm({...form,username:e.target.value})} placeholder={t("login.username")}
                  className="w-full rounded-2xl border border-stone-200/80 bg-white/90 py-2.5 pl-9 pr-4 text-sm font-medium outline-none transition-all focus:border-brand-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:bg-slate-800 sm:py-3"/>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 dark:text-slate-300">{t("login.password")}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"/>
                <input type={showPw?"text":"password"} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="••••••••"
                  className="w-full rounded-2xl border border-stone-200/80 bg-white/90 py-2.5 pl-9 pr-10 text-sm font-medium outline-none transition-all focus:border-brand-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:bg-slate-800 sm:py-3"/>
                <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
                  {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-stone-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
              {loading?<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>{t("login.checking")}</>:<><ShieldCheck size={15}/>{t("login.enter")}</>}
            </button>
            <p className="text-center text-stone-400 text-xs dark:text-slate-400">
              {t("login.noAccount")}{" "}
              <button type="button" onClick={()=>navigate("register")} className="text-brand-600 font-bold hover:underline">{t("login.signup")}</button>
            </p>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

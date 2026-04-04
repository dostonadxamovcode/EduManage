import { useState } from "react";
import { Eye, EyeOff, CheckCircle, ArrowLeft } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import { registerUser, userExists } from "../utils/store";

export default function RegisterPage({ navigate }) {
  const { t } = useAppSettings();
  const [form, setForm] = useState({ name:"", surname:"", email:"", password:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if(!form.name.trim())          e.name    = t("register.requiredName");
    if(!form.surname.trim())       e.surname = t("register.requiredSurname");
    if(!form.email.includes("@"))  e.email   = t("register.invalidEmail");
    if(form.password.length < 6)   e.password= t("register.shortPassword");
    if(form.password!==form.confirm) e.confirm=t("register.mismatchPassword");
    if(userExists(form.email))     e.email   = t("register.emailExists");
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if(Object.keys(errs).length){ setErrors(errs); return; }
    setLoading(true);
    setTimeout(()=>{
      registerUser({name:form.name,surname:form.surname,email:form.email,password:form.password});
      setSuccess(true); setLoading(false);
    }, 700);
  };

  const Field = ({ name, label, type="text", placeholder }) => (
    <div>
      <label className="block text-xs font-bold text-stone-600 mb-1.5 dark:text-slate-300">{label}</label>
      <div className="relative">
        <input
          type={name==="password"||name==="confirm" ? (showPw?"text":"password") : type}
          value={form[name]}
          onChange={e=>{ setForm({...form,[name]:e.target.value}); setErrors({...errors,[name]:""}); }}
          placeholder={placeholder}
          className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all
            ${errors[name]
              ? "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-100"
              : "border-stone-200/80 bg-white/90 focus:border-brand-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100 dark:focus:bg-slate-800"}`}
        />
        {(name==="password"||name==="confirm") && (
          <button type="button" onClick={()=>setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
            {showPw?<EyeOff size={15}/>:<Eye size={15}/>}
          </button>
        )}
      </div>
      {errors[name] && <p className="text-red-500 text-xs mt-1 font-medium">{errors[name]}</p>}
    </div>
  );

  if(success) return (
    <div className="min-h-screen bg-warm dark:bg-slate-950">
      <div className="flex items-center justify-center p-3 sm:p-4">
        <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6 sm:p-10 max-w-sm w-full text-center animate-fade-up dark:bg-slate-900 dark:border-slate-800">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={32} className="text-emerald-500"/>
          </div>
          <h2 className="font-bold text-stone-900 text-xl mb-1 dark:text-slate-100">{t("register.success")}</h2>
          <p className="text-stone-400 text-sm mb-6 dark:text-slate-400">{t("register.welcome", { name: form.name, surname: form.surname })}</p>
          <div className="flex flex-col gap-2">
            <button onClick={()=>navigate("students")} className="py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl text-sm transition-colors">
              {t("register.viewStudents")}
            </button>
            <button onClick={()=>navigate("home")} className="py-3 border border-stone-200 text-stone-600 font-bold rounded-xl text-sm hover:bg-stone-50 transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              {t("register.home")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#f7f4ee_0%,#eef5ff_100%)] p-3 sm:p-4 dark:bg-[linear-gradient(180deg,#020617_0%,#0f172a_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-[-10%] top-[-12%] h-80 w-80 rounded-full bg-emerald-200/45 blur-3xl dark:bg-emerald-500/12" />
        <div className="absolute bottom-[-16%] left-[-10%] h-80 w-80 rounded-full bg-sky-200/45 blur-3xl dark:bg-sky-500/12" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.1))] dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.16),rgba(15,23,42,0.04))]" />
      </div>
      <div className="relative z-10 w-full flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-up">
        <div className="overflow-hidden rounded-[30px] border border-white/70 bg-white/80 shadow-[0_28px_90px_rgba(148,163,184,0.22)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 dark:shadow-[0_24px_90px_rgba(2,6,23,0.58)]">
          {/* Header */}
          <div className="bg-[linear-gradient(135deg,#10b981_0%,#06b6d4_58%,#0f172a_100%)] px-5 py-6 sm:px-7 sm:py-7">
            <button onClick={()=>navigate("home")} className="flex items-center gap-1.5 text-brand-200 hover:text-white text-xs mb-5 transition-colors">
              <ArrowLeft size={14}/> {t("common.back")}
            </button>
            <div className="font-bold text-xl sm:text-2xl text-white mb-0.5">{t("register.title")}</div>
            <div className="text-brand-200 text-xs">{t("register.subtitle")}</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field name="name"    label={t("common.name")}      placeholder="Jasur" />
              <Field name="surname" label={t("common.surname")} placeholder="Toshmatov" />
            </div>
            <Field name="email"    label="Email"  type="email" placeholder="email@manzil.uz" />
            <Field name="password" label={t("login.password")} placeholder={t("register.minPassword")} />
            <Field name="confirm"  label={t("register.confirmPassword")}  placeholder={t("register.repeat")} />

            <button type="submit" disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-stone-950 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-stone-800 disabled:opacity-60 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> {t("register.waiting")}</> : `${t("register.title")} →`}
            </button>

            <p className="text-center text-stone-400 text-xs pt-1 dark:text-slate-400">
              {t("register.hasAccount")}{" "}
              <button type="button" onClick={()=>navigate("login")} className="text-brand-600 font-bold hover:underline">{t("register.login")}</button>
            </p>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

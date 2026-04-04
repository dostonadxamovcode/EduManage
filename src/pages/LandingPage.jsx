import { useEffect, useRef, useState } from "react";
import {
  GraduationCap, BarChart3, CalendarCheck, Users, ArrowRight,
  CheckCircle, Play, BookOpen, TrendingUp, Shield, Star
} from "lucide-react";
import BrandLogo from "../components/BrandLogo";
import Navbar from "../components/Navbar";
import { useAppSettings } from "../context/AppSettingsContext";

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setInView(true); }, {threshold:0.15});
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function LandingPage({ navigate }) {
  const { t } = useAppSettings();
  const [f1, v1] = useInView();
  const [f2, v2] = useInView();
  const [f3, v3] = useInView();

  const features = [
    { icon: CalendarCheck, title:t("landing.features.attendanceTitle"), color:"bg-brand-500",
      desc:t("landing.features.attendanceDesc") },
    { icon: BarChart3,     title:t("landing.features.gradeTitle"),  color:"bg-amber-500",
      desc:t("landing.features.gradeDesc") },
    { icon: Users,         title:t("landing.features.studentTitle"), color:"bg-emerald-600",
      desc:t("landing.features.studentDesc") },
    { icon: TrendingUp,    title:t("landing.features.statsTitle"),  color:"bg-violet-500",
      desc:t("landing.features.statsDesc") },
    { icon: BookOpen,      title:t("landing.features.subjectTitle"),   color:"bg-sky-500",
      desc:t("landing.features.subjectDesc") },
    { icon: Shield,        title:t("landing.features.securityTitle"), color:"bg-stone-600",
      desc:t("landing.features.securityDesc") },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-warm dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-60 dark:opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(200,98,58,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(200,98,58,0.08) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(circle_at_top,rgba(200,98,58,0.14),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.12),transparent_55%)]" />
      </div>
      <Navbar page="home" navigate={navigate} />

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-3 sm:px-5 pt-10 sm:pt-20 pb-14 sm:pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-600 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1.5 rounded-full mb-5 sm:mb-7 border border-brand-100 animate-fade-up">
            <Star size={12} className="text-amber-500" /> {t("landing.badge")}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-stone-900 leading-tight mb-4 sm:mb-5 animate-fade-up dark:text-white" style={{animationDelay:"80ms"}}>
            {t("landing.heroTitle").replace(` ${t("landing.heroHighlight")}`, "")} <span className="text-brand-500">{t("landing.heroHighlight")}</span>
          </h1>
          <p className="text-stone-500 text-sm sm:text-lg leading-relaxed mb-6 sm:mb-8 animate-fade-up dark:text-slate-300" style={{animationDelay:"160ms"}}>
            {t("landing.heroDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{animationDelay:"240ms"}}>
            <button onClick={()=>navigate("register")}
              className="flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-brand-200">
              <GraduationCap size={18}/> {t("landing.startFree")}
            </button>
            <button onClick={()=>navigate("login")}
              className="flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl border-2 border-stone-200 bg-white text-stone-700 font-bold text-sm transition-all hover:border-brand-300 hover:text-brand-600 hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-700 dark:text-white">
              {t("landing.adminLogin")} <ArrowRight size={16}/>
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-5 sm:mt-7 animate-fade-up" style={{animationDelay:"320ms"}}>
            {[t("landing.benefit1"),t("landing.benefit2"),t("landing.benefit3")].map(item=>(
              <span key={item} className="flex items-center gap-1.5 text-stone-400 text-xs font-medium dark:text-slate-400">
                <CheckCircle size={13} className="text-emerald-500"/> {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview card */}
        <div className="mt-10 sm:mt-16 animate-fade-up" style={{animationDelay:"400ms"}}>
          <div className="bg-white rounded-3xl shadow-xl border border-stone-100 overflow-hidden max-w-3xl mx-auto dark:bg-slate-900 dark:border-slate-800">
            {/* Fake top bar */}
            <div className="bg-stone-50 border-b border-stone-100 px-3 sm:px-5 py-3 flex items-center gap-2 dark:bg-slate-800 dark:border-slate-700">
              <div className="hidden sm:flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"/>
                <div className="w-3 h-3 rounded-full bg-yellow-400"/>
                <div className="w-3 h-3 rounded-full bg-green-400"/>
              </div>
              <div className="flex-1 sm:mx-4">
                <div className="bg-white border border-stone-200 rounded-lg h-6 w-full max-w-sm mx-auto flex items-center px-3 dark:bg-slate-900 dark:border-slate-700">
                  <span className="text-[10px] sm:text-xs text-stone-400 dark:text-slate-400 truncate">{t("landing.previewUrl")}</span>
                </div>
              </div>
            </div>
            {/* Mini dashboard */}
            <div className="flex flex-col sm:flex-row">
              <div className="w-full sm:w-32 bg-brand-50/70 border-b sm:border-b-0 sm:border-r border-stone-100 p-3 space-y-1 shrink-0 dark:bg-slate-800/80 dark:border-slate-700">
                <div className="text-xs font-bold text-brand-500 mb-3 px-1">{t("landing.previewTitle")}</div>
                {[t("landing.overview"),t("landing.learnerList"),t("landing.teacherPlan")].map((item,i)=>(
                  <div key={item} className={`px-2 py-1.5 rounded-lg text-xs font-semibold ${i===0?"bg-brand-500 text-white":"text-stone-400"}`}>
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-3 sm:p-4">
                <p className="font-bold text-stone-700 text-sm mb-3 dark:text-slate-100">{t("shell.courseOverview")}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {[["1,789",t("landing.newEnrollments")],["83%",t("landing.completed")],["10,812",t("landing.totalStudents")],["189",t("landing.totalCourses")]].map(([v,l])=>(
                    <div key={l} className="bg-stone-50 rounded-xl p-2 border border-stone-100 dark:bg-slate-800 dark:border-slate-700">
                      <div className="font-bold text-stone-800 text-sm dark:text-slate-100">{v}</div>
                      <div className="text-xs text-stone-400 dark:text-slate-400">{l}</div>
                    </div>
                  ))}
                </div>
                <div className="bg-stone-50 rounded-xl p-3 border border-stone-100 flex items-end gap-1 h-16 dark:bg-slate-800 dark:border-slate-700">
                  {[30,45,60,95,55,30,70,80,90,75].map((h,i)=>(
                    <div key={i} className="flex-1 rounded-sm bg-brand-400 opacity-80 transition-all" style={{height:`${h}%`}}/>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="bg-white py-14 sm:py-20 border-t border-stone-100 dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-3 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-block bg-brand-50 text-brand-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-brand-100">{t("landing.featuresLabel")}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3 dark:text-white">{t("landing.featuresTitle")}</h2>
            <p className="text-stone-400 max-w-md mx-auto text-sm dark:text-slate-400">{t("landing.featuresDesc")}</p>
          </div>
          <div ref={f1} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f,i)=>(
              <div key={i}
                className={`bg-warm rounded-2xl p-4 sm:p-6 border border-stone-100 hover:shadow-card-md transition-all duration-500 hover:-translate-y-0.5 dark:bg-slate-900 dark:border-slate-800
                  ${v1?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}
                style={{transitionDelay:`${i*80}ms`}}>
                <div className={`w-11 h-11 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={21} className="text-white"/>
                </div>
                <h3 className="font-bold text-stone-800 mb-1.5 text-sm dark:text-slate-100">{f.title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-3 sm:px-5">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block bg-amber-50 text-amber-600 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-amber-100">{t("landing.videoLabel")}</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 dark:text-white">{t("landing.videoTitle")}</h2>
            <p className="text-stone-400 text-sm dark:text-slate-400">{t("landing.videoDesc")}</p>
          </div>
          <div ref={f2} className={`rounded-3xl overflow-hidden shadow-xl transition-all duration-700 ${v2?"opacity-100 scale-100":"opacity-0 scale-95"}`}>
            <div className="aspect-video bg-gradient-to-br from-stone-800 to-stone-900 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 opacity-5"
                style={{backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"28px 28px"}}/>
              <div className="relative z-10 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                  <Play size={26} className="text-white ml-1" fill="white"/>
                </div>
                <p className="text-stone-300 font-semibold text-sm">{t("landing.presentation")}</p>
                <p className="text-stone-500 text-xs mt-1">3:24 daqiqa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ── */}
      <section className="bg-white py-14 sm:py-20 border-t border-stone-100 dark:bg-slate-950 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-3 sm:px-5">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">{t("landing.stepsTitle")}</h2>
          </div>
          <div ref={f3} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              {n:"01",title:t("landing.steps.step1Title"),desc:t("landing.steps.step1Desc"),color:"bg-brand-500"},
              {n:"02",title:t("landing.steps.step2Title"),desc:t("landing.steps.step2Desc"),color:"bg-amber-500"},
              {n:"03",title:t("landing.steps.step3Title"),desc:t("landing.steps.step3Desc"),color:"bg-emerald-500"},
            ].map(({n,title,desc,color},i)=>(
              <div key={i}
                className={`bg-warm border border-stone-100 rounded-2xl p-4 sm:p-6 text-center transition-all duration-700 dark:bg-slate-900 dark:border-slate-800 ${v3?"opacity-100 translate-y-0":"opacity-0 translate-y-6"}`}
                style={{transitionDelay:`${i*120}ms`}}>
                <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <span className="font-bold text-white text-base">{n}</span>
                </div>
                <h3 className="font-bold text-stone-800 mb-1.5 text-sm dark:text-slate-100">{title}</h3>
                <p className="text-stone-400 text-xs dark:text-slate-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-2xl mx-auto px-3 sm:px-5 text-center">
          <div className="bg-brand-500 rounded-3xl p-6 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",backgroundSize:"20px 20px"}}/>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">{t("landing.ctaTitle")}</h2>
              <p className="text-brand-100 text-sm mb-7 max-w-sm mx-auto">{t("landing.ctaDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={()=>navigate("register")}
                  className="px-7 py-3.5 bg-white text-brand-600 font-bold rounded-2xl hover:bg-brand-50 transition-all hover:-translate-y-0.5 text-sm">
                  {t("landing.signupFree")} →
                </button>
                <button onClick={()=>navigate("login")}
                  className="px-7 py-3.5 bg-white/15 text-white font-bold rounded-2xl hover:bg-white/25 transition-all hover:-translate-y-0.5 text-sm border border-white/20">
                  {t("landing.demo")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-8">
        <div className="max-w-6xl mx-auto px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <BrandLogo textClassName="text-white" showSubtitle={false} />
          <p className="text-[11px] sm:text-xs text-center">{t("landing.footerText", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-4 text-[11px] sm:text-xs">
            {["home","register","login"].map(k=>(
              <button key={k} onClick={()=>navigate(k)} className="hover:text-brand-400 transition-colors capitalize">
                {k==="home"?t("common.home"):k==="register"?t("common.register"):t("common.login")}
              </button>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

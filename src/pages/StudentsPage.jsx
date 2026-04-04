import { useState, useEffect } from "react";
import { Search, Users, BarChart3, CalendarCheck, TrendingUp, ChevronDown, GraduationCap } from "lucide-react";
import { useAppSettings } from "../context/AppSettingsContext";
import {
  getStudents, getAttendancePct, getAvgGrade, getStatus, SUBJECTS
} from "../utils/store";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function StudentAvatar({ student, className = "w-9 h-9 rounded-xl" }) {
  if (student.photo) {
    return <img src={student.photo} alt={`${student.name} ${student.surname}`} className={`${className} shrink-0 object-cover`} />;
  }
  return (
    <div className={`flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-brand-400 to-brand-600 shrink-0 ${className}`}>
      {student.name[0]}{student.surname[0]}
    </div>
  );
}

function StatusBadge({ status, statusLabel }) {
  const map = { "A'lo":"bg-emerald-100 text-emerald-700", "Yaxshi":"bg-sky-100 text-sky-700", "Qoniqarli":"bg-amber-100 text-amber-700", "Qoniqarsiz":"bg-red-100 text-red-600" };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status]||""}`}>{statusLabel}</span>;
}

function GP({ v }) {
  const c = v>=80?"bg-emerald-100 text-emerald-700":v>=65?"bg-sky-100 text-sky-700":v>=50?"bg-amber-100 text-amber-700":"bg-red-100 text-red-600";
  return <span className={`inline-flex w-9 h-6 items-center justify-center rounded-lg text-xs font-bold ${c}`}>{v}</span>;
}

function StudentCard({ student, i, t, subjectLabel, statusLabel }) {
  const [open, setOpen] = useState(false);
  const pct = getAttendancePct(student);
  const avg = getAvgGrade(student);
  const status = getStatus(student);
  return (
    <div className="overflow-hidden transition-all bg-white border rounded-2xl border-stone-100 shadow-card hover:shadow-card-md animate-fade-up dark:bg-slate-900 dark:border-slate-800" style={{animationDelay:`${i*50}ms`}}>
      <div className="flex items-center justify-between px-4 py-4 cursor-pointer" onClick={()=>setOpen(!open)}>
        <div className="flex items-center gap-3">
          <StudentAvatar student={student} />
          <div>
            <div className="text-sm font-bold text-stone-800 dark:text-slate-100">{student.name} {student.surname}</div>
            <div className="text-xs text-stone-400 dark:text-slate-400">{student.phone || t("studentsPage.avgGradeShort")}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={status} statusLabel={statusLabel(status)} />
          <ChevronDown size={14} className={`text-stone-400 transition-transform ${open?"rotate-180":""}`}/>
        </div>
      </div>
      {open && (
        <div className="px-4 py-4 border-t border-stone-100 bg-stone-50/60 animate-fade-in dark:border-slate-800 dark:bg-slate-800/60">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="p-3 text-center bg-white border rounded-xl border-stone-100 dark:bg-slate-900 dark:border-slate-700">
              <div className="text-xs text-stone-400 mb-0.5 dark:text-slate-400">{t("studentsPage.averageGrade")}</div>
              <div className="text-2xl font-bold text-brand-600">{avg}</div>
            </div>
            <div className="p-3 text-center bg-white border rounded-xl border-stone-100 dark:bg-slate-900 dark:border-slate-700">
              <div className="text-xs text-stone-400 mb-0.5 dark:text-slate-400">{t("studentsPage.attendance")}</div>
              <div className="text-2xl font-bold text-emerald-600">{pct}%</div>
            </div>
          </div>
          <div className="p-3 bg-white border rounded-xl border-stone-100 dark:bg-slate-900 dark:border-slate-700">
            <div className="mb-2 text-xs font-bold text-stone-600 dark:text-slate-300">{t("studentsPage.subjectGrades")}</div>
            <div className="grid grid-cols-2 gap-1.5">
              {SUBJECTS.map(s=>(
                <div key={s} className="flex items-center justify-between">
                  <span className="text-xs text-stone-500 dark:text-slate-400">{subjectLabel(s)}</span>
                  <GP v={student.grades[s]}/>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudentsPage({ navigate, isAdmin }) {
  const { t, subjectLabel, statusLabel } = useAppSettings();
  const [students, setStudents] = useState([]);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("all");
  const [sort, setSort]         = useState("name");
  const [view, setView]         = useState("table");

  useEffect(()=>{ setStudents(getStudents()); }, []);

  const filtered = students
    .filter(s => {
      const q = normalizeText(search);
      const haystack = normalizeText([
        s.name,
        s.surname,
        `${s.name} ${s.surname}`,
        s.phone,
        getStatus(s),
        statusLabel(getStatus(s)),
      ].join(" "));

      const matchesSearch = !q || haystack.includes(q);
      const matchesFilter = filter==="all" || getStatus(s)===filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a,b) => {
      if(sort==="name")       return a.name.localeCompare(b.name);
      if(sort==="grade")      return getAvgGrade(b)-getAvgGrade(a);
      if(sort==="attendance") return getAttendancePct(b)-getAttendancePct(a);
      return 0;
    });

  const total    = students.length;
  const avgAtt   = total ? Math.round(students.reduce((a,s)=>a+getAttendancePct(s),0)/total):0;
  const avgGrade = total ? Math.round(students.reduce((a,s)=>a+getAvgGrade(s),0)/total):0;
  const alo      = students.filter(s=>getStatus(s)==="A'lo").length;

  return (
    <div className="space-y-4 sm:space-y-5 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-base font-bold text-stone-800 sm:text-lg dark:text-slate-100">{t("studentsPage.title")}</h1>
          <p className="text-stone-400 text-xs mt-0.5 dark:text-slate-400">{t("studentsPage.subtitle")}</p>
        </div>
        {isAdmin && (
          <button onClick={()=>navigate("dashboard")}
            className="w-full sm:w-auto justify-center flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm transition-colors">
            <GraduationCap size={15}/> {t("common.admin")}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label:t("studentsPage.totalStudents"), v:total,    icon:Users,        color:"bg-brand-500" },
          { label:t("studentsPage.excellentStudents"), v:alo,       icon:TrendingUp,   color:"bg-emerald-500" },
          { label:t("studentsPage.averageGrade"),    v:avgGrade,  icon:BarChart3,    color:"bg-violet-500" },
          { label:t("studentsPage.averageAttendance"),    v:`${avgAtt}%`, icon:CalendarCheck, color:"bg-amber-500" },
        ].map(({label,v,icon:Icon,color})=>(
          <div key={label} className="flex items-center gap-3 p-4 bg-white border rounded-2xl shadow-card border-stone-100 dark:bg-slate-900 dark:border-slate-800">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
              <Icon size={18} className="text-white"/>
            </div>
            <div>
              <div className="text-lg font-bold sm:text-xl text-stone-800 dark:text-slate-100">{v}</div>
              <div className="text-xs text-stone-400 dark:text-slate-400">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="relative w-full sm:flex-1 sm:min-w-40">
          <Search size={14} className="absolute -translate-y-1/2 left-3 top-1/2 text-stone-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("common.search")}
            className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-brand-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"/>
        </div>
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="ui-select lg:w-52">
          {["all","A'lo","Yaxshi","Qoniqarli","Qoniqarsiz"].map(s=>(
            <option key={s} value={s}>{s==="all"?t("common.status"):statusLabel(s)}</option>
          ))}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)} className="ui-select lg:w-48">
          <option value="name">{t("studentsPage.sortName")}</option>
          <option value="grade">{t("studentsPage.sortGrade")}</option>
          <option value="attendance">{t("studentsPage.sortAttendance")}</option>
        </select>
        <div className="flex overflow-hidden rounded-xl border border-stone-200 bg-white lg:ml-auto dark:border-slate-700 dark:bg-slate-900">
          <button onClick={()=>setView("table")} className={`px-3 py-2 text-sm font-bold transition-colors ${view==="table"?"bg-brand-500 text-white":"text-stone-400 hover:bg-stone-50"}`}>☰</button>
          <button onClick={()=>setView("cards")} className={`px-3 py-2 text-sm font-bold transition-colors ${view==="cards"?"bg-brand-500 text-white":"text-stone-400 hover:bg-stone-50"}`}>⊞</button>
        </div>
      </div>

      {/* Table */}
      {view==="table" && (
        <div className="overflow-hidden bg-white border rounded-2xl shadow-card border-stone-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="divide-y divide-stone-100 md:hidden dark:divide-slate-800">
            {filtered.length===0 && (
              <div className="py-12 text-sm text-center text-stone-400">
                <Users size={36} className="mx-auto mb-2 text-stone-200"/> {t("studentsPage.noResults")}
              </div>
            )}
            {filtered.map((s,i)=>{
              const pct=getAttendancePct(s), avg=getAvgGrade(s), status=getStatus(s);
              return (
                <div key={s.id} className="space-y-4 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <StudentAvatar student={s} className="h-10 w-10 rounded-2xl" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-stone-800 dark:text-slate-100">{i + 1}. {s.name} {s.surname}</div>
                        <div className="truncate text-xs text-stone-400 dark:text-slate-400">{s.phone || "-"}</div>
                      </div>
                    </div>
                    <StatusBadge status={status} statusLabel={statusLabel(status)} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-slate-800">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-400">{t("common.average")}</div>
                      <div className="text-lg font-bold text-stone-800 dark:text-slate-100">{avg}</div>
                    </div>
                    <div className="rounded-xl bg-stone-50 px-3 py-2.5 dark:bg-slate-800">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-400">{t("common.attendance")}</div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-200 dark:bg-slate-700">
                          <div className={`h-full rounded-full ${pct>=80?"bg-emerald-500":pct>=60?"bg-amber-400":"bg-red-400"}`} style={{width:`${pct}%`}}/>
                        </div>
                        <span className="text-xs font-bold text-stone-500 dark:text-slate-400">{pct}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {SUBJECTS.slice(0, 3).map(sub=>(
                      <div key={sub} className="rounded-xl border border-stone-100 px-3 py-2 text-center dark:border-slate-800">
                        <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-400">{subjectLabel(sub).slice(0,3)}</div>
                        <div className="flex justify-center"><GP v={s.grades[sub]}/></div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50/60 dark:border-slate-800 dark:bg-slate-800/70">
                  <th className="px-5 py-3 text-xs font-bold tracking-wide text-left uppercase text-stone-500">#</th>
                  <th className="px-5 py-3 text-xs font-bold tracking-wide text-left uppercase text-stone-500">{t("studentsPage.student")}</th>
                  {SUBJECTS.map(s=>(
                    <th key={s} className="px-2 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{subjectLabel(s).slice(0,3)}</th>
                  ))}
                  <th className="px-3 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("common.average")}</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-left uppercase text-stone-500">{t("common.attendance")}</th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("common.status")}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length===0 && (
                  <tr><td colSpan={SUBJECTS.length+4} className="py-12 text-sm text-center text-stone-400">
                    <Users size={36} className="mx-auto mb-2 text-stone-200"/> {t("studentsPage.noResults")}
                  </td></tr>
                )}
                {filtered.map((s,i)=>{
                  const pct=getAttendancePct(s), avg=getAvgGrade(s), status=getStatus(s);
                  return (
                    <tr key={s.id} className="transition-colors border-b border-stone-50 hover:bg-brand-50/30 dark:border-slate-800 dark:hover:bg-slate-800/70">
                      <td className="px-5 py-3 text-xs font-semibold text-stone-400">{i+1}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <StudentAvatar student={s} className="w-8 h-8 rounded-xl" />
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-stone-800 dark:text-slate-100">{s.name} {s.surname}</div>
                            <div className="text-xs text-stone-400 dark:text-slate-400">{s.phone || "-"}</div>
                          </div>
                        </div>
                      </td>
                      {SUBJECTS.map(sub=>(
                        <td key={sub} className="px-2 py-3 text-center"><GP v={s.grades[sub]}/></td>
                      ))}
                      <td className="px-3 py-3 text-sm font-bold text-center text-stone-700 dark:text-slate-200">{avg}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col w-20 gap-1">
                          <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${pct>=80?"bg-emerald-500":pct>=60?"bg-amber-400":"bg-red-400"}`} style={{width:`${pct}%`}}/>
                          </div>
                          <span className="text-xs font-bold text-stone-500 dark:text-slate-400">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center"><StatusBadge status={status} statusLabel={statusLabel(status)} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="sticky bottom-0 z-10 border-t border-stone-100 bg-stone-100 px-5 py-3 text-xs font-medium text-stone-500 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
            {t("studentsPage.tableSummary", { filtered: filtered.length, total })}
          </div>
        </div>
      )}

      {/* Cards */}
      {view==="cards" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length===0 && (
            <div className="col-span-3 py-12 text-sm text-center text-stone-400">
              <Users size={36} className="mx-auto mb-2 text-stone-200"/> {t("studentsPage.noResults")}
            </div>
          )}
          {filtered.map((s,i)=><StudentCard key={s.id} student={s} i={i} t={t} subjectLabel={subjectLabel} statusLabel={statusLabel} />)}
        </div>
      )}
    </div>
  );
}

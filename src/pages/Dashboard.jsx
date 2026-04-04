import { useState, useEffect } from "react";
import {
  UserPlus, GraduationCap, Users, BookOpen,
  Plus, Edit2, Trash2, X, Save, TrendingUp, TrendingDown,
  ChevronDown, Search, CheckCircle2, Info
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar
} from "recharts";
import {
  getStudents, addStudent, updateStudent, deleteStudent,
  getAttendancePct, getAvgGrade, getStatus, SUBJECTS
} from "../utils/store";
import { useAppSettings } from "../context/AppSettingsContext";

/* ── Enrollment sparkline data ── */
const enrollData = [
  {d:"01/10",v:210},{d:"03/10",v:290},{d:"06/10",v:320},{d:"09/10",v:769},
  {d:"12/10",v:490},{d:"15/10",v:160},{d:"18/10",v:540},{d:"21/10",v:600},
  {d:"24/10",v:700},{d:"27/10",v:650},
];

/* ── Stat card ── */
function StatCard({ label, value, icon: Icon, trend, trendLabel, trendUp }) {
  return (
    <div className="p-5 bg-white border rounded-2xl shadow-card border-stone-100 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm font-medium text-stone-500 dark:text-slate-400">{label}</p>
        <div className="flex items-center justify-center w-9 h-9 bg-stone-50 rounded-xl text-stone-400 dark:bg-slate-800 dark:text-slate-400">
          <Icon size={18} />
        </div>
      </div>
      <p className="mb-2 text-3xl font-bold text-stone-800 dark:text-slate-100">{value}</p>
      <div className={`flex items-center gap-1 text-xs font-semibold ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
        {trendUp ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
        {trend} <span className="font-normal text-stone-400 dark:text-slate-400">{trendLabel}</span>
      </div>
    </div>
  );
}

/* ── Status badge ── */
function StatusBadge({ status, label }) {
  const map = {
    "A'lo":        "bg-emerald-100 text-emerald-700",
    "Yaxshi":      "bg-sky-100 text-sky-700",
    "Qoniqarli":   "bg-amber-100 text-amber-700",
    "Qoniqarsiz":  "bg-red-100 text-red-600",
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${map[status]||""}`}>{label}</span>;
}

/* ── Grade pill ── */
function GP({ v }) {
  const c = v>=80?"bg-emerald-100 text-emerald-700":v>=65?"bg-sky-100 text-sky-700":v>=50?"bg-amber-100 text-amber-700":"bg-red-100 text-red-600";
  return <span className={`inline-flex w-9 h-6 items-center justify-center rounded-lg text-xs font-bold ${c}`}>{v}</span>;
}

function StudentAvatar({ student, className = "w-8 h-8 rounded-xl" }) {
  if (student.photo) {
    return <img src={student.photo} alt={`${student.name} ${student.surname}`} className={`${className} shrink-0 object-cover`} />;
  }
  return (
    <div className={`flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-brand-400 to-brand-600 shrink-0 ${className}`}>
      {student.name[0]}{student.surname[0]}
    </div>
  );
}

/* ── Modal wrapper ── */
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm animate-fade-in sm:p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-fade-up dark:border dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-slate-800">
          <h2 className="text-base font-bold text-stone-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="flex items-center justify-center transition-colors rounded-lg w-7 h-7 bg-stone-100 hover:bg-stone-200 dark:bg-slate-800 dark:hover:bg-slate-700">
            <X size={14} />
          </button>
        </div>
        <div className="max-h-[min(78vh,720px)] overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

function GradeInput({ label, value, onChange }) {
  return (
    <div>
      <label className="block mb-1 text-xs font-semibold text-stone-500 dark:text-slate-400">{label}</label>
      <input type="number" min="0" max="100" value={value} onChange={onChange}
        className="w-full px-3 py-2 text-sm font-bold text-center transition-all border outline-none rounded-xl border-stone-200 focus:border-brand-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100" />
    </div>
  );
}

function ToastStack({ toasts, onClose }) {
  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[240] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto animate-fade-up rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-white/95 dark:border-emerald-500/20 dark:bg-slate-900/95"
              : "border-sky-200 bg-white/95 dark:border-sky-500/20 dark:bg-slate-900/95"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${toast.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300" : "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300"}`}>
              {toast.type === "success" ? <CheckCircle2 size={16} /> : <Info size={16} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-stone-800 dark:text-slate-100">{toast.title}</p>
              {toast.description && <p className="mt-1 text-xs leading-5 text-stone-500 dark:text-slate-300">{toast.description}</p>}
            </div>
            <button onClick={() => onClose(toast.id)} className="p-1 transition-colors rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════ DASHBOARD ══════════════════ */
export default function Dashboard() {
  // UI: dashboard sahifasining barcha asosiy state va interaktiv qismlari shu komponentda turadi.
  const { t, subjectLabel, statusLabel } = useAppSettings();
  const [students, setStudents] = useState([]);
  const [search,   setSearch]   = useState("");
  const [filter,   setFilter]   = useState("all");
  const [modal,    setModal]    = useState(null);
  const [selected, setSelected] = useState(null);
  const [form,     setForm]     = useState({ name: "", surname: "", phone: "", photo: "" });
  const [grades,   setGrades]   = useState({});
  const [att,      setAtt]      = useState({ present: "", total: "" });
  const [toasts, setToasts] = useState([]);

  // UI: jadval va statistikalar uchun o'quvchilar ma'lumotini yuklash.
  useEffect(() => { setStudents(getStudents()); }, []);
  const refresh = () => setStudents(getStudents());

  // UI: modal ochilganda orqa fon scroll bo'lmasligi uchun body ni qulflash.
  useEffect(() => {
    if (!modal) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previousTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.touchAction = previousTouchAction;
    };
  }, [modal]);

  // UI: o'ng yuqorida chiqadigan toast xabarlari.
  const pushToast = (toast) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, type: "info", ...toast }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  };

  // UI: top stat kartalar, pie va radial chart uchun hisoblangan qiymatlar.
  const total      = students.length;
  const avgAtt     = total ? Math.round(students.reduce((a,s)=>a+getAttendancePct(s),0)/total) : 0;
  /* pie data */
  const completed  = Math.round(total * avgAtt / 100);
  const pieData    = [{ v: completed }, { v: total - completed }];
  const PIE_COLORS = ["#c8623a","#ede7e0"];

  /* radial */
  const radialData = [
    { name:"UX/UI Designer", value:67, fill:"#c8623a" },
    { name:"Graphics",       value:20, fill:"#d4a574" },
    { name:"Brand",          value:13, fill:"#e8d5c4" },
  ];

  // UI: qidiruv va filterdan keyin student table ichida render bo'ladigan list.
  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const ms = `${s.name} ${s.surname}`.toLowerCase().includes(q);
    const mf = filter==="all" || getStatus(s)===filter;
    return ms && mf;
  });

  // UI: "O'quvchi qo'shish" modalini ochish.
  const openAdd  = () => { setForm({name:"",surname:"",phone:"",photo:""}); setModal("add"); };
  // UI: jadvaldagi edit tugmasi uchun modal va form ma'lumotlari.
  const openEdit = s => { setSelected(s); setForm({name:s.name,surname:s.surname,phone:s.phone || "",photo:s.photo || ""}); setGrades({...s.grades}); setAtt({present:s.attendance.present,total:s.attendance.total}); setModal("edit"); };
  // UI: jadvaldagi delete tugmasi uchun tasdiqlash modali.
  const openDel  = s => { setSelected(s); setModal("delete"); };
  // UI: add modal ichidagi "Qo'shish" tugmasi.
  const doAdd    = () => {
    if(!form.name.trim()||!form.surname.trim()||!form.phone.trim()) return;
    addStudent({name:form.name.trim(),surname:form.surname.trim(),phone:form.phone.trim(),photo:form.photo});
    refresh();
    setModal(null);
    pushToast({ type: "success", title: "O'quvchi qo'shildi", description: `${form.name.trim()} ${form.surname.trim()} ro'yxatga qo'shildi.` });
  };
  // UI: edit modal ichidagi "Saqlash" tugmasi.
  const doEdit   = () => {
    if(!form.phone.trim()) return;
    updateStudent(selected.id,{name:form.name.trim(),surname:form.surname.trim(),phone:form.phone.trim(),photo:form.photo,grades,attendance:{present:Number(att.present),total:Number(att.total)}});
    refresh();
    setModal(null);
    pushToast({ type: "success", title: "Ma'lumot saqlandi", description: `${form.name.trim()} ${form.surname.trim()} yangilandi.` });
  };
  // UI: delete modal ichidagi "O'chirish" tugmasi.
  const doDel    = () => {
    deleteStudent(selected.id);
    refresh();
    setModal(null);
    pushToast({ type: "success", title: "O'quvchi o'chirildi", description: `${selected.name} ${selected.surname} ro'yxatdan olib tashlandi.` });
  };
  // UI: add/edit modal ichidagi rasm yuklash inputi.
  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, photo: String(reader.result || "") }));
    reader.readAsDataURL(file);
  };

  return (
      <div className="space-y-4 sm:space-y-5 animate-fade-up">
      {/* UI: global toast xabarlari stacki */}
      <ToastStack toasts={toasts} onClose={(id) => setToasts((prev) => prev.filter((item) => item.id !== id))} />

      {/* UI: yuqoridagi 4 ta statistik karta */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <StatCard label={t("dashboard.newEnrollments")} value="1,789" icon={UserPlus} trend="+4%" trendLabel={t("dashboard.upFromLastWeek")} trendUp={true} />
        <StatCard label={t("dashboard.completedCourses")} value={`${avgAtt}%`} icon={GraduationCap} trend="+8.5%" trendLabel={t("dashboard.upFromYesterday")} trendUp={true} />
        <StatCard label={t("dashboard.totalStudents")} value={total.toLocaleString()} icon={Users} trend="-8.5%" trendLabel={t("dashboard.downFromLastWeek")} trendUp={false} />
        <StatCard label={t("dashboard.totalCourses")} value="189" icon={BookOpen} trend="+15%" trendLabel={t("dashboard.upFromLastWeek")} trendUp={true} />
      </div>

      {/* UI: enrollment / activity line-area chart bloki */}
      <div className="p-3 transition-transform duration-300 bg-white border rounded-2xl sm:p-5 shadow-card border-stone-100 hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold sm:text-base text-stone-800 dark:text-slate-100">{t("dashboard.newEnrollments")}</h2>
          <button className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-stone-600 border border-stone-200 rounded-xl px-2.5 sm:px-3 py-1.5 hover:bg-stone-50 transition-colors dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">
            {t("dashboard.october")} <ChevronDown size={14} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={190}>
          <AreaChart data={enrollData} margin={{top:10,right:10,left:-20,bottom:0}}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#c8623a" stopOpacity={0.18}/>
                <stop offset="95%" stopColor="#c8623a" stopOpacity={0.01}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="d" tick={{fontSize:11,fill:"#a8a29e"}} axisLine={false} tickLine={false} />
            <YAxis tick={{fontSize:11,fill:"#a8a29e"}} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{background:"#fff",border:"1px solid #e7e5e4",borderRadius:"12px",fontSize:"12px",boxShadow:"0 4px 16px rgba(0,0,0,0.08)"}}
              itemStyle={{color:"#c8623a",fontWeight:700}}
              labelStyle={{color:"#78716c"}}
            />
            <Area type="monotone" dataKey="v" stroke="#c8623a" strokeWidth={2} fill="url(#grad)" dot={{r:3,fill:"#c8623a",strokeWidth:0}} activeDot={{r:5}} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* UI: ikkinchi qatordagi pie chart va radial chart bloklari */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* UI: chap blok, completed/incomplete pie chart */}
        <div className="p-3 bg-white border rounded-2xl sm:p-5 shadow-card border-stone-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-800 dark:text-slate-100">{t("dashboard.completedCourses")}</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-stone-500 border border-stone-200 rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800">
              {t("dashboard.allCourses")} <ChevronDown size={12} />
            </button>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <PieChart width={120} height={120}>
              <Pie data={pieData} cx={55} cy={55} innerRadius={38} outerRadius={55} dataKey="v" startAngle={90} endAngle={-270} strokeWidth={0}>
                {pieData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
            </PieChart>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block" />
                  <span className="text-xl font-bold text-stone-800 dark:text-slate-100">{completed.toLocaleString()}</span>
                </div>
                <p className="ml-4 text-xs text-stone-400 dark:text-slate-400">{t("dashboard.completed")}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-200 inline-block" />
                  <span className="text-xl font-bold text-stone-800 dark:text-slate-100">{(total - completed).toLocaleString()}</span>
                </div>
                <p className="ml-4 text-xs text-stone-400 dark:text-slate-400">{t("dashboard.incomplete")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* UI: o'ng blok, total students radial chart */}
        <div className="p-3 bg-white border rounded-2xl sm:p-5 shadow-card border-stone-100 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-stone-800 dark:text-slate-100">{t("dashboard.totalStudents")}</h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 border border-stone-200 rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors dark:border-slate-700 dark:hover:bg-slate-800">
              {t("common.viewDetails")} →
            </button>
          </div>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div className="relative">
              <RadialBarChart width={120} height={120} cx={55} cy={55} innerRadius={30} outerRadius={55} data={radialData} startAngle={180} endAngle={0}>
                <RadialBar dataKey="value" cornerRadius={4} background={{fill:"#f5f0eb"}} />
              </RadialBarChart>
              <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                <span className="text-lg font-bold text-stone-800 dark:text-slate-100">{total.toLocaleString()}</span>
                <span className="text-xs text-stone-400 dark:text-slate-400">{t("common.total")}</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {radialData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{background:d.fill}} />
                    <span className="text-xs text-stone-600 dark:text-slate-300">{d.name}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-700 dark:text-slate-200">({d.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UI: pastdagi asosiy student management jadvali */}
      <div className="overflow-hidden transition-transform duration-300 bg-white border rounded-2xl shadow-card border-stone-100 hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800">
        {/* UI: jadval tepasidagi toolbar - qidiruv, filter, qo'shish */}
        <div className="flex flex-col items-start justify-between gap-3 px-4 py-4 border-b border-stone-100 sm:px-5 lg:flex-row lg:items-center dark:border-slate-800">
          <h2 className="text-sm font-bold sm:text-base text-stone-800 dark:text-slate-100">{t("dashboard.studentTable")}</h2>
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:flex-wrap">
            <div className="relative w-full lg:w-56">
              <Search size={14} className="absolute -translate-y-1/2 left-3 top-1/2 text-stone-400" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("common.search")}
                className="w-full py-3 pl-10 pr-4 text-sm transition-all border outline-none rounded-xl border-stone-200 focus:border-brand-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100" />
            </div>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="ui-select lg:w-52">
              {["all","A'lo","Yaxshi","Qoniqarli","Qoniqarsiz"].map(s=>(
                <option key={s} value={s}>{s==="all"?t("common.all"):statusLabel(s)}</option>
              ))}
            </select>
            <button onClick={openAdd}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600 lg:w-auto">
              <Plus size={15}/> {t("common.add")}
            </button>
          </div>
        </div>

      {/* UI: studentlar jadvali */}
        <div className="md:hidden divide-y divide-stone-100 dark:divide-slate-800">
          {filtered.length === 0 && (
            <div className="px-5 py-12 text-sm text-center text-stone-400">
              <Users size={36} className="mx-auto mb-2 text-stone-200"/> {t("dashboard.studentNotFound")}
            </div>
          )}
          {filtered.map((s, i) => {
            const pct = getAttendancePct(s);
            const avg = getAvgGrade(s);
            const status = getStatus(s);
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
                  <StatusBadge status={status} label={statusLabel(status)} />
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
                        <div className={`h-full rounded-full ${pct>=80?"bg-emerald-500":pct>=60?"bg-amber-400":"bg-red-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-stone-600 dark:text-slate-300">{pct}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {SUBJECTS.slice(0, 3).map((sub) => (
                    <div key={sub} className="rounded-xl border border-stone-100 px-3 py-2 text-center dark:border-slate-800">
                      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-slate-400">{subjectLabel(sub).slice(0, 3)}</div>
                      <div className="flex justify-center">
                        <GP v={s.grades[sub]} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => openEdit(s)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-700 transition-colors hover:bg-brand-100 hover:text-brand-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    <Edit2 size={14}/> {t("common.edit")}
                  </button>
                  <button onClick={() => openDel(s)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20">
                    <Trash2 size={14}/> {t("common.delete")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1040px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60 dark:border-slate-800 dark:bg-slate-800/70">
                <th className="px-5 py-3 text-xs font-bold tracking-wide text-left uppercase text-stone-500">#</th>
                <th className="px-5 py-3 text-xs font-bold tracking-wide text-left uppercase text-stone-500">{t("studentsPage.student")}</th>
                {SUBJECTS.map(s=>(
                  <th key={s} className="px-2 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500 whitespace-nowrap">
                    {subjectLabel(s).slice(0,3)}
                  </th>
                ))}
                <th className="px-3 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("common.average")}</th>
                <th className="px-3 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("common.attendance")}</th>
                <th className="px-3 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("common.status")}</th>
                <th className="px-3 py-3 text-xs font-bold tracking-wide text-center uppercase text-stone-500">{t("dashboard.action")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={SUBJECTS.length+5} className="py-12 text-sm text-center text-stone-400">
                  <Users size={36} className="mx-auto mb-2 text-stone-200"/> {t("dashboard.studentNotFound")}
                </td></tr>
              )}
              {filtered.map((s, i) => {
                const pct    = getAttendancePct(s);
                const avg    = getAvgGrade(s);
                const status = getStatus(s);
                return (
                  <tr key={s.id} className="transition-colors border-b border-stone-50 hover:bg-brand-50/30 dark:border-slate-800 dark:hover:bg-slate-800/70">
                    <td className="px-5 py-3 text-xs font-semibold text-stone-400">{i+1}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <StudentAvatar student={s} />
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
                    <td className="px-3 py-3">
                      <div className="flex flex-col items-center w-16 gap-1 mx-auto">
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct>=80?"bg-emerald-500":pct>=60?"bg-amber-400":"bg-red-400"}`} style={{width:`${pct}%`}}/>
                        </div>
                        <span className="text-xs font-bold text-stone-600 dark:text-slate-400">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={status} label={statusLabel(status)} /></td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={()=>openEdit(s)} className="flex items-center justify-center transition-all rounded-lg w-7 h-7 bg-stone-50 hover:bg-brand-100 text-stone-500 hover:text-brand-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                          <Edit2 size={13}/>
                        </button>
                        <button onClick={()=>openDel(s)} className="flex items-center justify-center transition-all rounded-lg w-7 h-7 bg-stone-50 hover:bg-red-50 text-stone-500 hover:text-red-500 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-red-500/10">
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {/* UI: jadval footer summary */}
        <div className="px-5 py-3 text-xs font-medium border-t bg-stone-50/50 border-stone-100 text-stone-400 dark:border-slate-800 dark:text-slate-400">
          {t("dashboard.countSummary", { filtered: filtered.length, total })}
        </div>
      </div>

      {/* UI: add student modali */}
      {modal==="add" && (
        <Modal title={t("dashboard.newStudent")} onClose={()=>setModal(null)}>
          <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
            {["name","surname","phone"].map(f=>(
              <div key={f}>
                <label className="block mb-1 text-xs font-bold capitalize text-stone-500 dark:text-slate-400">{f==="name"?t("common.name"):f==="surname"?t("common.surname"):t("common.phone")}</label>
                <input value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})} placeholder={f==="name"?"Jasur":f==="surname"?"Toshmatov":"+998 90 123 45 67"}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"/>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <label className="block mb-1 text-xs font-bold text-stone-500 dark:text-slate-400">{t("dashboard.profileImage")}</label>
            <div className="flex items-center gap-3">
              <StudentAvatar student={{ ...form, name: form.name || "A", surname: form.surname || "B" }} className="w-14 h-14 rounded-2xl" />
              <label className="px-4 py-3 text-xs font-semibold transition-colors border border-dashed cursor-pointer rounded-xl border-stone-300 text-stone-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300">
                {t("dashboard.uploadImage")}
                <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <p className="mt-2 text-xs text-stone-400 dark:text-slate-400">{t("dashboard.imageHint")}</p>
          </div>
          {(!form.phone.trim()) && <p className="mb-4 text-xs text-red-500">{t("dashboard.phoneRequired")}</p>}
          <p className="text-xs text-stone-400 bg-stone-50 rounded-xl px-4 py-2.5 mb-5 dark:bg-slate-800 dark:text-slate-400">💡 {t("dashboard.gradesHint")}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 text-sm transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{t("common.cancel")}</button>
            <button onClick={doAdd} className="flex-1 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl text-sm transition-colors">{t("common.add")}</button>
          </div>
        </Modal>
      )}

      {/* UI: edit student modali */}
      {modal==="edit" && selected && (
        <Modal title={t("dashboard.editStudent", { name: selected.name, surname: selected.surname })} onClose={()=>setModal(null)}>
          <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
            {["name","surname","phone"].map(f=>(
              <div key={f}>
                <label className="block mb-1 text-xs font-bold text-stone-500 dark:text-slate-400">{f==="name"?t("common.name"):f==="surname"?t("common.surname"):t("common.phone")}</label>
                <input value={form[f]} onChange={e=>setForm({...form,[f]:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 text-sm outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"/>
              </div>
            ))}
          </div>
          <div className="mb-5">
            <label className="block mb-1 text-xs font-bold text-stone-500 dark:text-slate-400">{t("dashboard.profileImage")}</label>
            <div className="flex items-center gap-3">
              <StudentAvatar student={{ ...selected, ...form }} className="w-14 h-14 rounded-2xl" />
              <label className="px-4 py-3 text-xs font-semibold transition-colors border border-dashed cursor-pointer rounded-xl border-stone-300 text-stone-500 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300">
                {t("dashboard.uploadImage")}
                <input type="file" accept="image/png,image/jpeg,image/jpg" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>
            <p className="mt-2 text-xs text-stone-400 dark:text-slate-400">{t("dashboard.imageHint")}</p>
          </div>
          <p className="mb-2 text-xs font-bold text-stone-600 dark:text-slate-300">{t("dashboard.grades")}</p>
          <div className="grid grid-cols-2 gap-3 mb-5 sm:grid-cols-3">
            {SUBJECTS.map(s=>(
              <GradeInput key={s} label={subjectLabel(s)} value={grades[s]??0}
                onChange={e=>setGrades({...grades,[s]:Number(e.target.value)})}/>
            ))}
          </div>
          <p className="mb-2 text-xs font-bold text-stone-600 dark:text-slate-300">{t("common.attendance")}</p>
          <div className="grid grid-cols-1 gap-3 mb-5 sm:grid-cols-2">
            {[["present",t("dashboard.presentLessons")],["total",t("dashboard.totalLessons")]].map(([k,l])=>(
              <div key={k}>
                <label className="block mb-1 text-xs font-bold text-stone-500 dark:text-slate-400">{l}</label>
                <input type="number" min="0" value={att[k]} onChange={e=>setAtt({...att,[k]:e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-200 focus:border-brand-400 text-sm font-bold text-center outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"/>
              </div>
            ))}
          </div>
          {att.total>0 && <p className="mb-4 text-xs text-center text-stone-400 dark:text-slate-400">{t("dashboard.attendanceRate")}: <span className="font-bold text-brand-600">{Math.round(att.present/att.total*100)}%</span></p>}
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 text-sm transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{t("common.cancel")}</button>
            <button onClick={doEdit} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"><Save size={15}/>{t("common.save")}</button>
          </div>
        </Modal>
      )}

      {/* UI: delete confirm modali */}
      {modal==="delete" && selected && (
        <Modal title={t("dashboard.confirmDelete")} onClose={()=>setModal(null)}>
          <div className="py-4 mb-5 text-center">
            <div className="flex items-center justify-center mx-auto mb-3 w-14 h-14 bg-red-50 rounded-2xl">
              <Trash2 size={24} className="text-red-500"/>
            </div>
            <p className="font-bold text-stone-800 dark:text-slate-100">{selected.name} {selected.surname}</p>
            <p className="mt-1 text-sm text-stone-400 dark:text-slate-400">{t("dashboard.irreversible")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button onClick={()=>setModal(null)} className="flex-1 py-2.5 border border-stone-200 text-stone-600 font-semibold rounded-xl hover:bg-stone-50 text-sm transition-colors dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">{t("common.cancel")}</button>
            <button onClick={doDel} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl text-sm transition-colors">{t("common.delete")}</button>
          </div>
        </Modal>
      )}

    </div>
  );
}

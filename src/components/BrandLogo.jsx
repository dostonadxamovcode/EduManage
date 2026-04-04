import { GraduationCap } from "lucide-react";

export default function BrandLogo({
  textClassName = "text-slate-900",
  compact = false,
  showSubtitle = true,
  size = "md",
}) {
  const iconSize = size === "lg" ? "w-10 h-10 sm:w-11 sm:h-11" : "w-8 h-8 sm:w-9 sm:h-9";
  const iconInner = size === "lg" ? 21 : 17;
  const titleSize = size === "lg" ? "text-lg sm:text-2xl" : "text-sm sm:text-lg";
  const subtitleSize = size === "lg" ? "text-[9px] sm:text-[10px]" : "text-[8px] sm:text-[9px]";

  return (
    <div className="inline-flex items-center gap-2 sm:gap-3">
      <div className={`${iconSize} rounded-2xl bg-gradient-to-br from-brand-400 via-brand-500 to-amber-500 flex items-center justify-center shadow-lg shadow-brand-200/40 ring-1 ring-white/40 dark:shadow-none dark:ring-brand-300/20`}>
        <GraduationCap size={iconInner} className="text-white" strokeWidth={2.2} />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className={`font-display font-extrabold tracking-[0.08em] sm:tracking-[0.14em] ${titleSize} ${textClassName}`}>
            EduManage
          </div>
          {showSubtitle && (
            <div className={`mt-1 font-semibold uppercase tracking-[0.18em] sm:tracking-[0.28em] text-brand-500/80 dark:text-brand-300/80 ${subtitleSize}`}>
              Education Platform
            </div>
          )}
        </div>
      )}
    </div>
  );
}

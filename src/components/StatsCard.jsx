import React from "react";

export default function StatsCard({
  title,
  value,
  unit = "",
  change,
  isPositive,
  icon: Icon,
  variant = "slate",
  badge,
  subtext
}) {
  const variantStyles = {
    cyan: "border-sky-200/80 bg-sky-50/30",
    emerald: "border-emerald-200/80 bg-emerald-50/30",
    amber: "border-amber-200/80 bg-amber-50/30",
    rose: "border-rose-200/80 bg-rose-50/30",
    slate: "border-slate-200 bg-white"
  };

  return (
    <div className={`p-4 rounded-xl border shadow-2xs transition-all ${variantStyles[variant] || variantStyles.slate}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="p-1.5 rounded-md bg-slate-100/80 border border-slate-200/60 text-slate-600">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl font-bold tracking-tight text-slate-900 font-mono">
          {value}
        </span>
        {unit && <span className="text-xs font-mono text-slate-500">{unit}</span>}
        {badge && (
          <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
            {badge}
          </span>
        )}
      </div>

      {(change || subtext) && (
        <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-500">
          {subtext && <span>{subtext}</span>}
          {change && (
            <span className={isPositive ? "text-emerald-600" : "text-slate-600"}>
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

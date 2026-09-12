import React from "react";
import { Shield, AlertTriangle, Snowflake, Wind, Anchor } from "lucide-react";

export default function RiskPanel({ riskData, isGenerated }) {
  const { score = 23, seaIce = 18, icebergs = 31, weather = 20, vessel = 10, level = "LOW" } = riskData || {};

  // Clean professional color theme
  const getRiskColor = (val) => {
    if (val <= 30) return { text: "text-emerald-700", stroke: "#059669", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (val <= 60) return { text: "text-amber-700", stroke: "#d97706", badge: "bg-amber-50 text-amber-700 border-amber-200" };
    return { text: "text-rose-700", stroke: "#dc2626", badge: "bg-rose-50 text-rose-700 border-rose-200" };
  };

  const riskTheme = getRiskColor(score);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdown = [
    { label: "Sea-Ice Concentration", val: seaIce, max: 100, icon: Snowflake, color: "bg-sky-600" },
    { label: "Iceberg Drift Hazard", val: icebergs, max: 100, icon: AlertTriangle, color: "bg-amber-500" },
    { label: "Wind & Swell Shear", val: weather, max: 100, icon: Wind, color: "bg-blue-600" },
    { label: "Vessel Strain Factor", val: vessel, max: 100, icon: Anchor, color: "bg-indigo-600" },
  ];

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-sky-700" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
            Navigation Risk Assessment
          </h3>
        </div>
        {isGenerated && (
          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
            Optimal Lead
          </span>
        )}
      </div>

      {/* Main Score Gauge */}
      <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/70 mb-4">
        <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="currentColor"
              strokeWidth="7"
              className="text-slate-200"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={riskTheme.stroke}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className={`text-2xl font-black font-mono leading-none ${riskTheme.text}`}>
              {score}
            </span>
            <span className="text-[9px] font-mono text-slate-400 uppercase">/ 100</span>
          </div>
        </div>

        <div className="flex flex-col justify-center flex-1 pl-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium text-slate-500">STATUS LEVEL:</span>
            <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${riskTheme.badge}`}>
              {level}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
            {score <= 30
              ? "Optimal transit conditions. Navigable leads open along the waypoint corridor."
              : score <= 60
              ? "Moderate drift caution. Recommended reduced speed in iceberg perimeter."
              : "Severe sea-ice resistance. Active collision threat detected."}
          </p>
        </div>
      </div>

      {/* Breakdown Bars */}
      <div className="space-y-2.5">
        <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400 flex justify-between">
          <span>Component Breakdown</span>
          <span>Hazard Score</span>
        </div>
        {breakdown.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-slate-700 text-[11px]">
                  <Icon className="w-3 h-3 text-slate-400" />
                  {item.label}
                </span>
                <span className="font-semibold text-slate-800 text-[11px]">
                  {item.val} <span className="text-slate-400 font-normal">/ 100</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${item.val}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

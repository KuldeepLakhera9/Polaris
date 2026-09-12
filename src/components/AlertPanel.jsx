import React from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Info, Bell } from "lucide-react";

export default function AlertPanel({ alerts = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
      case "success":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      default:
        return <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case "danger":
        return "border-rose-200 bg-rose-50/50 text-rose-950";
      case "warning":
        return "border-amber-200 bg-amber-50/50 text-amber-950";
      case "success":
        return "border-emerald-200 bg-emerald-50/50 text-emerald-950";
      default:
        return "border-sky-200 bg-sky-50/50 text-sky-950";
    }
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
            Navigation Advisories
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <Bell className="w-3 h-3 text-slate-400" />
          <span>{alerts.length} ACTIVE</span>
        </div>
      </div>

      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {alerts.map((item, index) => (
          <div
            key={item.id || index}
            className={`p-2.5 rounded-lg border text-xs transition ${getBorderColor(item.type)}`}
          >
            <div className="flex items-start gap-2">
              <span className="mt-0.5">{getIcon(item.type)}</span>
              <div className="flex-1">
                <p className="text-[11px] font-medium leading-snug">{item.text}</p>
                {item.time && (
                  <span className="block mt-1 text-[10px] text-slate-500 tracking-wider uppercase">
                    {item.time}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

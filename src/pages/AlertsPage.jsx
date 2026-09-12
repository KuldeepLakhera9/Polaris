import React, { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle2, Radio, Activity } from "lucide-react";

export default function AlertsPage({ alerts, setAlerts }) {
  const [filter, setFilter] = useState("all");

  const filteredAlerts = alerts.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  const dismissAlert = (id) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const getAlertBadge = (type) => {
    switch (type) {
      case "danger":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "warning":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "success":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-sky-50 text-sky-800 border-sky-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              SITUATIONAL AWARENESS & TELEMETRY LOG
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Proximity advisories, structural strain sensors, and environmental monitoring
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {["all", "warning", "danger", "success", "info"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded text-xs uppercase font-medium transition cursor-pointer ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Alert Feed & Hull Sensor Readout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Alerts Stream */}
        <div className="lg:col-span-2 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm">No active advisories matching filter "{filter}".</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {alert.type === "danger" || alert.type === "warning" ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : alert.type === "success" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Radio className="w-5 h-5 text-sky-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getAlertBadge(alert.type)}`}>
                        {alert.type}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{alert.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 font-sans leading-relaxed font-medium">
                      {alert.text}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="text-xs text-slate-500 hover:text-slate-800 transition cursor-pointer px-2 py-1 rounded bg-slate-50 border border-slate-200"
                >
                  Acknowledge
                </button>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Vessel Hardware Sensor Telemetry */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Activity className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-800">
              Vessel Sensor Array Diagnostics
            </h3>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-semibold block">X-Band Marine Radar</span>
                <span className="text-[10px] text-slate-500 font-mono">Sweep Rate: 24 RPM | 48 nm range</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                OPERATIONAL
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-semibold block">Bow Hull Strain Sensor</span>
                <span className="text-[10px] text-slate-500 font-mono">Pressure: 142 kPa (Safe limit 450 kPa)</span>
              </div>
              <span className="text-sky-800 font-semibold text-[10px] bg-sky-50 px-2 py-0.5 rounded border border-sky-200 font-mono">
                NOMINAL
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-semibold block">Subsea Multibeam Sonar</span>
                <span className="text-[10px] text-slate-500 font-mono">Draft depth: 3,420 m | Ice keel clear</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                ONLINE
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 flex justify-between items-center">
              <div>
                <span className="text-slate-800 font-semibold block">CryoSat-2 Satellite Downlink</span>
                <span className="text-[10px] text-slate-500 font-mono">Last frame: 4 mins ago | SNR 28dB</span>
              </div>
              <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                LOCKED
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>EMERGENCY DISTRESS BEACON:</span>
            <span className="text-emerald-700 font-semibold">ARMED / READY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

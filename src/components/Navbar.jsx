import React, { useState, useEffect } from "react";
import { Compass, ShieldAlert, Navigation, BarChart3, Satellite, Clock } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab, alertCount = 3 }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Navigation },
    { id: "ice-intelligence", label: "Ice Intelligence", icon: BarChart3 },
    { id: "route-planner", label: "Route Planner", icon: Compass },
    { id: "alerts", label: "Alerts & Telemetry", icon: ShieldAlert, badge: alertCount },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200/90 px-4 lg:px-8 py-3 sticky top-0 z-50 shadow-xs">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                POLARIS
              </span>
              <span className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                SIH-2026 #26059
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 tracking-wide">
              POLAR NAVIGATION DECISION SUPPORT SYSTEM
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-sky-700" : "text-slate-400"}`} />
                <span>{item.label}</span>
                {item.badge > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 text-[10px] font-medium rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* System Telemetry & Live Indicator */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="hidden xl:flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            <Satellite className="w-3.5 h-3.5 text-sky-600" />
            <span className="text-[11px] font-medium">SAR FEED: NOMINAL</span>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px]">{currentTime || "UTC SYNCHRONIZED"}</span>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>SYSTEM READY</span>
          </div>
        </div>
      </div>
    </header>
  );
}

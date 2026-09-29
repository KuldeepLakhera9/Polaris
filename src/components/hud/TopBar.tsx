import React, { useState, useEffect } from 'react';
import { usePolarisStore, MISSION_PRESETS } from '../../store/usePolarisStore';
import { 
  Compass, 
  Map as MapIcon,
  FolderGit2, 
  Snowflake, 
  ShieldAlert, 
  Info, 
  Settings, 
  Clock, 
  CheckCircle2, 
  Ship,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { NavigationTab } from '../../types';

export default function TopBar() {
  const {
    activeTab,
    setActiveTab,
    activeMissionPreset,
    loadMissionPreset,
    activePanel,
    setActivePanel,
    alerts,
    ownShip
  } = usePolarisStore();

  const [utcTime, setUtcTime] = useState('');

  // Live ticking UTC clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getUTCHours()).padStart(2, '0');
      const m = String(now.getUTCMinutes()).padStart(2, '0');
      const s = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${h}:${m}:${s} UTC`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'tactical', label: 'Tactical Map & Voyage', icon: MapIcon },
    { id: 'optimizer', label: 'AI Route Optimizer', icon: FolderGit2 },
    { id: 'intelligence', label: 'Ice & Hazard Intel', icon: Snowflake },
    { id: 'alerts', label: 'Alerts & Telemetry', icon: ShieldAlert, badge: alerts.length }
  ];

  return (
    <header className="w-full h-15 bg-[#09111e]/95 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between text-xs text-slate-200 select-none z-40 shadow-xl shrink-0">
      {/* LEFT SECTION: Logo & Mission Preset Selector */}
      <div className="flex items-center gap-4">
        {/* Glowing Compass Logo */}
        <div 
          onClick={() => setActiveTab('tactical')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Tactical Map View"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-950 to-blue-900 border border-sky-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-transform group-hover:scale-105">
            <Compass className="w-5 h-5 text-sky-300 transform group-hover:rotate-45 transition-transform duration-500" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-base tracking-wider text-white">POLARIS</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-600/40 font-semibold">
                AI CO-PILOT
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Polar Navigation Decision Support
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="h-7 w-px bg-slate-800 hidden xl:block" />

        {/* 1-Click Mission Preset Pills */}
        <div className="hidden xl:flex items-center gap-1.5 bg-[#060b13] p-1 rounded-lg border border-slate-800">
          <span className="text-[10px] font-mono uppercase text-slate-400 px-2 font-semibold">
            MISSION:
          </span>
          {MISSION_PRESETS.map((preset) => {
            const isActive = activeMissionPreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => loadMissionPreset(preset.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-semibold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
                title={preset.description}
              >
                {preset.title.split(' ')[0]} {preset.region === 'Antarctic' ? '❄' : '🧭'}
              </button>
            );
          })}
        </div>
      </div>

      {/* CENTER SECTION: Primary Navigation Tabs */}
      <nav className="flex items-center bg-[#060b13]/80 p-1 rounded-xl border border-slate-800 shadow-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-[0_0_12px_rgba(2,132,199,0.4)] font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-sky-400'}`} />
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  isActive ? 'bg-white text-sky-900' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* RIGHT SECTION: Telemetry Status, Own-Ship, UTC Clock & Settings */}
      <div className="flex items-center gap-3">
        {/* System Health Status */}
        <div 
          onClick={() => setActivePanel('info')}
          className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 cursor-pointer hover:bg-emerald-950/60 transition-colors"
          title="Data Sources Operational: Esri Imagery, NASA AMSR2, USNIC Icebergs, Open-Meteo"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span className="text-[11px] font-mono font-semibold tracking-wide">ALL FEEDS ONLINE</span>
        </div>

        {/* Assigned Ship Callout */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#060b13] border border-slate-800 text-slate-300 font-mono text-[11px]">
          <Ship className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-slate-100">{ownShip?.name || 'R/V POLARIS-01'}</span>
        </div>

        {/* UTC Clock */}
        <div className="flex items-center gap-1.5 bg-[#060b13] border border-slate-800 px-2.5 py-1 rounded-lg font-mono text-[11px] text-sky-300 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold tracking-wider">{utcTime || '10:00:00 UTC'}</span>
        </div>

        {/* Data Provenance & Info Trigger */}
        <button
          onClick={() => setActivePanel('info')}
          className={`p-2 rounded-lg border transition-all ${
            activePanel === 'info'
              ? 'bg-sky-600/30 border-sky-400 text-sky-300'
              : 'bg-[#060b13] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
          title="System Architecture & Data Transparency"
        >
          <Info className="w-4 h-4" />
        </button>

        {/* Settings Trigger */}
        <button
          onClick={() => setActivePanel('settings')}
          className={`p-2 rounded-lg border transition-all ${
            activePanel === 'settings'
              ? 'bg-sky-600/30 border-sky-400 text-sky-300'
              : 'bg-[#060b13] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
          title="Console Settings & AIS Configuration"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

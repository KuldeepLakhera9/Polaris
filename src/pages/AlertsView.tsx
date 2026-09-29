import React, { useState } from 'react';
import { usePolarisStore } from '../store/usePolarisStore';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  Gauge, 
  Activity, 
  Radio, 
  Ship, 
  Anchor, 
  Compass, 
  Waves,
  Trash2
} from 'lucide-react';

export default function AlertsView() {
  const { alerts, dismissAlert, ownShip } = usePolarisStore();
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'critical' | 'warning' | 'advisory'>('ALL');

  const filteredAlerts = alerts.filter(a => severityFilter === 'ALL' || a.type === severityFilter);

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-[#060b13] p-6 text-slate-100 select-none space-y-6">
      {/* Top Banner */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl text-white tracking-wide">
                SITUATIONAL AWARENESS & SENSOR TELEMETRY
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-Time Proximity Warnings, Bow Hull Strain Telemetry & Forward Sonar Depth
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold">
            ● HULL INTEGRITY: NOMINAL
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-[#060b13] border border-slate-800 text-slate-300">
            WATCH: BRIDGE ACTIVE
          </span>
        </div>
      </div>

      {/* Real-Time Vessel Hardware Sensor Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Bow Hull Strain Gauge */}
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                BOW HULL STRAIN SENSOR
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
              SAFE
            </span>
          </div>

          <div className="py-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-heading font-extrabold text-white">18.4 <span className="text-xs font-mono font-normal text-slate-400">MPa</span></span>
              <span className="text-xs font-mono text-slate-400">Yield limit: 45 MPa</span>
            </div>
            {/* Visual Gauge Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-sky-500 to-amber-500 rounded-full transition-all duration-500" 
                style={{ width: `${(18.4 / 45) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 MPa (Calm)</span>
              <span>25 MPa (Ice Transit)</span>
              <span>45 MPa (Max)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Multi-axial fiber-optic strain gauge array welded to forward ice-ramming bow frame. Zero plastic deformation detected.
          </p>
        </div>

        {/* 2. Multibeam Sonar Bathymetry */}
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                FORWARD MULTIBEAM SONAR
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
              CLEAR
            </span>
          </div>

          <div className="py-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-heading font-extrabold text-white">84.5 <span className="text-xs font-mono font-normal text-slate-400">m</span></span>
              <span className="text-xs font-mono text-slate-400">Keel Draft: 6.8 m</span>
            </div>
            {/* Keel Clearance Bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" 
                style={{ width: '78%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 m (Shoal)</span>
              <span>50 m (Safe)</span>
              <span>200 m+ (Deep)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Acoustic bathymetric profiler scanning 500m ahead of vessel keel for submerged ice keels and uncharted sea pinnacles.
          </p>
        </div>

        {/* 3. X-Band Radar Target Tracker */}
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                X-BAND ARPA RADAR LOCKS
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-500/40 font-bold">
              SCANNING
            </span>
          </div>

          <div className="py-2">
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-3xl font-heading font-extrabold text-white">14 <span className="text-xs font-mono font-normal text-slate-400">targets</span></span>
              <span className="text-xs font-mono text-slate-400">Range: 24 nm</span>
            </div>
            {/* Radar scan animation bar */}
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" 
                style={{ width: '42%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0 Collisions</span>
              <span>12 nm Standoff</span>
              <span>24 nm Horizon</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            ARPA target acquisition tracking floes, growlers, and bergy bits. No active collision vectors intersect Route B.
          </p>
        </div>
      </div>

      {/* Situational Awareness Alerts Feed */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
                ACTIVE MARITIME SITUATIONAL AWARENESS FEED
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Filtered proximity advisories, collision avoidance warnings, and weather updates
            </p>
          </div>

          {/* Severity Filter Tabs */}
          <div className="flex bg-[#060b13] p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            {(['ALL', 'critical', 'warning', 'advisory'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSeverityFilter(s)}
                className={`px-3 py-1 rounded-lg uppercase transition-colors cursor-pointer ${
                  severityFilter === s
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => {
              const isCrit = alert.type === 'critical';
              const isWarn = alert.type === 'warning';

              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition-all ${
                    isCrit 
                      ? 'bg-rose-950/30 border-rose-500/50 text-rose-100' 
                      : (isWarn ? 'bg-amber-950/30 border-amber-500/40 text-amber-100' : 'bg-slate-900/60 border-slate-800 text-slate-200')
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl mt-0.5 ${
                      isCrit ? 'bg-rose-900/60 text-rose-400' : (isWarn ? 'bg-amber-900/60 text-amber-400' : 'bg-sky-950 text-sky-400')
                    }`}>
                      {isCrit ? <AlertTriangle className="w-4 h-4" /> : (isWarn ? <AlertTriangle className="w-4 h-4" /> : <Info className="w-4 h-4" />)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-sm">{alert.title}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded uppercase font-semibold bg-slate-950/80 border border-slate-800">
                          {alert.source}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">{alert.message}</p>
                      <span className="text-[10px] font-mono text-slate-500 block pt-0.5">{alert.time}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer"
                    title="Acknowledge & Dismiss"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 font-mono text-xs bg-[#060b13] rounded-xl border border-slate-800 space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
              <div className="font-bold text-slate-200">NO ACTIVE ALERTS IN THIS CATEGORY</div>
              <p className="text-slate-500 text-[11px]">All navigation parameters and vessel sensor streams are within safe nominal thresholds.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

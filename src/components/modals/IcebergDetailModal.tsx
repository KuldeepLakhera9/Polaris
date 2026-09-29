import React from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { formatCoordinatePair } from '../../utils/geo';
import { X, Navigation, Wind, Compass, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';

export default function IcebergDetailModal() {
  const { 
    selectedIceberg, 
    selectIceberg, 
    selectedIcebergDrift, 
    isLoadingDrift 
  } = usePolarisStore();

  if (!selectedIceberg) return null;

  return (
    <div className="absolute top-20 left-16 z-30 w-80 bg-[#0b1220]/95 backdrop-blur-md border border-cyan-500/50 rounded-xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1728] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-cyan-400 stroke-cyan-100">
              <polygon points="12 2, 22 12, 12 22, 2 12" />
            </svg>
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono text-cyan-200 uppercase tracking-wide">
              {selectedIceberg.name}
            </h3>
            <span className="text-[10px] text-slate-400">{selectedIceberg.region} Sector</span>
          </div>
        </div>
        <button
          onClick={() => selectIceberg(null)}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Observation Telemetry */}
      <div className="p-4 space-y-3 text-xs">
        <div className="grid grid-cols-2 gap-2 bg-[#080d17] p-2.5 rounded-lg border border-slate-800/80 font-mono">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">COORDINATES</span>
            <span className="text-slate-200 font-semibold text-[11px] block mt-0.5">
              {formatCoordinatePair(selectedIceberg.latitude, selectedIceberg.longitude)}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">LAST OBSERVED</span>
            <span className="text-slate-200 font-semibold text-[11px] block mt-0.5">
              {selectedIceberg.lastObserved || `Day ${selectedIceberg.observationDayOfYear || '252'}`}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[10px] text-slate-400 font-medium">AUTHORITATIVE SOURCE</div>
          <div className="text-[11px] text-sky-300 font-mono mt-0.5">
            {selectedIceberg.source}
          </div>
        </div>

        {/* Section 6: Real Dead-Reckoning Drift Forecast */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Navigation className="w-3 h-3" />
              <span>24H DEAD-RECKONING DRIFT</span>
            </span>
            {isLoadingDrift && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          </div>

          {selectedIcebergDrift ? (
            <div className="space-y-2">
              {/* Drift Parameters from live wind */}
              <div className="bg-[#080d17] p-2.5 rounded-lg border border-slate-800/80 grid grid-cols-3 gap-1 font-mono text-[10px]">
                <div>
                  <span className="text-slate-400 block text-[9px]">WIND SPEED</span>
                  <span className="text-slate-200 font-bold">
                    {selectedIcebergDrift.parameters.windSpeedKnots} kn
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">DRIFT SPEED</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedIcebergDrift.parameters.calculatedDriftSpeedKn} kn
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px]">BEARING</span>
                  <span className="text-cyan-300 font-bold">
                    {selectedIcebergDrift.parameters.calculatedBearingDeg}°
                  </span>
                </div>
              </div>

              {/* Waypoints breakdown */}
              <div className="space-y-1 font-mono text-[10px]">
                {selectedIcebergDrift.forecast24h.map((step) => (
                  <div 
                    key={step.hoursForward} 
                    className="flex items-center justify-between py-1 px-2 rounded bg-slate-900/60 border border-slate-800/60"
                  >
                    <span className="text-cyan-400 font-bold">+{step.hoursForward}h</span>
                    <span className="text-slate-300">
                      {step.latitude.toFixed(2)}°, {step.longitude.toFixed(2)}°
                    </span>
                    <span className="text-amber-300">±{step.uncertaintyRadiusNm} nm</span>
                  </div>
                ))}
              </div>

              <div className="p-2 rounded bg-cyan-950/30 border border-cyan-800/30 text-[9px] text-cyan-300/80 leading-relaxed">
                {selectedIcebergDrift.model}: 2% atmospheric drag vector + Coriolis rotation. Trajectory rendered on map with dashed cyan leader.
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 italic py-2">
              {isLoadingDrift ? 'Querying live MetOcean winds and computing drift vector...' : 'Click to inspect hydrodynamic trajectory.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

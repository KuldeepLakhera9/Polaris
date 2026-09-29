import React from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { formatCoordinatePair } from '../../utils/geo';
import { 
  X, 
  Navigation, 
  Wind, 
  Compass, 
  ShieldAlert, 
  Loader2, 
  Sparkles,
  Info,
  Calendar
} from 'lucide-react';

export default function IcebergInspectionCard() {
  const { 
    selectedIceberg, 
    selectIceberg, 
    selectedIcebergDrift, 
    isLoadingDrift,
    routePlan,
    selectedRouteId
  } = usePolarisStore();

  if (!selectedIceberg) return null;

  const selectedRoute = routePlan?.routes.find(r => r.id === selectedRouteId) || routePlan?.routes[0];

  return (
    <div className="absolute top-4 left-4 z-30 w-88 bg-[#09111e]/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden select-none animate-in fade-in zoom-in-95 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0d1b2e] to-[#091322] border-b border-cyan-900/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-400/60 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.4)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-cyan-400 stroke-cyan-100">
              <polygon points="12 2, 22 12, 12 22, 2 12" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-sm text-cyan-200 tracking-wide">
                {selectedIceberg.name}
              </h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                {selectedIceberg.region}
              </span>
            </div>
            <span className="text-[10px] text-slate-400">Tracked Large Calving Target</span>
          </div>
        </div>
        <button
          onClick={() => selectIceberg(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
        {/* Core Coordinates & Observation Card */}
        <div className="grid grid-cols-2 gap-2 bg-[#060b13] p-2.5 rounded-xl border border-slate-800 font-mono">
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">COORDINATES</span>
            <span className="text-slate-100 font-bold text-xs block mt-0.5">
              {formatCoordinatePair(selectedIceberg.latitude, selectedIceberg.longitude)}
            </span>
          </div>
          <div>
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block font-semibold">LAST SIGHTING</span>
            <span className="text-slate-200 font-medium text-xs block mt-0.5">
              {selectedIceberg.lastObserved || `Day ${selectedIceberg.observationDayOfYear || '252'}`}
            </span>
          </div>
        </div>

        {/* Source info */}
        <div className="flex items-center justify-between text-[11px] bg-slate-900/50 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <span className="text-slate-400">Catalog Source:</span>
          <span className="text-sky-300 font-medium font-mono text-[10px]">USNIC / NOAA ASCAT</span>
        </div>

        {/* 24-Hour Hydrodynamic Drift Prediction */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-cyan-400 font-heading font-semibold text-xs tracking-wider uppercase">
              <Navigation className="w-3.5 h-3.5" />
              <span>24h Dead-Reckoning Drift Forecast</span>
            </div>
            {isLoadingDrift && <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          </div>

          {selectedIcebergDrift ? (
            <div className="space-y-2.5">
              {/* Drift Parameters from live wind */}
              <div className="bg-[#060b13] p-2.5 rounded-xl border border-cyan-900/30 grid grid-cols-3 gap-1 font-mono text-center">
                <div>
                  <span className="text-slate-400 block text-[9px] font-semibold">WIND</span>
                  <span className="text-slate-100 font-bold text-xs">
                    {selectedIcebergDrift.parameters.windSpeedKnots} kn
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-semibold">DRIFT SPEED</span>
                  <span className="text-cyan-300 font-bold text-xs">
                    {selectedIcebergDrift.parameters.calculatedDriftSpeedKn} kn
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-semibold">BEARING</span>
                  <span className="text-cyan-300 font-bold text-xs">
                    {selectedIcebergDrift.parameters.calculatedBearingDeg}°
                  </span>
                </div>
              </div>

              {/* Waypoints breakdown */}
              <div className="space-y-1 font-mono text-[10px]">
                <div className="text-[9px] text-slate-400 uppercase tracking-wider font-semibold px-1">
                  PROJECTED DRIFT WAYPOINTS (DASHED CYAN ON MAP)
                </div>
                {selectedIcebergDrift.forecast24h.map((step) => (
                  <div 
                    key={step.hoursForward} 
                    className="flex items-center justify-between py-1 px-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80"
                  >
                    <span className="text-cyan-400 font-bold">+{step.hoursForward}h</span>
                    <span className="text-slate-200">
                      {step.latitude.toFixed(2)}°, {step.longitude.toFixed(2)}°
                    </span>
                    <span className="text-amber-300 font-semibold">±{step.uncertaintyRadiusNm} nm error</span>
                  </div>
                ))}
              </div>

              <div className="p-2 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-[10px] text-cyan-300/90 leading-relaxed font-sans">
                💡 <strong>Dynamic Collision Safe-Zone:</strong> The 24h drift vector is projected onto the tactical map. The planned Route B actively stands off beyond the calculated ±uncertainty perimeter.
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#060b13] rounded-xl border border-slate-800 text-center text-slate-400 text-xs italic">
              {isLoadingDrift ? 'Computing hydrodynamic drift trajectory...' : 'Loading drift prediction...'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

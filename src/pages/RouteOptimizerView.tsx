import React from 'react';
import { usePolarisStore } from '../store/usePolarisStore';
import { 
  FolderGit2, 
  Compass, 
  ShieldCheck, 
  Fuel, 
  Clock, 
  Sliders, 
  Check, 
  Download, 
  MapPin, 
  ExternalLink,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  RotateCw
} from 'lucide-react';
import { formatMaritimeCoord } from '../utils/geo';

export default function RouteOptimizerView() {
  const {
    routePlan,
    selectedRouteId,
    setSelectedRouteId,
    safetyFuelPriority,
    setSafetyFuelPriority,
    setActiveTab,
    calculateRoute,
    isGeneratingRoute,
    origin,
    destination
  } = usePolarisStore();

  const selectedRoute = routePlan?.routes.find(r => r.id === selectedRouteId) || routePlan?.routes[0];

  // Derive dynamic recommendation based on user priority slider
  const recommendedIdBySlider = safetyFuelPriority < 35 ? 'A' : (safetyFuelPriority > 65 ? 'C' : 'B');

  const handleExportGpx = () => {
    if (!selectedRoute) return;
    const gpxContent = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Polaris Polar Navigation Co-Pilot" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>Polaris Route ${selectedRoute.id} - ${selectedRoute.label}</name>
    <desc>Calculated with Multi-Hazard Ice Risk Engine</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <rte>
    <name>POLARIS_${selectedRoute.id}</name>
    ${selectedRoute.waypoints.map((wp, idx) => `
    <rtept lat="${wp.latitude}" lon="${wp.longitude}">
      <name>WP${String(idx + 1).padStart(2, '0')}</name>
    </rtept>`).join('')}
  </rte>
</gpx>`;

    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Polaris_Route_${selectedRoute.id}_${origin}_to_${destination}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-[#060b13] p-6 text-slate-100 select-none space-y-6">
      {/* Top Banner */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-400/40 text-sky-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl text-white tracking-wide">
                AI MULTI-OBJECTIVE ROUTE OPTIMIZER
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Pareto Trade-Off Evaluation: Balancing Ice Hazard Standoff, Transit Time, and Fuel Burn
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={calculateRoute}
            disabled={isGeneratingRoute}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isGeneratingRoute ? 'animate-spin text-sky-400' : 'text-slate-400'}`} />
            <span>Recalculate Grid</span>
          </button>

          <button
            onClick={handleExportGpx}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-[0_0_12px_rgba(2,132,199,0.35)] transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ECDIS (.GPX)</span>
          </button>
        </div>
      </div>

      {/* Safety vs Fuel Economy Priority Slider Bar */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span className="font-heading font-bold text-sm text-slate-200 uppercase tracking-wide">
              Navigation Priority Spectrum (Dynamic Trade-Off Slider)
            </span>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Current Focus:{' '}
            <strong className="text-sky-300">
              {safetyFuelPriority < 35 
                ? 'Fuel Economy & Transit Speed (Route A)' 
                : (safetyFuelPriority > 65 ? 'Maximum Ice Standoff (Route C)' : 'Balanced Multi-Objective (Route B)')}
            </strong>
          </div>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={safetyFuelPriority}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setSafetyFuelPriority(val);
              if (val < 35) setSelectedRouteId('A');
              else if (val > 65) setSelectedRouteId('C');
              else setSelectedRouteId('B');
            }}
            className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span className="text-rose-400 font-semibold">◀ Prioritize Speed & Fuel (Route A)</span>
            <span className="text-sky-300 font-bold">● Recommended Balanced (Route B)</span>
            <span className="text-emerald-400 font-semibold">Prioritize Maximum Safety (Route C) ▶</span>
          </div>
        </div>
      </div>

      {/* 3 Candidate Transit Route Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {routePlan?.routes.map((r) => {
          const isSelected = selectedRoute?.id === r.id;
          const isRec = r.isRecommended;

          return (
            <div
              key={r.id}
              onClick={() => setSelectedRouteId(r.id)}
              className={`relative p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-sky-950/40 border-sky-400 shadow-2xl ring-2 ring-sky-400/50'
                  : 'bg-[#09111e] border-slate-800 hover:border-slate-700'
              }`}
            >
              {isRec && (
                <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] font-mono font-bold tracking-wider flex items-center gap-1 shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>AI RECOMMENDED</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading font-extrabold text-base text-white tracking-wide">
                    ROUTE {r.id}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border uppercase ${
                    r.riskScores.level === 'LOW' 
                      ? 'bg-emerald-950 border-emerald-500/40 text-emerald-400' 
                      : 'bg-amber-950 border-amber-500/40 text-amber-400'
                  }`}>
                    {r.riskScores.level} RISK ({r.riskScores.composite}/100)
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4 min-h-[36px]">
                  {r.description}
                </p>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 bg-[#060b13] p-3 rounded-xl border border-slate-800/80 font-mono text-center mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">DISTANCE</span>
                    <span className="text-sm font-bold text-slate-100">{r.distanceNm} <span className="text-[10px] text-slate-400 font-normal">nm</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">TRANSIT</span>
                    <span className="text-sm font-bold text-sky-300">{r.transitHours} <span className="text-[10px] text-slate-400 font-normal">hrs</span></span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">FUEL BURN</span>
                    <span className="text-sm font-bold text-amber-300">{r.estimatedFuelLiters.toLocaleString()} <span className="text-[10px] text-slate-400 font-normal">L</span></span>
                  </div>
                </div>

                {/* Nearest Iceberg Clearance */}
                <div className="flex items-center justify-between text-xs font-mono bg-slate-900/60 px-3 py-2 rounded-lg border border-slate-800 mb-4">
                  <span className="text-slate-400">Closest Iceberg:</span>
                  <span className="font-bold text-cyan-300">{r.closestIceberg.distanceNm} nm clearance</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">
                  {isSelected ? '● ACTIVE ON MAP' : 'CLICK TO SELECT'}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRouteId(r.id);
                    setActiveTab('tactical');
                  }}
                  className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>View on Map</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigational Waypoint Table */}
      {selectedRoute && (
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                  NAVIGATIONAL WAYPOINT LOG — {selectedRoute.label}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Exact steering coordinates formatted for ECDIS and vessel autopilot systems
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Cruising speed: <strong className="text-slate-200">11.5 knots</strong> &bull; Total Waypoints: <strong className="text-sky-300">{selectedRoute.waypoints.length}</strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">WP</th>
                  <th className="py-2.5 px-3">LATITUDE</th>
                  <th className="py-2.5 px-3">LONGITUDE</th>
                  <th className="py-2.5 px-3">LEG DISTANCE</th>
                  <th className="py-2.5 px-3">CUMULATIVE TIME</th>
                  <th className="py-2.5 px-3">ICE RISK LEVEL</th>
                  <th className="py-2.5 px-3">BRIDGE ADVISORY</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedRoute.waypoints.map((wp, idx) => {
                  const isOrigin = idx === 0;
                  const isDest = idx === selectedRoute.waypoints.length - 1;
                  const legDist = idx === 0 ? '0.0 nm' : `${(selectedRoute.distanceNm / (selectedRoute.waypoints.length - 1)).toFixed(1)} nm`;
                  const cumTime = idx === 0 ? '0.0 hrs' : `${((selectedRoute.transitHours / (selectedRoute.waypoints.length - 1)) * idx).toFixed(1)} hrs`;

                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-bold text-sky-400">
                        WP{String(idx + 1).padStart(2, '0')}
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-semibold">
                        {formatMaritimeCoord(wp.latitude, true)}
                      </td>
                      <td className="py-3 px-3 text-slate-200 font-semibold">
                        {formatMaritimeCoord(wp.longitude, false)}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {legDist}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {cumTime}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOrigin || isDest ? 'bg-sky-950 text-sky-400 border border-sky-700/50' : 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                        }`}>
                          {isOrigin ? 'DEPARTURE' : isDest ? 'ARRIVAL' : 'LOW RISK'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px] font-sans">
                        {isOrigin && `Departure from ${origin}. Maintain pilot watch.`}
                        {isDest && `Approach to ${destination}. Engage harbour frequency.`}
                        {!isOrigin && !isDest && `Open navigable lead. Radar watch active for growlers and floes.`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

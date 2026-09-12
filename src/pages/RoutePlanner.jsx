import React, { useState } from "react";
import { Sliders, Navigation, FileDown, CheckCircle2 } from "lucide-react";
import { stations, vessels } from "../data/vessels";
import { routes } from "../data/routes";
import RoutePanel from "../components/RoutePanel";
import StatsCard from "../components/StatsCard";

export default function RoutePlanner({
  origin,
  setOrigin,
  destination,
  setDestination,
  vesselId,
  setVesselId,
  onGenerateRoute,
  isRouteGenerated,
  selectedRouteId,
  setSelectedRouteId
}) {
  const [prioritySlider, setPrioritySlider] = useState(50);
  const [exportNotice, setExportNotice] = useState(false);

  const currentVessel = vessels.find((v) => v.id === vesselId) || vessels[0];
  const originStation = stations.find((s) => s.id === origin) || stations[0];
  const destStation = stations.find((s) => s.id === destination) || stations[1];

  const safetyWeight = (100 - prioritySlider) / 100;
  const fuelWeight = prioritySlider / 100;

  const dynamicDistance = Math.round(780 + safetyWeight * 110);
  const dynamicFuel = Math.round(1080 + safetyWeight * 350);
  const dynamicEta = Math.round(34 + safetyWeight * 9);
  const dynamicRiskScore = Math.round(10 + fuelWeight * 64);

  const handleExportPlan = () => {
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-sky-700" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              ROUTE OPTIMIZATION & PERFORMANCE MODELING
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Configure vessel operating parameters and multiobjective weights for optimal passage planning
          </p>
        </div>
        <button
          onClick={handleExportPlan}
          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-medium flex items-center gap-2 transition cursor-pointer"
        >
          <FileDown className="w-4 h-4 text-slate-600" />
          <span>{exportNotice ? "Plan Exported Successfully" : "Export Passage Plan (ECDIS)"}</span>
        </button>
      </div>

      {/* Main Form and Priority Control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Planning Parameters */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4 font-sans text-xs">
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-sky-700" />
            <span>Transit Parameters</span>
          </h3>

          <div>
            <label className="block text-slate-600 font-medium mb-1">ORIGIN STATION</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.country.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">DESTINATION STATION</label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.country.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-600 font-medium mb-1">ASSIGNED VESSEL</label>
            <select
              value={vesselId}
              onChange={(e) => setVesselId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
            >
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.iceClass.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Priority Slider */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex justify-between items-center mb-2">
              <label className="text-slate-800 font-semibold">OPTIMIZATION OBJECTIVE</label>
              <span className="text-sky-800 font-semibold font-mono">
                {prioritySlider < 40 ? "Safety Priority" : prioritySlider > 60 ? "Fuel Priority" : "Balanced"}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1 font-medium">
              <span className="text-emerald-700">Safety First</span>
              <span className="text-amber-700">Fuel Economy</span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={prioritySlider}
              onChange={(e) => setPrioritySlider(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-700"
            />
            <div className="mt-2 text-[11px] text-slate-500">
              Weight: {100 - prioritySlider}% Safety Margin / {prioritySlider}% Fuel Conservation
            </div>
          </div>

          <button
            onClick={onGenerateRoute}
            className="w-full py-2.5 px-4 rounded-lg bg-sky-700 hover:bg-sky-800 text-white font-semibold tracking-wide uppercase transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>CALCULATE OPTIMAL ROUTE</span>
          </button>
        </div>

        {/* Middle & Right: Dynamic Metrics & Waypoint Inspection */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatsCard
              title="Projected Distance"
              value={dynamicDistance}
              unit="km"
              subtext="Rhumb line + leads"
              icon={Navigation}
              variant="slate"
            />
            <StatsCard
              title="Estimated Fuel"
              value={dynamicFuel.toLocaleString()}
              unit="liters"
              subtext="Marine Diesel"
              icon={Sliders}
              variant="cyan"
            />
            <StatsCard
              title="Transit Duration"
              value={dynamicEta}
              unit="hours"
              subtext="Cruising speed 11.5 kt"
              icon={Navigation}
              variant="slate"
            />
            <StatsCard
              title="Calculated Risk"
              value={`${dynamicRiskScore}/100`}
              unit={dynamicRiskScore <= 30 ? "LOW" : dynamicRiskScore <= 60 ? "MODERATE" : "HIGH"}
              subtext="Hazard index"
              icon={Sliders}
              variant={dynamicRiskScore <= 30 ? "emerald" : dynamicRiskScore <= 60 ? "amber" : "rose"}
            />
          </div>

          {/* Waypoint Coordinates Table */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-800">
                Waypoints Breakdown (Route B Corridor)
              </h3>
              <span className="text-[11px] font-mono text-slate-500">8 WAYPOINTS</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                    <th className="pb-2 font-semibold">WP</th>
                    <th className="pb-2 font-semibold">Latitude</th>
                    <th className="pb-2 font-semibold">Longitude</th>
                    <th className="pb-2 font-semibold">Leg Dist</th>
                    <th className="pb-2 font-semibold">Est. Ice Thick</th>
                    <th className="pb-2 font-semibold">Hazard Index</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {routes[1].waypoints.map((wp, i) => (
                    <tr key={i} className="hover:bg-slate-50/80">
                      <td className="py-2 text-sky-800 font-bold">WP-0{i + 1}</td>
                      <td className="py-2 text-slate-700">{Math.abs(wp[0]).toFixed(2)}° S</td>
                      <td className="py-2 text-slate-700">{wp[1].toFixed(2)}° E</td>
                      <td className="py-2 text-slate-500">~{100 + (i * 5)} km</td>
                      <td className="py-2 text-slate-500">{i === 3 ? "0.8m (leads)" : "0.3m (thin)"}</td>
                      <td className="py-2">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          CLEAR
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Route Panel Comparison */}
      <RoutePanel
        selectedRouteId={selectedRouteId}
        onSelectRoute={(id) => setSelectedRouteId(id)}
      />
    </div>
  );
}

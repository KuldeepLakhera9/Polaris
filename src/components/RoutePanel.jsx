import React from "react";
import { routes } from "../data/routes";
import { Check, ShieldCheck, Compass, ArrowRight, Gauge, AlertTriangle } from "lucide-react";

export default function RoutePanel({ selectedRouteId, onSelectRoute }) {
  const getRiskBadge = (risk) => {
    switch (risk.toLowerCase()) {
      case "low":
      case "very low":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "moderate":
        return "bg-amber-50 text-amber-800 border-amber-200";
      default:
        return "bg-rose-50 text-rose-700 border-rose-200";
    }
  };

  return (
    <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-700" />
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900">
              Route Evaluation & Trade-off Analysis
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-sans mt-0.5">
            Compare multi-objective navigational alternatives (Safety vs. Fuel Economy vs. Transit Time)
          </p>
        </div>
        <div className="text-[11px] font-medium text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          CLICK CARD TO VIEW WAYPOINTS ON MAP
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          const isRec = route.recommended;

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route.id)}
              className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? isRec
                    ? "border-sky-500 bg-sky-50/60 shadow-sm ring-2 ring-sky-500/20"
                    : "border-slate-400 bg-slate-50 shadow-sm ring-2 ring-slate-400/20"
                  : isRec
                  ? "border-sky-200 bg-sky-50/20 hover:border-sky-300"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              {/* Recommended Badge */}
              {isRec && (
                <div className="absolute -top-2.5 right-3 px-2.5 py-0.5 rounded-full bg-sky-700 text-white text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-xs">
                  <Check className="w-3 h-3 stroke-[3]" />
                  RECOMMENDED
                </div>
              )}

              {/* Title & Risk */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-900">
                  ROUTE {route.id}
                </span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase ${getRiskBadge(route.risk)}`}>
                  Risk: {route.risk}
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 mb-3 text-center">
                <div>
                  <span className="block text-[10px] font-medium text-slate-500">DISTANCE</span>
                  <span className="text-xs font-bold font-mono text-slate-900">
                    {route.distance} <span className="text-[9px] text-slate-400 font-normal">km</span>
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-slate-500">FUEL</span>
                  <span className="text-xs font-bold font-mono text-sky-800">
                    {route.fuel.toLocaleString()} <span className="text-[9px] text-slate-400 font-normal">L</span>
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-slate-500">ETA</span>
                  <span className="text-xs font-bold font-mono text-slate-800">
                    {route.eta} <span className="text-[9px] text-slate-400 font-normal">hrs</span>
                  </span>
                </div>
              </div>

              {/* Summary description */}
              <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                {route.summary}
              </p>

              {/* Visual Active Indicator */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                <span className={isSelected ? "text-sky-700 font-semibold" : "text-slate-400"}>
                  {isSelected ? "● ACTIVE ON MAP" : "CLICK TO PREVIEW"}
                </span>
                <span className="text-slate-500">{route.avgSpeedKnots} kt cruising</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trade-Off Comparison Bar */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-600 mb-2">
          <span>Safety vs Fuel Economy Trade-off Spectrum</span>
          <span className="text-slate-500 font-mono">Pareto Optimal Analysis</span>
        </div>
        <div className="relative h-7 bg-white rounded-lg p-1 flex items-center border border-slate-200 shadow-2xs">
          <div className="flex-1 text-center text-[10px] font-semibold text-rose-700 border-r border-slate-200">
            Route A (High Speed / Hazard)
          </div>
          <div className="flex-1 text-center text-[10px] font-bold text-sky-900 border-r border-slate-200 bg-sky-50 rounded">
            Route B ✓ (Balanced Optimal)
          </div>
          <div className="flex-1 text-center text-[10px] font-semibold text-emerald-700">
            Route C (Ultra Safe / High Fuel)
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Compass, Ship, Calendar, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { stations, vessels } from "../data/vessels";
import RiskPanel from "./RiskPanel";
import AlertPanel from "./AlertPanel";
import ForecastChart from "./ForecastChart";

export default function Sidebar({
  origin,
  setOrigin,
  destination,
  setDestination,
  vesselId,
  setVesselId,
  departureTime,
  setDepartureTime,
  onGenerateRoute,
  isGenerating,
  isRouteGenerated,
  riskData,
  alerts
}) {
  return (
    <aside className="w-full lg:w-[340px] shrink-0 space-y-4">
      {/* Voyage Planner Form Card */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-700" />
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-800">
              Voyage Planner
            </h2>
          </div>
          <span className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
            AUTO-ROUTING
          </span>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onGenerateRoute();
          }}
          className="space-y-3 font-sans text-xs"
        >
          {/* Origin Station */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-sky-600" />
              <span>ORIGIN STATION</span>
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-600 focus:bg-white cursor-pointer font-medium"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.country.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Destination Station */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3 h-3 text-emerald-600" />
              <span>DESTINATION</span>
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-600 focus:bg-white cursor-pointer font-medium"
            >
              {stations.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.country.split(" ")[0]})
                </option>
              ))}
            </select>
          </div>

          {/* Vessel Selection */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Ship className="w-3 h-3 text-sky-600" />
              <span>ASSIGNED VESSEL</span>
            </label>
            <select
              value={vesselId}
              onChange={(e) => setVesselId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-600 focus:bg-white cursor-pointer font-medium"
            >
              {vessels.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} [{v.iceClass.split(" ")[0]}]
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date & Time */}
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>DEPARTURE TIME (UTC)</span>
            </label>
            <input
              type="datetime-local"
              value={departureTime}
              onChange={(e) => setDepartureTime(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 text-xs focus:outline-none focus:border-sky-600 focus:bg-white cursor-pointer font-mono"
            />
          </div>

          {/* Generate Route Primary Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className={`w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
              isGenerating
                ? "bg-sky-100 text-sky-800 border border-sky-300 cursor-wait"
                : "bg-sky-700 hover:bg-sky-800 text-white active:scale-[0.99]"
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-sky-800" />
                <span>EVALUATING HAZARDS...</span>
              </>
            ) : (
              <>
                <span>GENERATE ROUTE →</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Risk Panel */}
      <RiskPanel riskData={riskData} isGenerated={isRouteGenerated} />

      {/* Sea-Ice Forecast Card */}
      <ForecastChart compact={true} />

      {/* Navigation Alerts Panel */}
      <AlertPanel alerts={alerts} />
    </aside>
  );
}

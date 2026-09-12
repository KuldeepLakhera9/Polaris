import React from "react";
import { Snowflake, Radar, Compass, TrendingUp, AlertTriangle, Satellite, ShieldCheck } from "lucide-react";
import ForecastChart from "../components/ForecastChart";
import StatsCard from "../components/StatsCard";
import { icebergs } from "../data/icebergs";
import { iceClassification, hourlyIceTrend } from "../data/forecast";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function IceIntelligence() {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-sky-700" />
            <h2 className="text-base font-bold tracking-tight text-slate-900">
              ICE INTELLIGENCE & HYDRODYNAMIC DRIFT PREDICTION
            </h2>
          </div>
          <p className="text-xs text-slate-500 font-sans mt-0.5">
            Synthetic Aperture Radar (SAR) Satellite Telemetry & Numerical Drift Modeling
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
            SAR CYCLE: 12 MIN
          </span>
          <span className="px-2.5 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200 font-medium">
            SIMULATED TELEMETRY
          </span>
        </div>
      </div>

      {/* Top Key Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard
          title="Current Ice Concentration"
          value="68%"
          unit="mean"
          subtext="Sensor: Sentinel-1 C-Band SAR"
          icon={Snowflake}
          variant="cyan"
          change="+3.2% (24h)"
          isPositive={false}
        />
        <StatsCard
          title="Active Icebergs Tracked"
          value={icebergs.length}
          unit="targets"
          subtext="Confidence: 76% - 91%"
          icon={Radar}
          variant="amber"
          badge="RADAR LOCKED"
        />
        <StatsCard
          title="Mean Drift Velocity"
          value="1.6"
          unit="knots"
          subtext="Vector: East-South-East (115°)"
          icon={Compass}
          variant="slate"
        />
        <StatsCard
          title="Multi-Year Ice Index"
          value="14.2%"
          unit="ridged"
          subtext="Thermal anomaly: -1.8°C"
          icon={ShieldCheck}
          variant="emerald"
          badge="NORMAL"
        />
      </div>

      {/* Main Grid: Forecast Charts & Ice Classification */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Forecast Chart Card */}
        <div className="lg:col-span-2 space-y-4">
          <ForecastChart compact={false} />

          {/* Hourly 24h Trend Chart */}
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-700" />
                <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                  24-Hour Diurnal Ice Motion & Hazard Index
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                RESOLUTION: 4-HOUR TIME-SERIES
              </span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyIceTrend} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hazardGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                  <YAxis domain={[15, 35]} stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={{ stroke: "#e2e8f0" }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}
                    labelStyle={{ color: "#0f172a", fontWeight: "bold" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="hazardLevel"
                    name="Hazard Index"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#hazardGradientLight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Ice Classification Breakdown */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <Satellite className="w-4 h-4 text-sky-700" />
              <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
                Sea-Ice Type Classification
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 font-sans mb-3">
              Automated pixel segmentation from dual-polarization Sentinel-1 SAR imagery.
            </p>
            <div className="space-y-2.5 font-sans">
              {iceClassification.map((item, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-800 font-semibold">{item.type}</span>
                    <span className="text-sky-700 font-bold font-mono">{item.coverage}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.riskLevel}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-sky-50 border border-sky-200 text-[11px] text-sky-900 font-medium">
            <strong>RECOMMENDATION:</strong> Follow navigable leads (&lt; 25% concentration) to minimize vessel hull drag and fuel consumption.
          </div>
        </div>
      </div>

      {/* Iceberg Trajectory Matrix Table */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
              Iceberg Trajectory & 24-Hour Projected Drift Matrix
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            HYDRODYNAMIC DRIFT MODEL
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] text-slate-500 uppercase">
                <th className="pb-2.5 font-semibold">Target ID</th>
                <th className="pb-2.5 font-semibold">Current Position</th>
                <th className="pb-2.5 font-semibold">Drift Vector</th>
                <th className="pb-2.5 font-semibold">24h Projected Position</th>
                <th className="pb-2.5 font-semibold">Dimensions</th>
                <th className="pb-2.5 font-semibold">Confidence</th>
                <th className="pb-2.5 font-semibold">Vessel Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {icebergs.map((berg) => {
                const isHigh = berg.risk === "high";
                return (
                  <tr key={berg.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="text-xs">🧊</span>
                      <span>#{berg.id}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({berg.name})</span>
                    </td>
                    <td className="py-3 text-slate-700">
                      {Math.abs(berg.lat)}°S, {berg.lng}°E
                    </td>
                    <td className="py-3 text-slate-700">
                      <span className="flex items-center gap-1">
                        <span>→ {berg.drift}</span>
                        <span className="text-slate-400 text-[11px]">({berg.driftSpeedKnots || 1.4} kt)</span>
                      </span>
                    </td>
                    <td className="py-3 text-sky-800 font-semibold">
                      {Math.abs(berg.predLat)}°S, {berg.predLng}°E
                    </td>
                    <td className="py-3 text-slate-600">{berg.dimensions || "15km x 5km"}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-sky-600 rounded-full"
                            style={{ width: `${berg.confidence}%` }}
                          />
                        </div>
                        <span className="text-slate-700 text-[10px]">{berg.confidence}%</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase inline-flex items-center gap-1 ${
                          isHigh
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <AlertTriangle className="w-3 h-3" />
                        {berg.risk}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

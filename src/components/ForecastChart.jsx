import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Snowflake, TrendingUp } from "lucide-react";
import { forecast } from "../data/forecast";

export default function ForecastChart({ compact = false }) {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-2.5 rounded-lg shadow-md text-xs font-mono">
          <p className="text-sky-800 font-bold mb-1">{label} Forecast</p>
          <p className="text-slate-800">
            Concentration: <span className="text-sky-600 font-bold">{data.concentration}%</span>
          </p>
          {data.iceThicknessCm && (
            <p className="text-slate-500">
              Thickness: <span className="text-slate-700">{data.iceThicknessCm} cm</span>
            </p>
          )}
          {data.windKnots && (
            <p className="text-slate-500">
              Wind: <span className="text-slate-700">{data.windKnots} kt</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Snowflake className="w-4 h-4 text-sky-600" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-slate-700">
            Sea-Ice Forecast (7-Day)
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-medium text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded">
          <TrendingUp className="w-3 h-3" />
          +11% trend
        </span>
      </div>

      {/* Grid of 4 days */}
      <div className="grid grid-cols-4 gap-1.5 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-200/80">
        {forecast.map((item, idx) => (
          <div key={idx} className="text-center">
            <span className="block text-[10px] font-medium text-slate-500 mb-0.5">
              {item.day}
            </span>
            <span className="text-sm font-bold font-mono text-slate-900">
              {item.concentration}%
            </span>
          </div>
        ))}
      </div>

      {/* Recharts Area Chart */}
      <div className={compact ? "h-28 w-full" : "h-36 w-full"}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecast} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="iceGradientLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              domain={[60, 90]}
              stroke="#94a3b8"
              fontSize={10}
              tickLine={false}
              axisLine={{ stroke: "#e2e8f0" }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="concentration"
              stroke="#0284c7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#iceGradientLight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

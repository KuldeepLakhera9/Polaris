import React from "react";
import { AlertTriangle, ArrowUpRight, Radar } from "lucide-react";

export default function IcebergPopup({ iceberg }) {
  if (!iceberg) return null;

  const isHighRisk = iceberg.risk === "high";

  const getDriftArrowRotation = (drift) => {
    switch (drift.toLowerCase()) {
      case "north": return "rotate-0";
      case "north-east": return "rotate-45";
      case "east": return "rotate-90";
      case "south-east": return "rotate-135";
      case "south": return "rotate-180";
      case "south-west": return "rotate-225";
      case "west": return "rotate-270";
      case "north-west": return "rotate-315";
      default: return "rotate-45";
    }
  };

  return (
    <div className="w-72 p-3.5 bg-white text-slate-800 rounded-xl border border-slate-200 shadow-xl font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-sky-50 border border-sky-200 text-sky-700">
            <Radar className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-mono tracking-wider text-slate-900">
              ICEBERG #{iceberg.id}
            </h4>
            <span className="text-[10px] text-slate-500">
              {iceberg.name || "Target Track"}
            </span>
          </div>
        </div>
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded border uppercase flex items-center gap-1 ${
            isHighRisk
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          {iceberg.risk}
        </span>
      </div>

      {/* Position Matrix */}
      <div className="space-y-1.5 text-xs font-mono mb-3">
        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 text-[11px]">Current Position:</span>
          <span className="text-slate-900 font-semibold text-[11px]">
            {Math.abs(iceberg.lat).toFixed(2)}° S, {Math.abs(iceberg.lng).toFixed(2)}° E
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 text-[11px]">Predicted Drift:</span>
          <span className="flex items-center gap-1 text-sky-800 font-semibold text-[11px]">
            <ArrowUpRight className={`w-3.5 h-3.5 ${getDriftArrowRotation(iceberg.drift)}`} />
            {iceberg.drift} {iceberg.driftSpeedKnots ? `(${iceberg.driftSpeedKnots} kt)` : ""}
          </span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-slate-100">
          <span className="text-slate-500 text-[11px]">24h Prediction:</span>
          <span className="text-sky-700 font-bold text-[11px]">
            {Math.abs(iceberg.predLat).toFixed(2)}° S, {Math.abs(iceberg.predLng).toFixed(2)}° E
          </span>
        </div>

        <div className="flex justify-between items-center py-1">
          <span className="text-slate-500 text-[11px]">Confidence Score:</span>
          <div className="flex items-center gap-2">
            <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-600 rounded-full"
                style={{ width: `${iceberg.confidence}%` }}
              />
            </div>
            <span className="text-slate-700 font-bold text-[11px]">{iceberg.confidence}%</span>
          </div>
        </div>
      </div>

      {/* Dimensions & Hazard note */}
      {iceberg.dimensions && (
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200/80 mb-2 text-[10px] font-mono text-slate-700 flex justify-between">
          <span>Dimensions: <strong className="text-slate-900">{iceberg.dimensions}</strong></span>
          <span>Freeboard: <strong className="text-slate-900">{iceberg.freeboardMeters}m</strong></span>
        </div>
      )}

      {iceberg.hazardNotes && (
        <p className="text-[10px] text-amber-900 bg-amber-50/70 border border-amber-200 p-2 rounded leading-tight mb-2">
          {iceberg.hazardNotes}
        </p>
      )}

      <div className="text-[9px] font-mono text-slate-400 flex justify-between items-center pt-1 border-t border-slate-100">
        <span>SAR SATELLITE DERIVED</span>
        <span className="text-slate-500">HYDRODYNAMIC MODEL</span>
      </div>
    </div>
  );
}

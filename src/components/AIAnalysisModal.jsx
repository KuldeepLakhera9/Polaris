import React, { useState, useEffect } from "react";
import { Loader2, CheckCircle2, Navigation, Compass, Layers } from "lucide-react";

export default function AIAnalysisModal({ isOpen, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const steps = [
    "Loading sea-ice concentration & SAR satellite imagery",
    "Tracking iceberg hydrodynamic drift vectors (A-17 & B-42)",
    "Analyzing ocean swell, bathymetry & katabatic wind shear",
    "Evaluating structural ice pressure & vessel hull risk",
    "Computing optimal navigable lead waypoint trajectory"
  ];

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setIsFinished(false);
      return;
    }

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setStepIndex(currentStep);
      } else if (currentStep === steps.length) {
        setIsFinished(true);
        setTimeout(() => {
          clearInterval(interval);
          if (onComplete) onComplete();
        }, 700);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-xs transition-opacity">
      <div className="relative w-full max-w-lg mx-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 mb-5 border-b border-slate-100 pb-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700">
            <Compass className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900">
              Calculating Optimal Polar Route
            </h3>
            <p className="text-[11px] font-medium text-slate-500">
              Multimodal Marine Decision Support System
            </p>
          </div>
        </div>

        {/* Staggered Steps */}
        <div className="space-y-2.5 mb-6 font-sans text-xs">
          {steps.map((step, idx) => {
            const isCompleted = idx < stepIndex || isFinished;
            const isCurrent = idx === stepIndex && !isFinished;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  isCompleted
                    ? "border-emerald-200 bg-emerald-50/50 text-emerald-900"
                    : isCurrent
                    ? "border-sky-300 bg-sky-50/60 text-slate-900 font-medium shadow-xs"
                    : "border-slate-200/60 bg-slate-50/50 text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-sky-600 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span>{step}</span>
                </div>
                {isCompleted && (
                  <span className="text-[10px] text-emerald-700 font-mono font-semibold uppercase">
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Banner */}
        {isFinished && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Optimal Route Computed — Navigable Lead Selected</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
          <span className="flex items-center gap-1.5 text-slate-600">
            <Layers className="w-3.5 h-3.5 text-sky-600" />
            HYDRODYNAMIC DRIFT MODEL
          </span>
          <span className="text-slate-500 font-medium">
            Demo Simulation Model
          </span>
        </div>
      </div>
    </div>
  );
}

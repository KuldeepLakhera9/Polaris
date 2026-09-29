import React from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { formatMaritimeCoord } from '../../utils/geo';
import { Moon, Sun, Database, Radio, Ship, Compass } from 'lucide-react';

export default function BottomCenterHud() {
  const { 
    ownShip, 
    selectedVessel, 
    dayNightScrubHours, 
    setDayNightScrubHours,
    aisStatus 
  } = usePolarisStore();

  const activeShip = selectedVessel || ownShip;

  const cogValue = activeShip ? `${String(Math.round(activeShip.cog)).padStart(3, '0')}°` : '342°';
  const sogValue = activeShip ? `${activeShip.sog.toFixed(1)} kn` : '11.5 kn';
  const latStr = activeShip ? formatMaritimeCoord(activeShip.latitude, true) : "78° 13.40' N";
  const lonStr = activeShip ? formatMaritimeCoord(activeShip.longitude, false) : "15° 38.80' E";

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* 1. Day / Night Solar Scrubber Slider */}
      <div className="flex items-center gap-2.5 bg-[#09111e]/90 backdrop-blur-md border border-slate-700/80 rounded-full px-3.5 py-1 shadow-xl text-[11px] font-mono text-slate-300">
        <Moon className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold hidden sm:inline">SOLAR:</span>
        <input
          type="range"
          min="0"
          max="24"
          step="0.5"
          value={dayNightScrubHours}
          onChange={(e) => setDayNightScrubHours(parseFloat(e.target.value))}
          className="w-24 sm:w-32 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
          title={`Solar Ephemeris: ${dayNightScrubHours}:00 UTC`}
        />
        <span className="text-sky-300 font-bold min-w-[45px]">{String(Math.floor(dayNightScrubHours)).padStart(2, '0')}:00 UTC</span>
        <Sun className="w-3.5 h-3.5 text-amber-400" />
      </div>

      {/* 2. Vessel Telemetry Bar */}
      <div className="flex items-center bg-[#09111e]/95 backdrop-blur-xl border border-slate-700/80 rounded-xl px-5 py-2 shadow-2xl gap-5 text-xs font-mono">
        {/* SHIP NAME */}
        <div className="flex items-center gap-2">
          <Ship className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold text-slate-100">{activeShip?.name || 'R/V POLARIS-01'}</span>
        </div>

        <div className="w-px h-4 bg-slate-800" />

        {/* COG */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider">COG</span>
          <span className="text-sky-300 font-bold tracking-wide">{cogValue}</span>
        </div>

        <div className="w-px h-4 bg-slate-800" />

        {/* SOG */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider">SOG</span>
          <span className="text-emerald-300 font-bold tracking-wide">{sogValue}</span>
        </div>

        <div className="w-px h-4 bg-slate-800 hidden sm:block" />

        {/* POSITION */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold tracking-wider">POS</span>
          <span className="text-slate-100 font-semibold tracking-wide">
            {latStr} &nbsp; {lonStr}
          </span>
        </div>
      </div>
    </div>
  );
}

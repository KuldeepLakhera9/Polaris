import React, { useState } from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { formatMaritimeCoord } from '../../utils/geo';
import { Maximize2, Minimize2 } from 'lucide-react';

export default function CursorPanel() {
  const { cursorPos, cursorDistanceBearing } = usePolarisStore();
  const [isMinimized, setIsMinimized] = useState(false);

  const latStr = cursorPos ? formatMaritimeCoord(cursorPos.lat, true) : "79° 38.39' N";
  const lonStr = cursorPos ? formatMaritimeCoord(cursorPos.lon, false) : "47° 38.20' E";

  const distStr = cursorDistanceBearing 
    ? `${cursorDistanceBearing.distanceNm} nm / ${cursorDistanceBearing.bearingDeg}°` 
    : "397.5 nm / 60°";

  return (
    <div className="absolute bottom-6 left-4 z-20 select-none">
      <div className="bg-[#0a101d]/90 backdrop-blur-md border border-slate-800 rounded-lg p-3 w-64 shadow-2xl transition-all">
        {/* Card Header with Expand/Minimize Icon */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
            CURSOR
          </span>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-slate-500 hover:text-slate-300 transition-colors p-0.5"
            title={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
          </button>
        </div>

        {/* Live Cursor Coordinate Readout */}
        <div className="font-mono text-sm font-semibold tracking-wide text-slate-100">
          {latStr}, {lonStr}
        </div>

        {!isMinimized && (
          <div className="mt-2.5 pt-2 border-t border-slate-800/80">
            <div className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              DISTANCE FROM SHIP
            </div>
            <div className="font-mono text-xs font-bold text-amber-400 tracking-wider mt-0.5">
              {distStr}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

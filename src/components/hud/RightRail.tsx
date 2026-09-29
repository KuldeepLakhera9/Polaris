import React from 'react';
import { Layers, Snowflake, FolderGit2, CloudSunRain, Ship, Settings } from 'lucide-react';
import { usePolarisStore } from '../../store/usePolarisStore';

export default function RightRail() {
  const { activePanel, setActivePanel, layers, toggleLayer } = usePolarisStore();

  return (
    <div className="absolute top-20 right-4 z-20 flex flex-col gap-1 bg-[#0a101d]/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-2xl">
      {/* Layers Panel Toggle */}
      <button
        onClick={() => setActivePanel('layers')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          activePanel === 'layers' 
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300'
        }`}
        title="Map Layers (Satellite, Sea Ice, Icebergs, AIS, SAR)"
      >
        <Layers className="w-4 h-4" />
      </button>

      {/* Sea-Ice / Snow Quick Toggle */}
      <button
        onClick={() => toggleLayer('iceConcentration')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          layers.iceConcentration 
            ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-[0_0_8px_rgba(6,182,212,0.3)]' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-400 hover:text-slate-200'
        }`}
        title="Toggle NASA Sea-Ice Concentration Layer"
      >
        <Snowflake className="w-4 h-4" />
      </button>

      {/* Route Planning & Saved Routes */}
      <button
        onClick={() => setActivePanel('routes')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          activePanel === 'routes' 
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300'
        }`}
        title="Voyage Route Planner & Risk Analysis (§5)"
      >
        <FolderGit2 className="w-4 h-4" />
      </button>

      {/* MetOcean Weather Telemetry */}
      <button
        onClick={() => setActivePanel('weather')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          activePanel === 'weather' 
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300'
        }`}
        title="MetOcean Weather & Wave Telemetry"
      >
        <CloudSunRain className="w-4 h-4" />
      </button>

      {/* AIS Vessel Fleet Filter */}
      <button
        onClick={() => setActivePanel('vessels')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          activePanel === 'vessels' 
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300'
        }`}
        title="AIS Vessel Directory & Radar Targets"
      >
        <Ship className="w-4 h-4" />
      </button>

      <div className="w-full h-px bg-slate-800 my-0.5" />

      {/* Settings Modal Toggle */}
      <button
        onClick={() => setActivePanel('settings')}
        className={`w-9 h-9 flex items-center justify-center rounded transition-colors ${
          activePanel === 'settings' 
            ? 'bg-sky-600/30 text-sky-300 border border-sky-500/50' 
            : 'bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300'
        }`}
        title="Console Settings & AISstream API Key"
      >
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
}

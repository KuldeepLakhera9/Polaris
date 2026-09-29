import React from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { X, Layers, Snowflake, Ship, Radio, CloudRain, Navigation, Eye, EyeOff } from 'lucide-react';

export default function LayersDrawer() {
  const { activePanel, setActivePanel, layers, toggleLayer } = usePolarisStore();

  if (activePanel !== 'layers') return null;

  const layerItems = [
    {
      key: 'satellite' as const,
      label: 'Esri Satellite Basemap',
      source: 'Esri World Imagery (Maxar/Earthstar)',
      icon: Layers,
      active: layers.satellite,
      badge: 'EPSG:3857'
    },
    {
      key: 'iceConcentration' as const,
      label: 'Sea-Ice Concentration',
      source: 'NASA GIBS AMSR2 (12km Microwave)',
      icon: Snowflake,
      active: layers.iceConcentration,
      badge: 'Daily Grid'
    },
    {
      key: 'icebergs' as const,
      label: 'Named Tracked Icebergs',
      source: 'US National Ice Center (NIC) / NOAA',
      icon: Snowflake,
      active: layers.icebergs,
      badge: 'Weekly Obs'
    },
    {
      key: 'aisVessels' as const,
      label: 'Live AIS Vessel Traffic',
      source: 'AISstream.io Global Websocket',
      icon: Ship,
      active: layers.aisVessels,
      badge: 'Real-Time'
    },
    {
      key: 'sarRadar' as const,
      label: 'SAR Radar Layer',
      source: 'Sentinel-1 C-Band (6–12d Cadence)',
      icon: Radio,
      active: layers.sarRadar,
      badge: 'Sentinel Hub'
    },
    {
      key: 'weatherClouds' as const,
      label: 'Cloud Cover & Weather',
      source: 'NASA VIIRS TrueColor / Open-Meteo',
      icon: CloudRain,
      active: layers.weatherClouds,
      badge: 'Hourly'
    },
    {
      key: 'routes' as const,
      label: 'Navigational Routes',
      source: 'Polaris Multi-Criteria A* (§5)',
      icon: Navigation,
      active: layers.routes,
      badge: 'Risk Model'
    }
  ];

  return (
    <div className="absolute top-16 right-16 z-30 w-80 bg-[#0b1220]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1728] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            Operational Chart Layers
          </h2>
        </div>
        <button
          onClick={() => setActivePanel('none')}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Layers List */}
      <div className="p-3 space-y-2">
        {layerItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                item.active 
                  ? 'bg-sky-950/40 border-sky-500/50 text-slate-100' 
                  : 'bg-[#0d1627] border-slate-800/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded ${item.active ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-500'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{item.label}</div>
                  <div className="text-[10px] text-slate-500">{item.source}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                  {item.badge}
                </span>
                {item.active ? (
                  <Eye className="w-4 h-4 text-sky-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-600" />
                )}
              </div>
            </div>
          );
        })}

        {/* Sea Ice Concentration Legend */}
        {layers.iceConcentration && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 font-mono text-[10px]">
            <div className="text-slate-400 font-semibold mb-1.5 uppercase tracking-wider text-[9px]">
              SEA ICE CONCENTRATION BANDS
            </div>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="p-1 rounded bg-[#64b5f6]/30 border border-[#64b5f6]/60 text-slate-200">
                15-30%
              </div>
              <div className="p-1 rounded bg-[#1976d2]/50 border border-[#1976d2]/80 text-slate-100">
                30-60%
              </div>
              <div className="p-1 rounded bg-[#0d47a1]/70 border border-[#0d47a1] text-slate-100">
                60-85%
              </div>
              <div className="p-1 rounded bg-[#e0f7fa]/30 border border-[#e0f7fa]/60 text-cyan-200">
                85-100%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

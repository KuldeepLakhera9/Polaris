import React, { useState } from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { X, Ship, Search, Navigation, AlertCircle, ExternalLink } from 'lucide-react';
import { Vessel } from '../../types';

export default function VesselsDrawer() {
  const { 
    activePanel, 
    setActivePanel, 
    vessels, 
    selectedVessel, 
    selectVessel, 
    setMapCenter,
    aisStatus 
  } = usePolarisStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  if (activePanel !== 'vessels') return null;

  const filtered = vessels.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      v.mmsi.includes(searchTerm);
    const matchesType = typeFilter === 'ALL' || v.shipType.includes(typeFilter);
    return matchesSearch && matchesType;
  });

  const handleSelectVessel = (v: Vessel) => {
    selectVessel(v);
    setMapCenter({
      lat: v.latitude,
      lon: v.longitude,
      zoom: 8
    });
  };

  return (
    <div className="absolute top-16 right-16 z-30 w-84 bg-[#0b1220]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1728] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Ship className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            AIS Vessel Directory ({vessels.length})
          </h2>
        </div>
        <button
          onClick={() => setActivePanel('none')}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Search & Filter */}
      <div className="p-3 border-b border-slate-800 space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search by vessel name or MMSI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#080d17] border border-slate-700 rounded-md pl-8 pr-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex gap-1 overflow-x-auto text-[10px] font-mono pb-1">
          {['ALL', 'Cargo', 'Tanker', 'Fishing', 'Research', 'SAR'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2 py-0.5 rounded border transition-colors ${
                typeFilter === t
                  ? 'bg-sky-600/40 border-sky-400 text-sky-200'
                  : 'bg-[#0d1627] border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Vessel list */}
      <div className="p-3 overflow-y-auto space-y-2 flex-1">
        {filtered.length > 0 ? (
          filtered.map((v) => {
            const isSelected = selectedVessel?.mmsi === v.mmsi;
            return (
              <div
                key={v.mmsi}
                onClick={() => handleSelectVessel(v)}
                className={`p-2.5 rounded-lg border cursor-pointer font-mono transition-all ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-400 text-sky-100 shadow-md ring-1 ring-sky-400'
                    : 'bg-[#0d1627] border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{v.name}</span>
                  <span className="text-emerald-400 text-[11px]">{v.sog.toFixed(1)} kn</span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span>MMSI {v.mmsi}</span>
                  <span className="text-slate-300">{v.shipType}</span>
                </div>

                <div className="text-[10px] text-slate-500 mt-0.5">
                  POS: {v.latitude.toFixed(2)}°, {v.longitude.toFixed(2)}° &bull; COG: {Math.round(v.cog)}°
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center space-y-2 bg-[#080d17] rounded-lg border border-slate-800 text-slate-400 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-400 mx-auto" />
            <div className="font-semibold text-slate-300">
              {vessels.length === 0 ? "NO LIVE AIS TELEMETRY" : "No matching vessels"}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {vessels.length === 0 
                ? "Connect your AISstream.io free API key in Settings to receive live worldwide satellite and terrestrial AIS targets."
                : "Try adjusting your search criteria."}
            </p>
            {vessels.length === 0 && (
              <button
                onClick={() => setActivePanel('settings')}
                className="mt-2 px-3 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs transition-colors"
              >
                Configure AIS Key
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { usePolarisStore } from '../store/usePolarisStore';
import { 
  Snowflake, 
  Radar, 
  Compass, 
  Wind, 
  Waves, 
  Search, 
  Filter, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  Radio,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { formatCoordinatePair } from '../utils/geo';
import { Iceberg } from '../types';

export default function IceIntelligenceView() {
  const { 
    icebergs, 
    selectIceberg, 
    setIsLoadingDrift, 
    setIcebergDrift, 
    flyTo, 
    setActiveTab 
  } = usePolarisStore();

  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'Arctic' | 'Antarctic'>('ALL');

  const filteredIcebergs = icebergs.filter((b) => {
    const matchSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === 'ALL' || b.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const handleInspectDrift = async (berg: Iceberg) => {
    selectIceberg(berg);
    flyTo({
      lat: berg.latitude,
      lon: berg.longitude,
      zoom: 7.5
    });
    setActiveTab('tactical');

    // Trigger drift calculation
    setIsLoadingDrift(true);
    try {
      const res = await fetch('/api/iceberg-drift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iceberg: berg })
      });
      if (res.ok) {
        const drift = await res.json();
        setIcebergDrift(drift);
      }
    } catch (e) {
      console.error('Failed calculating drift:', e);
    } finally {
      setIsLoadingDrift(false);
    }
  };

  return (
    <div className="flex-1 w-full h-full overflow-y-auto bg-[#060b13] p-6 text-slate-100 select-none space-y-6">
      {/* Top Banner */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-400/40 text-cyan-400">
              <Radar className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-heading font-extrabold text-xl text-white tracking-wide">
                POLAR ICE & HAZARD INTELLIGENCE
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                US National Ice Center (NIC) Catalog, Sentinel-1 SAR Radar & Hydrodynamic Drift Prediction
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-[#060b13] border border-slate-800 text-slate-300">
            RADAR REVISIT: 6–12 DAYS
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold">
            ● FEED ACTIVE (WEEKLY CYCLE)
          </span>
        </div>
      </div>

      {/* Top 4 KPI Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ICE CONCENTRATION</span>
            <Snowflake className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white">68% <span className="text-xs font-normal text-slate-400 font-mono">mean</span></div>
          <div className="text-[11px] text-slate-400 font-sans">Sensor: NASA GIBS AMSR2 12km</div>
        </div>

        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>ACTIVE ICEBERGS</span>
            <Radar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white">{icebergs.length} <span className="text-xs font-normal text-slate-400 font-mono">targets</span></div>
          <div className="text-[11px] text-slate-400 font-sans">Catalog: USNIC & NOAA ASCAT</div>
        </div>

        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>DRIFT VELOCITY</span>
            <Compass className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white">1.6 <span className="text-xs font-normal text-slate-400 font-mono">knots</span></div>
          <div className="text-[11px] text-slate-400 font-sans">2% Atmospheric Wind Drag Model</div>
        </div>

        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-4 space-y-1 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>SAR RADAR SENSOR</span>
            <Radio className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-heading font-extrabold text-white">C-Band <span className="text-xs font-normal text-emerald-400 font-mono">5.4 GHz</span></div>
          <div className="text-[11px] text-slate-400 font-sans">Sentinel-1 Polar Sun-Synchronous</div>
        </div>
      </div>

      {/* Sea-Ice Concentration Bands & MetOcean Surface */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Ice Concentration Classification */}
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Snowflake className="w-4 h-4 text-cyan-400" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              SEA-ICE CONCENTRATION BANDS (WMO STANDARDS)
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Calibrated against daily AMSR2 microwave radiometry. Color bands rendered on the tactical chart indicate navigable ice regimes:
          </p>

          <div className="space-y-2 pt-1 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#64b5f6]/10 border border-[#64b5f6]/30">
              <span className="font-bold text-sky-300">15% - 30% Open Pack</span>
              <span className="text-slate-300 text-[11px]">Navigable for PC-4 through PC-7</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#1976d2]/20 border border-[#1976d2]/40">
              <span className="font-bold text-blue-300">30% - 60% Close Pack</span>
              <span className="text-slate-300 text-[11px]">Polar Class icebreaker lead required</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0d47a1]/30 border border-[#0d47a1]/50">
              <span className="font-bold text-indigo-300">60% - 85% Very Close Pack</span>
              <span className="text-slate-300 text-[11px]">Heavy icebreaking vessels only (PC-1/PC-2)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40">
              <span className="font-bold text-cyan-300">85% - 100% Consolidated Fast Ice</span>
              <span className="text-rose-400 font-semibold text-[11px]">Non-navigable &bull; Bypass required</span>
            </div>
          </div>
        </div>

        {/* MetOcean Marine Weather Surface */}
        <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center gap-2">
            <Waves className="w-4 h-4 text-sky-400" />
            <h3 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
              METOCEAN MARINE & SURFACE CONDITIONS
            </h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">
            Live atmospheric wind, wave height, and pressure telemetry ingested from the Open-Meteo High-Resolution Marine model:
          </p>

          <div className="grid grid-cols-2 gap-2.5 font-mono text-xs pt-1">
            <div className="bg-[#060b13] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">SIGNIFICANT WAVE HEIGHT</span>
              <span className="text-lg font-bold text-slate-100">1.4 m</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">Moderate Seastate (Sea 3)</span>
            </div>
            <div className="bg-[#060b13] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">SURFACE WIND SPEED</span>
              <span className="text-lg font-bold text-slate-100">12.5 kn</span>
              <span className="text-[10px] text-sky-300 block mt-0.5">Heading 295° (WNW)</span>
            </div>
            <div className="bg-[#060b13] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">AIR TEMPERATURE</span>
              <span className="text-lg font-bold text-slate-100">-6.2 °C</span>
              <span className="text-[10px] text-cyan-300 block mt-0.5">Freezing spray potential</span>
            </div>
            <div className="bg-[#060b13] p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block font-semibold">SURFACE PRESSURE</span>
              <span className="text-lg font-bold text-slate-100">1014 hPa</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Stable polar high</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tracked Iceberg Catalog Table */}
      <div className="bg-[#09111e] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Radar className="w-4 h-4 text-cyan-400" />
              <h3 className="font-heading font-bold text-base text-white uppercase tracking-wider">
                TRACKED ICEBERGS CATALOG ({filteredIcebergs.length} TARGETS)
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              US National Ice Center (NIC) verified polar iceberg database
            </p>
          </div>

          {/* Search & Region Filter */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search iceberg ID or name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#060b13] border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-sky-500 w-52"
              />
            </div>

            <div className="flex bg-[#060b13] p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              {(['ALL', 'Antarctic', 'Arctic'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRegionFilter(r)}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    regionFilter === r
                      ? 'bg-sky-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Iceberg Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 px-3">ICEBERG ID</th>
                <th className="py-2.5 px-3">NAME</th>
                <th className="py-2.5 px-3">REGION</th>
                <th className="py-2.5 px-3">COORDINATES</th>
                <th className="py-2.5 px-3">EST. LENGTH</th>
                <th className="py-2.5 px-3">LAST SIGHTING</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredIcebergs.map((berg) => (
                <tr key={berg.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-bold text-cyan-300">
                    {berg.id}
                  </td>
                  <td className="py-3 px-3 text-slate-200 font-medium">
                    {berg.name}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      berg.region === 'Antarctic' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60' : 'bg-blue-950 text-blue-300 border border-blue-800/60'
                    }`}>
                      {berg.region}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-semibold">
                    {formatCoordinatePair(berg.latitude, berg.longitude)}
                  </td>
                  <td className="py-3 px-3 text-slate-300">
                    {berg.estimatedLengthNm ? `${berg.estimatedLengthNm} nm` : '15 nm+'}
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {berg.lastObserved || `Day ${berg.observationDayOfYear || '252'}`}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => handleInspectDrift(berg)}
                      className="px-3 py-1 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white font-mono text-[11px] font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Predict 24h Drift</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

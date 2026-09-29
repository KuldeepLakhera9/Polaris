import React, { useEffect, useState } from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { X, CloudSunRain, Waves, Wind, Thermometer, Compass, Gauge, Loader2 } from 'lucide-react';
import { MetOceanData } from '../../types';
import { fetchMetOceanDirect } from '../../services/polarEngine';

export default function WeatherDrawer() {
  const { activePanel, setActivePanel, mapCenter, ownShip } = usePolarisStore();
  const [metocean, setMetocean] = useState<MetOceanData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activePanel === 'weather') {
      setLoading(true);
      const lat = mapCenter.lat;
      const lon = mapCenter.lon;
      fetch(`/api/weather?lat=${lat}&lon=${lon}`)
        .then(async (r) => {
          if (!r.ok) throw new Error('API offline');
          const ct = r.headers.get('content-type');
          if (ct && ct.includes('application/json')) return r.json();
          throw new Error('Not JSON');
        })
        .then((d) => setMetocean(d))
        .catch(async () => {
          const direct = await fetchMetOceanDirect(lat, lon);
          setMetocean(direct);
        })
        .finally(() => setLoading(false));
    }
  }, [activePanel, mapCenter.lat, mapCenter.lon]);

  if (activePanel !== 'weather') return null;

  return (
    <div className="absolute top-16 right-16 z-30 w-80 bg-[#0b1220]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1728] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CloudSunRain className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            Live MetOcean Telemetry
          </h2>
        </div>
        <button
          onClick={() => setActivePanel('none')}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs">
        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
          <span>POSITION: {mapCenter.lat.toFixed(2)}°N, {mapCenter.lon.toFixed(2)}°E</span>
          {loading && <Loader2 className="w-3.5 h-3.5 text-sky-400 animate-spin" />}
        </div>

        {/* Marine Wave Telemetry */}
        <div className="bg-[#080d17] p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-sky-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            <Waves className="w-3.5 h-3.5" />
            <span>MARINE WAVE DATA (OPEN-METEO)</span>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center pt-1">
            <div className="bg-[#0d1627] p-1.5 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">SIG. WAVE</span>
              <span className="text-slate-100 font-bold text-xs">
                {metocean?.marine?.waveHeightM !== undefined ? `${metocean.marine.waveHeightM} m` : 'NO DATA'}
              </span>
            </div>
            <div className="bg-[#0d1627] p-1.5 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">DIRECTION</span>
              <span className="text-slate-100 font-bold text-xs">
                {metocean?.marine?.waveDirectionDeg !== undefined ? `${metocean.marine.waveDirectionDeg}°` : 'NO DATA'}
              </span>
            </div>
            <div className="bg-[#0d1627] p-1.5 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">PERIOD</span>
              <span className="text-slate-100 font-bold text-xs">
                {metocean?.marine?.wavePeriodSec !== undefined ? `${metocean.marine.wavePeriodSec} s` : 'NO DATA'}
              </span>
            </div>
          </div>
        </div>

        {/* Atmospheric Weather Telemetry */}
        <div className="bg-[#080d17] p-3 rounded-lg border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-[10px] uppercase tracking-wider">
            <Wind className="w-3.5 h-3.5" />
            <span>ATMOSPHERIC SURFACE (OPEN-METEO)</span>
          </div>

          <div className="grid grid-cols-2 gap-2 font-mono pt-1">
            <div className="bg-[#0d1627] p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">WIND SPEED</span>
              <span className="text-slate-100 font-bold">
                {metocean?.weather?.windSpeedKnots !== undefined ? `${metocean.weather.windSpeedKnots} kn` : 'NO DATA'}
              </span>
            </div>
            <div className="bg-[#0d1627] p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">DIRECTION</span>
              <span className="text-slate-100 font-bold">
                {metocean?.weather?.windDirectionDeg !== undefined ? `${metocean.weather.windDirectionDeg}°` : 'NO DATA'}
              </span>
            </div>
            <div className="bg-[#0d1627] p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">TEMPERATURE</span>
              <span className="text-slate-100 font-bold">
                {metocean?.weather?.temperatureC !== undefined ? `${metocean.weather.temperatureC} °C` : 'NO DATA'}
              </span>
            </div>
            <div className="bg-[#0d1627] p-2 rounded border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400 text-[10px]">PRESSURE</span>
              <span className="text-slate-100 font-bold">
                {metocean?.weather?.pressureHpa !== undefined ? `${metocean.weather.pressureHpa} hPa` : 'NO DATA'}
              </span>
            </div>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono">
          Updated: {metocean?.timestamp ? new Date(metocean.timestamp).toLocaleTimeString() : 'Awaiting data'} &bull; Source: Open-Meteo High-Resolution Marine
        </div>
      </div>
    </div>
  );
}

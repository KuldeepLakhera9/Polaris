import React from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { 
  Layers, 
  Snowflake, 
  Ship, 
  Radio, 
  Navigation, 
  CloudRain,
  Eye,
  EyeOff
} from 'lucide-react';
import { LayerToggles } from '../../types';

export default function TacticalLayersBar() {
  const { layers, toggleLayer, setActivePanel, activePanel } = usePolarisStore();

  const layerItems: { key: keyof LayerToggles; label: string; icon: React.ElementType }[] = [
    { key: 'satellite', label: 'Satellite', icon: Layers },
    { key: 'iceConcentration', label: 'Sea Ice (AMSR2)', icon: Snowflake },
    { key: 'icebergs', label: 'Icebergs', icon: Snowflake },
    { key: 'aisVessels', label: 'AIS Ships', icon: Ship },
    { key: 'routes', label: 'Routes', icon: Navigation },
    { key: 'sarRadar', label: 'SAR Radar', icon: Radio },
  ];

  return (
    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-[#09111e]/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-2xl select-none">
      <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold border-r border-slate-800 hidden sm:flex">
        <Layers className="w-3.5 h-3.5 text-sky-400" />
        <span>LAYERS:</span>
      </div>

      <div className="flex items-center gap-1">
        {layerItems.map((item) => {
          const Icon = item.icon;
          const isActive = layers[item.key];
          return (
            <button
              key={item.key}
              onClick={() => toggleLayer(item.key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-950/80 border border-sky-400/60 text-sky-200 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                  : 'bg-[#060b13]/60 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title={`Toggle ${item.label}`}
            >
              <Icon className={`w-3 h-3 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-sky-400' : 'bg-slate-600'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { Plus, Minus, Navigation, Crosshair } from 'lucide-react';
import { usePolarisStore } from '../../store/usePolarisStore';

export default function LeftControls() {
  const { ownShip, mapCenter, flyTo } = usePolarisStore();

  const handleZoomIn = () => {
    flyTo({
      lat: mapCenter.lat,
      lon: mapCenter.lon,
      zoom: Math.min(18, mapCenter.zoom + 1)
    });
  };

  const handleZoomOut = () => {
    flyTo({
      lat: mapCenter.lat,
      lon: mapCenter.lon,
      zoom: Math.max(2, mapCenter.zoom - 1)
    });
  };

  const handleResetNorth = () => {
    flyTo({
      lat: mapCenter.lat,
      lon: mapCenter.lon,
      bearing: 0,
      pitch: 0
    });
  };

  const handleRecenterOwnShip = () => {
    if (ownShip) {
      flyTo({
        lat: ownShip.latitude,
        lon: ownShip.longitude,
        zoom: 7,
        bearing: 0,
        pitch: 0
      });
    }
  };


  return (
    <div className="absolute top-20 left-4 z-20 flex flex-col gap-1 bg-[#0a101d]/90 backdrop-blur-md border border-slate-800 rounded-lg p-1 shadow-2xl">
      <button
        onClick={handleZoomIn}
        className="w-8 h-8 flex items-center justify-center rounded bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
        title="Zoom In"
      >
        <Plus className="w-4 h-4" />
      </button>

      <button
        onClick={handleZoomOut}
        className="w-8 h-8 flex items-center justify-center rounded bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors"
        title="Zoom Out"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="w-full h-px bg-slate-800 my-0.5" />

      <button
        onClick={handleResetNorth}
        className="w-8 h-8 flex items-center justify-center rounded bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-sky-300 transition-colors group"
        title="Reset North Orientation"
      >
        <Navigation 
          className="w-4 h-4 text-sky-400 transform transition-transform group-hover:-translate-y-0.5" 
          style={{ transform: `rotate(${-mapCenter.bearing}deg)` }}
        />
      </button>

      <button
        onClick={handleRecenterOwnShip}
        className="w-8 h-8 flex items-center justify-center rounded bg-[#0d1627] hover:bg-slate-800 text-slate-300 hover:text-amber-400 transition-colors"
        title="Recenter on Own Ship (R/V Polaris-01)"
      >
        <Crosshair className="w-4 h-4" />
      </button>
    </div>
  );
}

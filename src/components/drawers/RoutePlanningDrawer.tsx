import React, { useState } from 'react';
import { usePolarisStore } from '../../store/usePolarisStore';
import { 
  X, 
  Navigation, 
  Fuel, 
  Clock, 
  ShieldAlert, 
  CheckCircle2, 
  Wind, 
  Waves, 
  Sparkles, 
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function RoutePlanningDrawer() {
  const { 
    activePanel, 
    setActivePanel, 
    routePlan, 
    setRoutePlan, 
    selectedRouteId, 
    setSelectedRouteId,
    isGeneratingRoute,
    calculateRoute,
    setOrigin: setStoreOrigin,
    setDestination: setStoreDestination,
    setVesselClass: setStoreVesselClass
  } = usePolarisStore();

  const [origin, setOrigin] = useState("longyearbyen");
  const [destination, setDestination] = useState("ny-alesund");
  const [vesselClass, setVesselClass] = useState("PC-4");

  if (activePanel !== 'routes') return null;

  const handleGenerateRoute = async () => {
    setStoreOrigin(origin);
    setStoreDestination(destination);
    setStoreVesselClass(vesselClass);
    await calculateRoute();
  };

  const selectedRoute = routePlan?.routes.find(r => r.id === selectedRouteId) || routePlan?.routes[0];

  return (
    <div className="absolute top-16 right-16 z-30 w-96 bg-[#0b1220]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] select-none animate-in fade-in slide-in-from-right-4 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0e1728] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sky-400" />
          <h2 className="text-xs font-bold font-mono text-slate-100 uppercase tracking-wider">
            Polar Route Risk Engine (§5)
          </h2>
        </div>
        <button
          onClick={() => setActivePanel('none')}
          className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-4">
        {/* Origin & Destination Selectors */}
        <div className="space-y-2 bg-[#080d17] p-3 rounded-lg border border-slate-800/80 text-xs">
          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              ORIGIN PORT / STATION
            </label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-[#0d1627] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
            >
              <optgroup label="Arctic / Svalbard Corridors">
                <option value="longyearbyen">Longyearbyen Port, Svalbard (78°13'N)</option>
                <option value="tromso">Tromsø Polar Harbour, Norway (69°38'N)</option>
                <option value="edgeoya">Edgeøya Sound, Svalbard (77°48'N)</option>
              </optgroup>
              <optgroup label="Antarctic Research Stations">
                <option value="bharati">Bharati Station, Larsemann Hills (-69°24'S)</option>
                <option value="mcmurdo">McMurdo Station, Ross Island (-77°50'S)</option>
              </optgroup>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
              DESTINATION BASE
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-[#0d1627] border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500"
            >
              <optgroup label="Arctic / Svalbard Corridors">
                <option value="ny-alesund">Ny-Ålesund Marine Base, Svalbard (78°55'N)</option>
                <option value="nordaustlandet">Nordaustlandet North Edge (80°21'N)</option>
                <option value="longyearbyen">Longyearbyen Port, Svalbard (78°13'N)</option>
              </optgroup>
              <optgroup label="Antarctic Research Stations">
                <option value="maitri">Maitri Station, Schirmacher Oasis (-70°46'S)</option>
                <option value="davis">Davis Station, Vestfold Hills (-68°34'S)</option>
              </optgroup>
            </select>
          </div>

          <button
            onClick={handleGenerateRoute}
            disabled={isGeneratingRoute}
            className="w-full mt-2 py-2 px-3 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-mono text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
          >
            {isGeneratingRoute ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Evaluating Environmental Grid...</span>
              </>
            ) : (
              <>
                <span>CALCULATE CANDIDATE ROUTES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Route Candidates Comparison */}
        {routePlan && routePlan.routes ? (
          <div className="space-y-3">
            <div className="text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
              CANDIDATE TRANSIT PROFILES
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {routePlan.routes.map((r) => {
                const isSelected = selectedRoute?.id === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRouteId(r.id)}
                    className={`p-2 rounded-lg border text-left font-mono transition-all ${
                      isSelected
                        ? 'bg-sky-950/80 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400'
                        : 'bg-[#0d1627] border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span>ROUTE {r.id}</span>
                      {r.isRecommended && (
                        <span className="text-[9px] px-1 rounded bg-sky-500/20 text-sky-300 border border-sky-500/40">
                          BEST
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-1">
                      {r.distanceNm} nm
                    </div>
                    <div className={`text-[10px] font-bold mt-0.5 ${
                      r.riskScores.composite <= 20 ? 'text-emerald-400' : (r.riskScores.composite <= 50 ? 'text-amber-400' : 'text-rose-400')
                    }`}>
                      Risk: {r.riskScores.composite}/100
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Route Detailed Breakdown */}
            {selectedRoute && (
              <div className="bg-[#080d17] p-3 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div>
                  <div className="font-bold text-slate-200">{selectedRoute.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                    {selectedRoute.description}
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 bg-[#0d1627] p-2 rounded border border-slate-800/80 font-mono text-center">
                  <div>
                    <span className="text-[9px] text-slate-400 block">TRANSIT</span>
                    <span className="text-slate-200 font-bold text-xs">{selectedRoute.transitHours} h</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">EST. FUEL</span>
                    <span className="text-amber-300 font-bold text-xs">{selectedRoute.estimatedFuelLiters} L</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block">ICEBERG CLR</span>
                    <span className="text-cyan-300 font-bold text-xs">{selectedRoute.closestIceberg.distanceNm} nm</span>
                  </div>
                </div>

                {/* Weighted Risk Factor Breakdown */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                    WEIGHTED RISK DECOMPOSITION (§5)
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Sea Ice Concentration (40%)</span>
                    <span className="font-bold text-sky-400">{selectedRoute.riskScores.seaIceRisk}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Iceberg Proximity Perimeter (30%)</span>
                    <span className="font-bold text-cyan-400">{selectedRoute.riskScores.icebergRisk}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>MetOcean Roughness (20%)</span>
                    <span className="font-bold text-amber-400">{selectedRoute.riskScores.metoceanRisk}/100</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Hull Resistance Strain (10%)</span>
                    <span className="font-bold text-slate-400">{selectedRoute.riskScores.vesselStrainRisk}/100</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-800/80 leading-relaxed">
                  Fuel model: {selectedRoute.fuelBurnAssumption}. Environmental inputs sourced live from NSIDC and Open-Meteo.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-center text-slate-400 text-xs italic bg-[#080d17] rounded-lg border border-slate-800">
            Click "Calculate Candidate Routes" to evaluate real environmental transit options.
          </div>
        )}
      </div>
    </div>
  );
}

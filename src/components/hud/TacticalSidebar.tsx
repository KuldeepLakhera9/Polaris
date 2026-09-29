import React, { useState } from 'react';
import { usePolarisStore, MISSION_PRESETS } from '../../store/usePolarisStore';
import { 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  ChevronLeft, 
  ChevronRight,
  Compass,
  AlertTriangle
} from 'lucide-react';


export default function TacticalSidebar() {
  const {
    origin,
    destination,
    vesselClass,
    setOrigin,
    setDestination,
    setVesselClass,
    calculateRoute,
    isGeneratingRoute,
    routePlan,
    selectedRouteId,
    setSelectedRouteId,
    isSidebarCollapsed,
    toggleSidebar,
    activeMissionPreset,
    loadMissionPreset,
    alerts
  } = usePolarisStore();

  const [aiStep, setAiStep] = useState(0);

  const handleGenerate = async () => {
    // Multi-step animated sequence for wow factor
    setAiStep(1);
    const t1 = setTimeout(() => setAiStep(2), 500);
    const t2 = setTimeout(() => setAiStep(3), 1100);
    const t3 = setTimeout(() => setAiStep(4), 1700);

    await calculateRoute();
    clearTimeout(t1);
    clearTimeout(t2);
    clearTimeout(t3);
    setAiStep(0);
  };

  const selectedRoute = routePlan?.routes.find(r => r.id === selectedRouteId) || routePlan?.routes[0];

  return (
    <aside 
      className={`relative z-20 flex flex-col h-full bg-[#09111e]/95 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 ease-in-out select-none shadow-2xl ${
        isSidebarCollapsed ? 'w-12 overflow-hidden' : 'w-96 xl:w-[410px]'
      }`}
    >
      {/* Sidebar Collapse / Expand Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 z-30 w-6 h-6 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-lg border border-slate-700 cursor-pointer transition-transform"
        title={isSidebarCollapsed ? "Expand Mission Panel" : "Collapse Sidebar (Full Map View)"}
      >
        {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* COLLAPSED STATE VERTICAL RAIL */}
      {isSidebarCollapsed ? (
        <div className="flex flex-col items-center py-4 gap-6 text-slate-400">
          <button 
            onClick={toggleSidebar} 
            className="p-2 rounded-xl bg-sky-950 text-sky-400 hover:text-white"
            title="Expand Voyage Planner"
          >
            <Compass className="w-5 h-5" />
          </button>
          <div className="w-6 h-px bg-slate-800" />
          <div className="rotate-90 text-[10px] font-mono tracking-widest text-slate-500 whitespace-nowrap mt-8">
            VOYAGE CONTROL
          </div>
        </div>
      ) : (
        /* EXPANDED CONTENT */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Panel Header */}
          <div className="px-4 py-3 bg-[#060b13] border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400" />
              <h2 className="font-heading font-bold text-xs uppercase tracking-wider text-white">
                VOYAGE CONTROLLER & AI ROUTING
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-600/40">
              A* POLAR ENGINE
            </span>
          </div>

          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* 1. Quick Mission Presets */}
            <div className="bg-[#060b13]/80 p-2.5 rounded-xl border border-slate-800/90 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-400 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>DEMO MISSIONS (1-CLICK LOAD)</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {MISSION_PRESETS.map((preset) => {
                  const isActive = activeMissionPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => loadMissionPreset(preset.id)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        isActive
                          ? 'bg-sky-950/90 border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400'
                          : 'bg-[#09111e] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold text-[10px] truncate">{preset.title.split(' ')[0]}</div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">{preset.region}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Voyage Configurator Card */}
            <div className="bg-[#060b13] p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  ORIGIN PORT / STATION
                </label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-[#09111e] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <optgroup label="Arctic / Svalbard Corridors">
                    <option value="longyearbyen">Longyearbyen Port, Svalbard (78°13'N, 15°38'E)</option>
                    <option value="tromso">Tromsø Polar Harbour, Norway (69°38'N, 18°57'E)</option>
                    <option value="edgeoya">Edgeøya Sound, Svalbard (77°48'N, 22°30'E)</option>
                  </optgroup>
                  <optgroup label="Antarctic Research Stations">
                    <option value="bharati">Bharati Station, Larsemann Hills (-69°24'S, 76°11'E)</option>
                    <option value="mcmurdo">McMurdo Station, Ross Island (-77°50'S, 166°40'E)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  DESTINATION BASE / HARBOUR
                </label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#09111e] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <optgroup label="Arctic / Svalbard Corridors">
                    <option value="ny-alesund">Ny-Ålesund Marine Base, Svalbard (78°55'N, 11°55'E)</option>
                    <option value="nordaustlandet">Nordaustlandet North Edge (80°21'N, 23°30'E)</option>
                    <option value="longyearbyen">Longyearbyen Port, Svalbard (78°13'N, 15°38'E)</option>
                  </optgroup>
                  <optgroup label="Antarctic Research Stations">
                    <option value="maitri">Maitri Station, Schirmacher Oasis (-70°46'S, 11°44'E)</option>
                    <option value="davis">Davis Station, Vestfold Hills (-68°34'S, 77°58'E)</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1 font-semibold">
                  VESSEL ICE CLASS (IACS POLAR RULES)
                </label>
                <select
                  value={vesselClass}
                  onChange={(e) => setVesselClass(e.target.value)}
                  className="w-full bg-[#09111e] border border-slate-700 rounded-lg px-3 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="PC-1">PC-1: Year-round operations in all polar waters (Heavy Icebreaker)</option>
                  <option value="PC-4">PC-4: Year-round in thick first-year ice (R/V Polaris-01 / Research)</option>
                  <option value="PC-7">PC-7: Summer/autumn operations in thin first-year ice (Light Ice)</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGeneratingRoute}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(2,132,199,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                {isGeneratingRoute ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>
                      {aiStep === 1 && "Ingesting satellite SAR radar..."}
                      {aiStep === 2 && "Tracking iceberg drift vectors..."}
                      {aiStep === 3 && "Evaluating hydrodynamic hazards..."}
                      {aiStep >= 4 && "Generating optimal lead corridor..."}
                      {aiStep === 0 && "Evaluating Environmental Grid..."}
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>CALCULATE AI SAFE ROUTE</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* 3. Candidate Transit Profiles (Routes A, B, C) */}
            {routePlan && routePlan.routes ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                  <span>TRANSIT CANDIDATE PROFILES</span>
                  <span className="text-sky-400">CLICK TO PREVIEW</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {routePlan.routes.map((r) => {
                    const isSelected = selectedRoute?.id === r.id;
                    const isRec = r.isRecommended;
                    return (
                      <button
                        key={r.id}
                        onClick={() => setSelectedRouteId(r.id)}
                        className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-950/80 border-sky-400 text-sky-200 shadow-md ring-2 ring-sky-400/50'
                            : 'bg-[#060b13] border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>ROUTE {r.id}</span>
                          {isRec && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              BEST
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-bold text-slate-100 mt-1">
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

                {/* Selected Route Detailed Card */}
                {selectedRoute && (
                  <div className="bg-[#060b13] p-3.5 rounded-xl border border-slate-800 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-heading font-bold text-sm text-slate-100">{selectedRoute.label}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          selectedRoute.riskScores.level === 'LOW' 
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {selectedRoute.riskScores.level} RISK
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">
                        {selectedRoute.description}
                      </p>
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-3 gap-2 bg-[#09111e] p-2.5 rounded-lg border border-slate-800/80 font-mono text-center">
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">TRANSIT</span>
                        <span className="text-slate-100 font-bold text-xs">{selectedRoute.transitHours} hrs</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">EST. FUEL</span>
                        <span className="text-amber-300 font-bold text-xs">{selectedRoute.estimatedFuelLiters.toLocaleString()} L</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block font-semibold">ICEBERG CLR</span>
                        <span className="text-cyan-300 font-bold text-xs">{selectedRoute.closestIceberg.distanceNm} nm</span>
                      </div>
                    </div>

                    {/* Risk Factor Breakdown */}
                    <div className="space-y-1.5 font-mono text-[11px] pt-1">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">
                        MULTI-HAZARD RISK DECOMPOSITION
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300 text-[10px]">
                          <span>Sea-Ice Concentration (40%)</span>
                          <span className="font-bold text-sky-400">{selectedRoute.riskScores.seaIceRisk}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full" style={{ width: `${selectedRoute.riskScores.seaIceRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300 text-[10px]">
                          <span>Iceberg Proximity Perimeter (30%)</span>
                          <span className="font-bold text-cyan-400">{selectedRoute.riskScores.icebergRisk}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${selectedRoute.riskScores.icebergRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300 text-[10px]">
                          <span>MetOcean Roughness & Waves (20%)</span>
                          <span className="font-bold text-amber-400">{selectedRoute.riskScores.metoceanRisk}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedRoute.riskScores.metoceanRisk}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-300 text-[10px]">
                          <span>Vessel Hull Resistance Strain (10%)</span>
                          <span className="font-bold text-slate-300">{selectedRoute.riskScores.vesselStrainRisk}/100</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400 rounded-full" style={{ width: `${selectedRoute.riskScores.vesselStrainRisk}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* 4. Active Alert Notification */}
            {alerts.length > 0 && (
              <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-xl flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-amber-200 text-[11px] font-heading">{alerts[0].title}</div>
                  <div className="text-[10px] text-amber-300/80 leading-relaxed font-sans">{alerts[0].message}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}

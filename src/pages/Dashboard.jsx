import React from "react";
import Sidebar from "../components/Sidebar";
import AntarcticMap from "../components/Map";
import RoutePanel from "../components/RoutePanel";
import AIAnalysisModal from "../components/AIAnalysisModal";
import StatsCard from "../components/StatsCard";
import { Ship, Navigation, Shield, Snowflake, ArrowRight } from "lucide-react";
import { stations, vessels } from "../data/vessels";
import { routes } from "../data/routes";

export default function Dashboard({
  origin,
  setOrigin,
  destination,
  setDestination,
  vesselId,
  setVesselId,
  departureTime,
  setDepartureTime,
  isGenerating,
  setIsGenerating,
  isRouteGenerated,
  setIsRouteGenerated,
  riskData,
  setRiskData,
  alerts,
  setAlerts,
  selectedRouteId,
  setSelectedRouteId
}) {
  const currentVessel = vessels.find((v) => v.id === vesselId) || vessels[0];
  const originStation = stations.find((s) => s.id === origin) || stations[0];
  const destStation = stations.find((s) => s.id === destination) || stations[1];
  const activeRoute = routes.find((r) => r.id === selectedRouteId) || routes[1];

  const handleGenerateRoute = () => {
    setIsGenerating(true);
  };

  const handleAnalysisComplete = () => {
    setIsGenerating(false);
    setIsRouteGenerated(true);
    setSelectedRouteId("B");

    setRiskData({
      score: 19,
      seaIce: 14,
      icebergs: 22,
      weather: 18,
      vessel: 8,
      level: "LOW"
    });

    setAlerts((prev) => {
      const exists = prev.some((a) => a.id === "gen-alert-1");
      if (exists) return prev;
      return [
        {
          id: "gen-alert-1",
          type: "warning",
          text: "⚠ Iceberg #A17 detected 43 km from planned Route B. Drift vector clear of transit.",
          time: "Just now",
          active: true
        },
        ...prev
      ];
    });
  };

  return (
    <div className="space-y-4">
      {/* Analysis Progress Modal */}
      <AIAnalysisModal isOpen={isGenerating} onComplete={handleAnalysisComplete} />

      {/* Top Mission Telemetry Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatsCard
          title="Assigned Vessel"
          value={currentVessel.name.replace("Research Vessel ", "").replace("Icebreaker ", "")}
          subtext={`Class: ${currentVessel.iceClass.split(" ")[0]} | ${currentVessel.maxSpeedKnots} kt`}
          icon={Ship}
          variant="cyan"
          badge="READY"
        />
        <StatsCard
          title="Planned Transit"
          value={`${originStation.name.split(" ")[0]} → ${destStation.name.split(" ")[0]}`}
          subtext={`Route: ${isRouteGenerated ? activeRoute.name.split("—")[1] : "Awaiting Calculation"}`}
          icon={Navigation}
          variant="slate"
        />
        <StatsCard
          title="Sea-Ice Concentration"
          value="68%"
          unit="mean"
          subtext="Sensor: Sentinel-1 SAR + AMSR2"
          icon={Snowflake}
          variant="cyan"
          change="+3% (24h)"
          isPositive={false}
        />
        <StatsCard
          title="Navigation Risk"
          value={`${riskData.score} / 100`}
          unit={riskData.level}
          subtext="Dynamic Multi-Hazard Index"
          icon={Shield}
          variant={riskData.score <= 30 ? "emerald" : "amber"}
          badge={isRouteGenerated ? "OPTIMAL" : "BASELINE"}
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Column: Sidebar with Voyage Planner + Risk Panel + Forecast + Alerts */}
        <Sidebar
          origin={origin}
          setOrigin={setOrigin}
          destination={destination}
          setDestination={setDestination}
          vesselId={vesselId}
          setVesselId={setVesselId}
          departureTime={departureTime}
          setDepartureTime={setDepartureTime}
          onGenerateRoute={handleGenerateRoute}
          isGenerating={isGenerating}
          isRouteGenerated={isRouteGenerated}
          riskData={riskData}
          alerts={alerts}
        />

        {/* Right Column: Hero Antarctic Map + Route Analysis Panel */}
        <main className="flex-1 w-full space-y-4 min-w-0">
          {/* Antarctic Map */}
          <AntarcticMap
            isRouteGenerated={isRouteGenerated}
            selectedRouteId={selectedRouteId}
            originStation={origin}
            destStation={destination}
          />

          {/* Route Analysis Panel */}
          {isRouteGenerated ? (
            <div className="transition-all duration-300">
              <RoutePanel
                selectedRouteId={selectedRouteId}
                onSelectRoute={(id) => setSelectedRouteId(id)}
              />
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs text-center">
              <div className="max-w-md mx-auto space-y-2">
                <div className="inline-flex p-3 rounded-full bg-sky-50 border border-sky-200 text-sky-700 mb-1">
                  <Navigation className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">
                  Navigation Optimization Standby
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  Select your destination station and vessel in the voyage planner, then click{" "}
                  <strong className="text-slate-800">Generate Route</strong> to evaluate ice hazard
                  metrics and plot the optimal navigable lead corridor.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleGenerateRoute}
                    className="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Run Route Evaluation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

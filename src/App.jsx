import React, { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import IceIntelligence from "./pages/IceIntelligence";
import RoutePlanner from "./pages/RoutePlanner";
import AlertsPage from "./pages/AlertsPage";
import { initialAlerts } from "./data/routes";
import { Compass } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Form State
  const [origin, setOrigin] = useState("bharati");
  const [destination, setDestination] = useState("maitri");
  const [vesselId, setVesselId] = useState("polaris-01");
  const [departureTime, setDepartureTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  // Dynamic Route Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRouteGenerated, setIsRouteGenerated] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState("B");

  // Risk Telemetry State
  const [riskData, setRiskData] = useState({
    score: 23,
    seaIce: 18,
    icebergs: 31,
    weather: 20,
    vessel: 10,
    level: "LOW"
  });

  // Dynamic Alerts State
  const [alerts, setAlerts] = useState(initialAlerts);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alertCount={alerts.filter((a) => a.active).length}
      />

      {/* Content Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-4">
        {activeTab === "dashboard" && (
          <Dashboard
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            vesselId={vesselId}
            setVesselId={setVesselId}
            departureTime={departureTime}
            setDepartureTime={setDepartureTime}
            isGenerating={isGenerating}
            setIsGenerating={setIsGenerating}
            isRouteGenerated={isRouteGenerated}
            setIsRouteGenerated={setIsRouteGenerated}
            riskData={riskData}
            setRiskData={setRiskData}
            alerts={alerts}
            setAlerts={setAlerts}
            selectedRouteId={selectedRouteId}
            setSelectedRouteId={setSelectedRouteId}
          />
        )}

        {activeTab === "ice-intelligence" && <IceIntelligence />}

        {activeTab === "route-planner" && (
          <RoutePlanner
            origin={origin}
            setOrigin={setOrigin}
            destination={destination}
            setDestination={setDestination}
            vesselId={vesselId}
            setVesselId={setVesselId}
            onGenerateRoute={() => {
              setActiveTab("dashboard");
              setIsGenerating(true);
            }}
            isRouteGenerated={isRouteGenerated}
            selectedRouteId={selectedRouteId}
            setSelectedRouteId={setSelectedRouteId}
          />
        )}

        {activeTab === "alerts" && (
          <AlertsPage alerts={alerts} setAlerts={setAlerts} />
        )}
      </div>

      {/* Professional Maritime Footer */}
      <footer className="mt-auto w-full bg-white border-t border-slate-200 px-4 py-3 text-[11px] font-sans text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Compass className="w-3.5 h-3.5 text-sky-700" />
              <span>POLARIS DECISION SUPPORT SYSTEM</span>
            </span>
            <span>•</span>
            <span>SIH-2026 Problem Statement 26059</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Antarctic Sea-Ice & Iceberg Trajectory Evaluation</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-mono text-[10px]">
              SIMULATED DEMO DATASET
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

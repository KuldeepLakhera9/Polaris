import React from 'react';
import MapLibreMap from '../components/MapLibreMap';
import TacticalSidebar from '../components/hud/TacticalSidebar';
import TacticalLayersBar from '../components/hud/TacticalLayersBar';
import LeftControls from '../components/hud/LeftControls';
import CursorPanel from '../components/hud/CursorPanel';
import BottomCenterHud from '../components/hud/BottomCenterHud';
import IcebergInspectionCard from '../components/hud/IcebergInspectionCard';
import DataSourceTransparencyModal from '../components/modals/DataSourceTransparencyModal';
import SettingsModal from '../components/modals/SettingsModal';

export default function TacticalMapView() {
  return (
    <div className="relative flex-1 w-full h-full flex overflow-hidden">
      {/* 1. Docked / Collapsible Left Tactical Sidebar */}
      <TacticalSidebar />

      {/* 2. Interactive MapLibre Polar Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MapLibreMap />

        {/* 3. Floating Quick Layers Ribbon */}
        <TacticalLayersBar />

        {/* 4. Floating Left Controls (Zoom, Reset North, Recenter) */}
        <LeftControls />

        {/* 5. Floating Iceberg Inspection Card (Shown when an iceberg is clicked) */}
        <IcebergInspectionCard />

        {/* 6. Bottom-Left Cursor & Distance Telemetry Panel */}
        <CursorPanel />

        {/* 7. Bottom-Center HUD (Solar Scrubber, SOG/COG Telemetry Bar, Cache Pill) */}
        <BottomCenterHud />

        {/* 8. Global Modals */}
        <DataSourceTransparencyModal />
        <SettingsModal />
      </div>
    </div>
  );
}

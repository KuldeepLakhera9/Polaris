import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Polygon,
  Tooltip as LeafletTooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { icebergs } from "../data/icebergs";
import { stations } from "../data/vessels";
import { routes, riskZones } from "../data/routes";
import IcebergPopup from "./IcebergPopup";
import { Compass, Ship, Layers } from "lucide-react";

// Professional SVG DivIcons for Bright Maritime Theme
const createShipIcon = () => {
  return L.divIcon({
    className: "custom-ship-icon",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 -ml-1 -mt-1">
        <div class="w-7 h-7 rounded-full bg-sky-700 border-2 border-white flex items-center justify-center shadow-md text-white">
          <svg class="w-3.5 h-3.5 transform -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const createIcebergIcon = (risk) => {
  const isHigh = risk === "high";
  const borderColor = isHigh ? "border-rose-500" : "border-amber-500";
  const bgBadge = isHigh ? "bg-rose-50" : "bg-amber-50";

  return L.divIcon({
    className: "custom-iceberg-icon",
    html: `
      <div class="relative flex items-center justify-center w-7 h-7 -ml-0.5 -mt-0.5 cursor-pointer group">
        <div class="w-6 h-6 rounded-md ${bgBadge} border-2 ${borderColor} flex items-center justify-center shadow-xs transition-transform group-hover:scale-110">
          <span class="text-xs">🧊</span>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

const createStationIcon = (name) => {
  return L.divIcon({
    className: "custom-station-icon",
    html: `
      <div class="relative flex items-center justify-center w-6 h-6 -ml-0.5 -mt-0.5">
        <div class="w-5 h-5 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center shadow-sm text-white">
          <span class="text-[9px] font-bold">📍</span>
        </div>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10]
  });
};

function MapController({ center, zoom }) {
  const map = useMap();
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const BASEMAPS = {
  ocean: {
    name: "Ocean Bathymetry",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; GEBCO, NOAA, National Geographic",
    maxZoom: 16
  },
  light: {
    name: "Light Canvas",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 16
  },
  satellite: {
    name: "Polar Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, USGS",
    maxZoom: 17
  },
  osm: {
    name: "Standard Map",
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18
  }
};

export default function AntarcticMap({
  isRouteGenerated = false,
  selectedRouteId = "B",
  originStation = "bharati",
  destStation = "maitri"
}) {
  const [showZones, setShowZones] = useState(true);
  const [showIcebergs, setShowIcebergs] = useState(true);
  const [showDriftVectors, setShowDriftVectors] = useState(true);
  const [currentBasemap, setCurrentBasemap] = useState("ocean");

  const defaultCenter = [-67.5, 45.0];
  const defaultZoom = 3.5;

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[1];
  const bharatiStation = stations.find((s) => s.id === originStation) || stations[0];
  const destinationStation = stations.find((s) => s.id === destStation) || stations[1];
  const activeBasemap = BASEMAPS[currentBasemap] || BASEMAPS.ocean;

  return (
    <div className="relative w-full h-[520px] rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      {/* Top Map HUD overlay */}
      <div className="absolute top-3 left-3 z-[400] flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2 shadow-xs">
          <Compass className="w-4 h-4 text-sky-700" />
          <span>Southern Ocean Navigational Chart</span>
        </div>

        {/* Layer Toggles */}
        <div className="bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 shadow-xs">
          <button
            onClick={() => setShowZones(!showZones)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
              showZones ? "bg-sky-50 text-sky-800 border border-sky-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Risk Zones
          </button>
          <button
            onClick={() => setShowIcebergs(!showIcebergs)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
              showIcebergs ? "bg-sky-50 text-sky-800 border border-sky-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Icebergs ({icebergs.length})
          </button>
          <button
            onClick={() => setShowDriftVectors(!showDriftVectors)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
              showDriftVectors ? "bg-sky-50 text-sky-800 border border-sky-200" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Drift Vectors
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom Left) */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md p-3 rounded-lg border border-slate-200 text-[11px] font-sans text-slate-700 space-y-1.5 shadow-sm pointer-events-auto">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-100 pb-1 mb-1">
          Chart Legend
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-700 border border-white shadow-2xs"></span>
          <span>Vessel Origin (Polaris-01)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-rose-500"></span>
          <span>High-Risk Sea Ice / Iceberg Field</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
          <span>Moderate Pack Floes</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-1 bg-sky-600 rounded"></span>
          <span>Active Route ({selectedRouteId})</span>
        </div>
      </div>

      {/* Basemap Selector (Top Right) */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-2 py-1 rounded-lg border border-slate-200 text-xs flex items-center gap-1 shadow-xs pointer-events-auto">
        <span className="text-[10px] font-medium text-slate-400 uppercase mr-1">CHART:</span>
        {Object.entries(BASEMAPS).map(([key, bm]) => (
          <button
            key={key}
            onClick={() => setCurrentBasemap(key)}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
              currentBasemap === key
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {bm.name}
          </button>
        ))}
      </div>

      {/* Leaflet Map Container */}
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        minZoom={2.5}
        maxZoom={7}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <MapController center={defaultCenter} zoom={defaultZoom} />

        {/* 100% Free Public Basemap Layer */}
        <TileLayer
          key={currentBasemap}
          url={activeBasemap.url}
          attribution={activeBasemap.attribution}
          maxZoom={activeBasemap.maxZoom}
        />

        {/* Risk Zone Overlays */}
        {showZones &&
          riskZones.map((zone) => (
            <Polygon
              key={zone.id}
              positions={zone.coordinates}
              pathOptions={{
                color: zone.color,
                fillColor: zone.fillColor,
                fillOpacity: zone.risk === "high" ? 0.28 : 0.18,
                weight: 1.5,
                dashArray: zone.risk === "high" ? "4, 4" : null
              }}
            >
              <LeafletTooltip direction="center" opacity={0.95} sticky>
                <div className="text-xs p-1">
                  <strong>{zone.name}</strong>
                  <br />
                  <span className="text-slate-600">{zone.details}</span>
                </div>
              </LeafletTooltip>
            </Polygon>
          ))}

        {/* Station Markers */}
        {stations.map((st) => (
          <Marker key={st.id} position={[st.lat, st.lng]} icon={createStationIcon(st.name)}>
            <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="text-xs p-1">
                <strong>{st.name}</strong>
                <br />
                <span className="text-slate-500">{st.country}</span>
                <br />
                <span className="text-sky-700 font-mono">
                  {Math.abs(st.lat)}°S, {st.lng > 0 ? `${st.lng}°E` : `${Math.abs(st.lng)}°W`}
                </span>
              </div>
            </LeafletTooltip>
          </Marker>
        ))}

        {/* Vessel Starting Marker (At Bharati Station) */}
        <Marker
          position={[bharatiStation.lat, bharatiStation.lng]}
          icon={createShipIcon()}
        >
          <LeafletTooltip direction="top" offset={[0, -14]} opacity={0.95} permanent>
            <div className="text-[10px] font-bold text-sky-800 px-1.5 py-0.5 bg-white rounded shadow-xs border border-sky-300">
              POLARIS-01 (ORIGIN)
            </div>
          </LeafletTooltip>
        </Marker>

        {/* Destination Station Marker */}
        <Marker
          position={[destinationStation.lat, destinationStation.lng]}
          icon={createStationIcon(destinationStation.name)}
        >
          <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95} permanent>
            <div className="text-[10px] font-bold text-emerald-800 px-1.5 py-0.5 bg-white rounded shadow-xs border border-emerald-300">
              {destinationStation.name.toUpperCase()}
            </div>
          </LeafletTooltip>
        </Marker>

        {/* Iceberg Markers & Popups */}
        {showIcebergs &&
          icebergs.map((berg) => (
            <React.Fragment key={berg.id}>
              <Marker
                position={[berg.lat, berg.lng]}
                icon={createIcebergIcon(berg.risk)}
              >
                <Popup maxWidth={320}>
                  <IcebergPopup iceberg={berg} />
                </Popup>
                <LeafletTooltip direction="bottom" offset={[0, 10]} opacity={0.95}>
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    BERG #{berg.id} ({berg.risk.toUpperCase()})
                  </span>
                </LeafletTooltip>
              </Marker>

              {/* Drift Vector line towards 24h prediction */}
              {showDriftVectors && berg.predLat && berg.predLng && (
                <Polyline
                  positions={[
                    [berg.lat, berg.lng],
                    [berg.predLat, berg.predLng]
                  ]}
                  pathOptions={{
                    color: berg.risk === "high" ? "#e11d48" : "#d97706",
                    weight: 2,
                    dashArray: "3, 6",
                    opacity: 0.8
                  }}
                />
              )}
            </React.Fragment>
          ))}

        {/* Active Route Rendering */}
        {isRouteGenerated && currentRoute && (
          <>
            <Polyline
              positions={currentRoute.waypoints}
              pathOptions={{
                color: currentRoute.id === "A" ? "#e11d48" : currentRoute.id === "C" ? "#059669" : "#0284c7",
                weight: 4.5,
                opacity: 0.9,
                dashArray: currentRoute.dashArray,
                lineCap: "round"
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

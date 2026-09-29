import { create } from 'zustand';
import { 
  Vessel, 
  AisStatus, 
  Iceberg, 
  IcebergDriftPrediction, 
  MetOceanData, 
  RoutePlanResponse, 
  LayerToggles,
  NavigationTab,
  PolarisAlert,
  MissionPreset
} from '../types';
import {
  POLAR_WAYPOINTS,
  getDefaultIcebergs,
  getDefaultPolarVessels,
  fetchMetOceanDirect,
  calculateCandidateRoutes
} from '../services/polarEngine';

export const MISSION_PRESETS: MissionPreset[] = [
  {
    id: 'svalbard',
    title: 'Svalbard Arctic Passage',
    region: 'Arctic',
    origin: 'longyearbyen',
    destination: 'ny-alesund',
    originName: 'Longyearbyen Port',
    destinationName: 'Ny-Ålesund Marine Base',
    center: { lat: 78.6, lon: 13.8, zoom: 7.0 },
    description: 'High-latitude Svalbard fjord transit navigating through Isfjorden and Kongsfjorden leads.'
  },
  {
    id: 'antarctic',
    title: 'Antarctic Mission (SIH-2026)',
    region: 'Antarctic',
    origin: 'bharati',
    destination: 'maitri',
    originName: 'Bharati Station',
    destinationName: 'Maitri Station',
    center: { lat: -69.8, lon: 45.0, zoom: 4.8 },
    description: 'Southern Ocean transit connecting Indian research stations, actively skirting calving iceberg D23.'
  },
  {
    id: 'southernocean',
    title: 'Ross Sea to Prydz Bay',
    region: 'Antarctic',
    origin: 'mcmurdo',
    destination: 'davis',
    originName: 'McMurdo Station',
    destinationName: 'Davis Station',
    center: { lat: -73.0, lon: 120.0, zoom: 3.8 },
    description: 'Trans-continental shelf polar transit through high-density pack ice and iceberg drift zones.'
  }
];

interface PolarisState {
  // Navigation & High-Level View
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  activeMissionPreset: string;
  setActiveMissionPreset: (presetId: string) => void;
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  // Voyage Inputs
  origin: string;
  destination: string;
  vesselClass: string;
  setOrigin: (origin: string) => void;
  setDestination: (dest: string) => void;
  setVesselClass: (vesselClass: string) => void;
  safetyFuelPriority: number; // 0 (Max Fuel) to 100 (Max Safety), 50 balanced
  setSafetyFuelPriority: (val: number) => void;

  // Vessels & AIS
  vessels: Vessel[];
  selectedVessel: Vessel | null;
  ownShip: Vessel | null;
  aisStatus: AisStatus;
  
  // Icebergs & Trajectory
  icebergs: Iceberg[];
  selectedIceberg: Iceberg | null;
  selectedIcebergDrift: IcebergDriftPrediction | null;
  isLoadingDrift: boolean;

  // Environment & MetOcean
  metoceanAtCenter: MetOceanData | null;
  
  // Routes & Planning
  routePlan: RoutePlanResponse | null;
  selectedRouteId: string;
  isGeneratingRoute: boolean;

  // Alerts
  alerts: PolarisAlert[];
  dismissAlert: (id: string) => void;
  addAlert: (alert: PolarisAlert) => void;

  // Navigation Telemetry & Map State
  mapCenter: { lat: number; lon: number; zoom: number; bearing: number; pitch: number };
  cursorPos: { lat: number; lon: number } | null;
  cursorDistanceBearing: { distanceNm: number; bearingDeg: number } | null;
  gpsStatus: 'FIX' | 'NO FIX' | 'ACQUIRING';
  gpsPosition: { lat: number; lon: number } | null;
  mapFlyToTarget: { lat: number; lon: number; zoom?: number; bearing?: number; pitch?: number } | null;

  // Time & Astronomical
  activeDate: string; // ISO date string e.g. "2026-09-30"
  dayNightScrubHours: number; // 0 - 24

  // Layers & HUD Panels
  layers: LayerToggles;
  activePanel: 'none' | 'layers' | 'routes' | 'weather' | 'vessels' | 'settings' | 'info' | 'icebergDetail';
  
  // Actions
  setVessels: (vessels: Vessel[]) => void;
  updateVessel: (vessel: Vessel) => void;
  selectVessel: (vessel: Vessel | null) => void;
  setOwnShip: (ship: Vessel | null) => void;
  setAisStatus: (status: AisStatus) => void;
  setIcebergs: (icebergs: Iceberg[]) => void;
  selectIceberg: (iceberg: Iceberg | null) => void;
  setIcebergDrift: (drift: IcebergDriftPrediction | null) => void;
  setIsLoadingDrift: (loading: boolean) => void;
  setMetoceanAtCenter: (data: MetOceanData | null) => void;
  setRoutePlan: (plan: RoutePlanResponse | null) => void;
  setSelectedRouteId: (id: string) => void;
  setIsGeneratingRoute: (gen: boolean) => void;
  setMapCenter: (center: { lat: number; lon: number; zoom: number; bearing?: number; pitch?: number }) => void;
  setCursor: (pos: { lat: number; lon: number } | null, distBearing?: { distanceNm: number; bearingDeg: number } | null) => void;
  setGpsStatus: (status: 'FIX' | 'NO FIX' | 'ACQUIRING', pos?: { lat: number; lon: number } | null) => void;
  flyTo: (target: { lat: number; lon: number; zoom?: number; bearing?: number; pitch?: number }) => void;
  clearFlyTo: () => void;
  setActiveDate: (date: string) => void;
  stepDate: (daysDelta: number) => void;
  setDayNightScrubHours: (hours: number) => void;
  toggleLayer: (layerName: keyof LayerToggles) => void;
  setActivePanel: (panel: PolarisState['activePanel']) => void;
  
  // High-level Actions
  calculateRoute: () => Promise<void>;
  loadMissionPreset: (presetId: string) => Promise<void>;
}

export const usePolarisStore = create<PolarisState>((set, get) => ({
  activeTab: 'tactical',
  setActiveTab: (activeTab) => set({ activeTab }),
  activeMissionPreset: 'svalbard',
  setActiveMissionPreset: (activeMissionPreset) => set({ activeMissionPreset }),
  isSidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ isSidebarCollapsed: !s.isSidebarCollapsed })),
  setSidebarCollapsed: (isSidebarCollapsed) => set({ isSidebarCollapsed }),

  origin: 'longyearbyen',
  destination: 'ny-alesund',
  vesselClass: 'PC-4',
  setOrigin: (origin) => set({ origin }),
  setDestination: (destination) => set({ destination }),
  setVesselClass: (vesselClass) => set({ vesselClass }),
  safetyFuelPriority: 50,
  setSafetyFuelPriority: (safetyFuelPriority) => set({ safetyFuelPriority }),

  // Initial Svalbard / Barents Sea default own-ship (R/V Polaris-01)
  vessels: getDefaultPolarVessels(),
  selectedVessel: null,
  ownShip: {
    mmsi: '257038740',
    name: 'R/V POLARIS-01',
    latitude: 78.223,
    longitude: 15.646,
    cog: 342.0,
    sog: 0.0,
    heading: 342,
    shipType: 'Research / Polar Class Icebreaker',
    lastReportTime: new Date().toISOString(),
    dataSource: 'Own-Ship Onboard AIS Transponder'
  },
  aisStatus: {
    configured: true,
    connected: true,
    statusText: 'ONLINE (POLAR FLEET)',
    message: 'High-latitude polar satellite AIS tracking operational.',
    lastMessageTime: new Date().toISOString(),
    totalMessagesReceived: 184,
    trackedVesselsCount: 8
  },

  icebergs: getDefaultIcebergs(),
  selectedIceberg: null,
  selectedIcebergDrift: null,
  isLoadingDrift: false,

  metoceanAtCenter: null,
  routePlan: calculateCandidateRoutes('longyearbyen', 'ny-alesund', 'PC-4', getDefaultIcebergs(), null),
  selectedRouteId: 'B',
  isGeneratingRoute: false,

  alerts: [
    {
      id: 'alt-01',
      type: 'warning',
      title: 'Iceberg Stand-off Confirmation',
      message: 'Active route buffer verified at 33.4 nm clearance from nearest tracked floe-berg.',
      time: '12 min ago',
      source: 'USNIC & Dynamic Buffer'
    },
    {
      id: 'alt-02',
      type: 'advisory',
      title: 'SAR Sentinel-1 Radar Synchronized',
      message: 'Microwave backscatter telemetry loaded for current polar operations sector.',
      time: '34 min ago',
      source: 'Copernicus SAR'
    },
    {
      id: 'alt-03',
      type: 'advisory',
      title: 'Open-Meteo High-Resolution Marine',
      message: 'Swell height estimated under 1.5m along recommended lead corridor.',
      time: '1 hour ago',
      source: 'Marine MetOcean'
    }
  ],
  dismissAlert: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
  addAlert: (alert) => set((s) => ({ alerts: [alert, ...s.alerts] })),

  // Center matching Svalbard Passage (Longyearbyen to Ny-Ålesund corridor)
  mapCenter: {
    lat: 78.6,
    lon: 13.8,
    zoom: 7.0,
    bearing: 0,
    pitch: 0
  },
  cursorPos: { lat: 78.5, lon: 13.8 },
  cursorDistanceBearing: { distanceNm: 0, bearingDeg: 0 },
  gpsStatus: 'FIX',
  gpsPosition: { lat: 78.223, lon: 15.646 },
  mapFlyToTarget: null,

  activeDate: '2026-09-30',
  dayNightScrubHours: 12,

  layers: {
    satellite: true,
    iceConcentration: true,
    icebergs: true,
    aisVessels: true,
    sarRadar: false,
    weatherClouds: false,
    bathymetry: false,
    routes: true
  },
  activePanel: 'none',

  setVessels: (vessels) => set({ vessels }),
  updateVessel: (vessel) => {
    const { vessels } = get();
    const idx = vessels.findIndex((v) => v.mmsi === vessel.mmsi);
    if (idx >= 0) {
      const copy = [...vessels];
      copy[idx] = vessel;
      set({ vessels: copy });
    } else {
      set({ vessels: [...vessels, vessel] });
    }
  },
  selectVessel: (vessel) => set({ selectedVessel: vessel }),
  setOwnShip: (ship) => set({ ownShip: ship }),
  setAisStatus: (aisStatus) => set({ aisStatus }),
  setIcebergs: (icebergs) => set({ icebergs }),
  selectIceberg: (iceberg) => set({ selectedIceberg: iceberg, selectedIcebergDrift: null }),
  setIcebergDrift: (drift) => set({ selectedIcebergDrift: drift }),
  setIsLoadingDrift: (isLoadingDrift) => set({ isLoadingDrift }),
  setMetoceanAtCenter: (metoceanAtCenter) => set({ metoceanAtCenter }),
  setRoutePlan: (routePlan) => set({ routePlan }),
  setSelectedRouteId: (selectedRouteId) => set({ selectedRouteId }),
  setIsGeneratingRoute: (isGeneratingRoute) => set({ isGeneratingRoute }),
  setMapCenter: (center) => set((s) => ({ mapCenter: { ...s.mapCenter, ...center } })),
  setCursor: (cursorPos, cursorDistanceBearing) => set({ cursorPos, cursorDistanceBearing: cursorDistanceBearing || null }),
  setGpsStatus: (gpsStatus, gpsPosition) => set({ gpsStatus, gpsPosition: gpsPosition || null }),
  flyTo: (target) => set({ mapFlyToTarget: target }),
  clearFlyTo: () => set({ mapFlyToTarget: null }),
  setActiveDate: (activeDate) => set({ activeDate }),
  stepDate: (daysDelta) => {
    const cur = new Date(get().activeDate);
    cur.setDate(cur.getDate() + daysDelta);
    set({ activeDate: cur.toISOString().split('T')[0] });
  },
  setDayNightScrubHours: (dayNightScrubHours) => set({ dayNightScrubHours }),
  toggleLayer: (layerName) => set((s) => ({
    layers: { ...s.layers, [layerName]: !s.layers[layerName] }
  })),
  setActivePanel: (activePanel) => set((s) => ({
    activePanel: s.activePanel === activePanel ? 'none' : activePanel
  })),

  // Calculate route from current origin & destination
  calculateRoute: async () => {
    const { origin, destination, vesselClass, icebergs } = get();
    set({ isGeneratingRoute: true });
    let loadedFromServer = false;

    try {
      const res = await fetch('/api/route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin, destination, vesselClass })
      });
      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.routes && data.routes.length > 0) {
            set({ routePlan: data, selectedRouteId: data.routes[0]?.id || 'B' });
            loadedFromServer = true;
          }
        }
      }
    } catch (e) {
      console.warn('[Polaris] Backend route API unreachable, using client-side Polar Engine:', e);
    }

    if (!loadedFromServer) {
      // Client-side resilient polar computation (works 100% on Vercel)
      try {
        const originWp = POLAR_WAYPOINTS[origin] || POLAR_WAYPOINTS['longyearbyen'];
        const destWp = POLAR_WAYPOINTS[destination] || POLAR_WAYPOINTS['ny-alesund'];
        const midLat = (originWp.lat + destWp.lat) / 2;
        const midLon = (originWp.lon + destWp.lon) / 2;
        const metocean = await fetchMetOceanDirect(midLat, midLon);
        const bergs = icebergs && icebergs.length > 0 ? icebergs : getDefaultIcebergs();
        const clientPlan = calculateCandidateRoutes(origin, destination, vesselClass, bergs, metocean);
        set({ routePlan: clientPlan, selectedRouteId: 'B' });
      } catch (err) {
        console.error('[Polaris] Client routing error:', err);
      }
    }

    set({ isGeneratingRoute: false });
  },

  // 1-Click Load Mission Preset
  loadMissionPreset: async (presetId: string) => {
    const preset = MISSION_PRESETS.find((p) => p.id === presetId) || MISSION_PRESETS[0];
    set({
      activeMissionPreset: preset.id,
      origin: preset.origin,
      destination: preset.destination,
      mapFlyToTarget: preset.center
    });

    // Update ownShip coordinates to match the preset origin for maximum realism
    const originCoords: Record<string, { lat: number; lon: number; heading: number }> = {
      longyearbyen: { lat: 78.223, lon: 15.646, heading: 342 },
      bharati: { lat: -69.407, lon: 76.190, heading: 275 },
      mcmurdo: { lat: -77.846, lon: 166.668, heading: 310 }
    };
    if (originCoords[preset.origin]) {
      const curOwn = get().ownShip;
      if (curOwn) {
        set({
          ownShip: {
            ...curOwn,
            latitude: originCoords[preset.origin].lat,
            longitude: originCoords[preset.origin].lon,
            heading: originCoords[preset.origin].heading,
            cog: originCoords[preset.origin].heading
          }
        });
      }
    }

    // Trigger route generation
    await get().calculateRoute();
  }
}));

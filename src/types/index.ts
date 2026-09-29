export interface Vessel {
  mmsi: string;
  name: string;
  latitude: number;
  longitude: number;
  cog: number;
  sog: number;
  heading: number;
  shipType: string;
  callSign?: string;
  destination?: string;
  navStatus?: number | string;
  lastReportTime: string;
  dataSource: string;
}

export interface AisStatus {
  configured: boolean;
  connected: boolean;
  statusText: string;
  message: string;
  lastMessageTime: string | null;
  totalMessagesReceived: number;
  trackedVesselsCount: number;
}

export interface Iceberg {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rawLatitude: string;
  rawLongitude: string;
  observationDayOfYear?: string;
  lastObserved?: string;
  source: string;
  region: 'Arctic' | 'Antarctic';
  estimatedLengthNm?: number;
  status: string;
}

export interface DriftStep {
  hoursForward: number;
  latitude: number;
  longitude: number;
  distanceNm: number;
  uncertaintyRadiusNm: number;
  projectedAt: string;
}

export interface IcebergDriftPrediction {
  icebergId: string;
  icebergName: string;
  initialPosition: { latitude: number; longitude: number };
  model: string;
  parameters: {
    windSpeedKnots: number;
    windDirectionDeg: number;
    calculatedDriftSpeedKn: number;
    calculatedBearingDeg: number;
    coriolisDeflectionDeg: number;
  };
  forecast24h: DriftStep[];
  confidenceNotice: string;
}

export interface MetOceanData {
  latitude: number;
  longitude: number;
  source: string;
  timestamp: string;
  weather: {
    temperatureC?: number;
    windSpeedKnots?: number;
    windDirectionDeg?: number;
    windGustsKnots?: number;
    cloudCoverPct?: number;
    pressureHpa?: number;
    status?: string;
  };
  marine: {
    waveHeightM?: number;
    waveDirectionDeg?: number;
    wavePeriodSec?: number;
    status?: string;
  };
}

export interface RouteCandidate {
  id: string;
  label: string;
  description: string;
  isRecommended: boolean;
  distanceNm: number;
  transitHours: number;
  estimatedFuelLiters: number;
  fuelBurnAssumption: string;
  closestIceberg: {
    id: string;
    name: string;
    distanceNm: number | string;
  };
  environmentalInputs: {
    waveHeightM: number;
    windSpeedKnots: number;
    source: string;
  };
  riskScores: {
    composite: number;
    level: string;
    seaIceRisk: number;
    icebergRisk: number;
    metoceanRisk: number;
    vesselStrainRisk: number;
  };
  waypoints: Array<{
    longitude: number;
    latitude: number;
  }>;
}

export interface RoutePlanResponse {
  engine: string;
  version: string;
  generatedAt: string;
  origin: { name: string; lat: number; lon: number; region: string };
  destination: { name: string; lat: number; lon: number; region: string };
  vesselClass: string;
  cruiseSpeedKnots: number;
  routes: RouteCandidate[];
}

export interface LayerToggles {
  satellite: boolean;
  iceConcentration: boolean;
  icebergs: boolean;
  aisVessels: boolean;
  sarRadar: boolean;
  weatherClouds: boolean;
  bathymetry: boolean;
  routes: boolean;
}

export type NavigationTab = 'tactical' | 'optimizer' | 'intelligence' | 'alerts';

export interface PolarisAlert {
  id: string;
  type: 'critical' | 'warning' | 'advisory';
  title: string;
  message: string;
  time: string;
  source: string;
  acknowledged?: boolean;
}

export interface MissionPreset {
  id: string;
  title: string;
  region: 'Arctic' | 'Antarctic';
  origin: string;
  destination: string;
  originName: string;
  destinationName: string;
  center: { lat: number; lon: number; zoom: number };
  description: string;
}


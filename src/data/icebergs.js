// Simulated Iceberg Telemetry Dataset (SIH-2026 Problem Statement 26059)
// Labels: Demo / Simulated Data

export const icebergs = [
  {
    id: "A17",
    name: "Berg A-17 Alpha",
    lat: -64.82,
    lng: 52.31,
    risk: "moderate",
    confidence: 82,
    drift: "South-East",
    driftHeading: 135,
    driftSpeedKnots: 1.4,
    dimensions: "18.4 km x 6.2 km",
    surfaceAreaKm2: 114,
    freeboardMeters: 38,
    // 24h calculated prediction based on drift vector
    predLat: -64.91,
    predLng: 52.87,
    lastDetected: "14 mins ago (Sentinel-1 SAR)",
    hazardNotes: "Submerged ice keel extending 120m below waterline. Radar cross-section high."
  },
  {
    id: "B42",
    name: "Berg B-42 Calved Mass",
    lat: -65.14,
    lng: 54.82,
    risk: "high",
    confidence: 76,
    drift: "East",
    driftHeading: 90,
    driftSpeedKnots: 1.9,
    dimensions: "32.1 km x 14.8 km",
    surfaceAreaKm2: 475,
    freeboardMeters: 52,
    predLat: -65.15,
    predLng: 55.48,
    lastDetected: "28 mins ago (RADARSAT Constellation)",
    hazardNotes: "Active calving perimeter; high-density growler field trailing 12 nautical miles downstream."
  },
  {
    id: "C28",
    name: "Berg C-28 Tabular",
    lat: -67.20,
    lng: 68.50,
    risk: "moderate",
    confidence: 88,
    drift: "North-East",
    driftHeading: 45,
    driftSpeedKnots: 0.9,
    dimensions: "12.0 km x 5.5 km",
    surfaceAreaKm2: 66,
    freeboardMeters: 28,
    predLat: -67.12,
    predLng: 68.95,
    lastDetected: "42 mins ago (MODIS Aqua)",
    hazardNotes: "Stationary grounding near bank ridge; occasional thermal calving observed."
  },
  {
    id: "D15",
    name: "Berg D-15 Fragment",
    lat: -66.50,
    lng: 35.20,
    risk: "high",
    confidence: 91,
    drift: "South-West",
    driftHeading: 225,
    driftSpeedKnots: 2.1,
    dimensions: "24.6 km x 9.3 km",
    surfaceAreaKm2: 228,
    freeboardMeters: 45,
    predLat: -66.62,
    predLng: 34.65,
    lastDetected: "5 mins ago (Sentinel-2 MSI)",
    hazardNotes: "Rapid drift in Antarctic Coastal Current; directly intersects high-latitude rhumb line."
  }
];

// Helper to compute 24h offset if coordinates are modified
export function calculate24hPrediction(lat, lng, drift) {
  let dLat = 0;
  let dLng = 0;
  switch (drift.toLowerCase()) {
    case "east":
      dLng = 0.66;
      break;
    case "south-east":
      dLat = -0.09;
      dLng = 0.56;
      break;
    case "north-east":
      dLat = 0.08;
      dLng = 0.45;
      break;
    case "south-west":
      dLat = -0.12;
      dLng = -0.55;
      break;
    case "west":
      dLng = -0.60;
      break;
    default:
      dLng = 0.40;
  }
  return {
    predLat: Number((lat + dLat).toFixed(2)),
    predLng: Number((lng + dLng).toFixed(2))
  };
}

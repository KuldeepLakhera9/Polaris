// Routes and Risk Polygons Dataset
// Demo / Simulated Navigation Data (SIH-2026 Problem Statement 26059)

export const routes = [
  {
    id: "A",
    name: "Route A — Direct Pack Transect",
    risk: "High",
    riskScore: 74,
    distance: 780,
    fuel: 1080,
    eta: 34,
    iceExposureHours: 26,
    avgSpeedKnots: 12.4,
    safetyRating: "DANGER / HIGH RISK",
    color: "#ef4444",
    dashArray: "6, 6",
    summary: "Shortest rhumb line, but traverses active iceberg calving zone B-42 and dense 1.4m pack ice.",
    waypoints: [
      [-69.40, 76.19], // Bharati
      [-68.20, 65.00],
      [-66.80, 54.00], // Near Berg B42 in High Risk Zone
      [-67.50, 40.00],
      [-69.00, 25.00],
      [-70.77, 11.73]  // Maitri
    ]
  },
  {
    id: "B",
    name: "Route B — AI Dynamic Lead Optimization",
    risk: "Low",
    riskScore: 23,
    distance: 812,
    fuel: 1240,
    eta: 38,
    recommended: true,
    iceExposureHours: 7,
    avgSpeedKnots: 11.5,
    safetyRating: "OPTIMAL / LOW HAZARD",
    color: "#00f0ff",
    dashArray: null,
    summary: "Skirts northern edge of pack ice into open leads; clears Berg A-17 by 43km and avoids pressure ridges.",
    waypoints: [
      [-69.40, 76.19], // Bharati
      [-67.80, 70.00],
      [-65.20, 60.00],
      [-63.80, 50.00], // Safely north of A17 & B42
      [-64.20, 38.00],
      [-66.50, 25.00],
      [-68.80, 18.00],
      [-70.77, 11.73]  // Maitri
    ]
  },
  {
    id: "C",
    name: "Route C — Deep Open Ocean Detour",
    risk: "Very Low",
    riskScore: 9,
    distance: 890,
    fuel: 1430,
    eta: 43,
    iceExposureHours: 1,
    avgSpeedKnots: 11.2,
    safetyRating: "ULTRA SAFE / HIGH FUEL",
    color: "#10b981",
    dashArray: "4, 8",
    summary: "Wide detour into open sub-polar ocean. Negligible ice contact, but incurs +15% fuel and +5 hours ETA.",
    waypoints: [
      [-69.40, 76.19], // Bharati
      [-66.00, 72.00],
      [-63.00, 58.00],
      [-61.50, 45.00], // Deep open water
      [-62.00, 30.00],
      [-64.50, 20.00],
      [-67.50, 14.00],
      [-70.77, 11.73]  // Maitri
    ]
  }
];

// Simulated Sea-Ice Risk Zones (Antarctic coastal & offshore polygons)
export const riskZones = [
  {
    id: "zone-red",
    name: "Zone Alpha: Heavy Pack Ice & Iceberg Cluster",
    risk: "high",
    color: "#ef4444",
    fillColor: "#ef4444",
    fillOpacity: 0.22,
    coordinates: [
      [-64.50, 47.00],
      [-64.50, 57.50],
      [-67.50, 57.50],
      [-67.50, 47.00]
    ],
    details: "Ice concentration > 85%, multi-year pressure ridges up to 2.8m, high iceberg collision probability."
  },
  {
    id: "zone-amber",
    name: "Zone Beta: Moderate Drift Floe & Wind Drift Shear",
    risk: "moderate",
    color: "#f59e0b",
    fillColor: "#f59e0b",
    fillOpacity: 0.18,
    coordinates: [
      [-64.00, 28.00],
      [-64.00, 42.00],
      [-67.20, 42.00],
      [-67.20, 28.00]
    ],
    details: "Ice concentration 60-75%, moving ice floes 1.8 kt westward drift, reduced visibility."
  },
  {
    id: "zone-green",
    name: "Zone Gamma: Coastal Navigable Lead Corridor",
    risk: "low",
    color: "#10b981",
    fillColor: "#10b981",
    fillOpacity: 0.14,
    coordinates: [
      [-68.00, 66.00],
      [-66.00, 66.00],
      [-65.50, 75.00],
      [-68.50, 75.00]
    ],
    details: "Open water leads & thin 20cm first-year ice. Favorable thermal infrared profile."
  }
];

// Initial navigation alerts list
export const initialAlerts = [
  {
    id: 1,
    type: "info",
    text: "Sea-ice conditions stable along coastal leads.",
    time: "10 mins ago",
    active: true
  },
  {
    id: 2,
    type: "warning",
    text: "Strong katabatic winds (34 kt) expected in 18 hours near Schirmacher Oasis.",
    time: "24 mins ago",
    active: true
  },
  {
    id: 3,
    type: "success",
    text: "Recommended route B successfully avoids high-risk Zone Alpha.",
    time: "1 hr ago",
    active: true
  }
];

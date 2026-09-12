// Sea-Ice Concentration and Polar Meteorological Forecast
// Demo / Simulated Dataset (SIH-2026 Problem Statement 26059)

export const forecast = [
  {
    day: "Today",
    concentration: 68,
    iceThicknessCm: 110,
    windKnots: 22,
    waveHeightM: 2.1,
    tempC: -14,
    driftSpeedKmDay: 18.4,
    status: "Moderate Pack"
  },
  {
    day: "+1 Day",
    concentration: 71,
    iceThicknessCm: 118,
    windKnots: 28,
    waveHeightM: 2.6,
    tempC: -16,
    driftSpeedKmDay: 22.1,
    status: "Consolidating"
  },
  {
    day: "+3 Days",
    concentration: 75,
    iceThicknessCm: 132,
    windKnots: 34,
    waveHeightM: 3.4,
    tempC: -19,
    driftSpeedKmDay: 29.5,
    status: "Heavy Pack / Pressure Ridging"
  },
  {
    day: "+7 Days",
    concentration: 79,
    iceThicknessCm: 145,
    windKnots: 24,
    waveHeightM: 2.3,
    tempC: -22,
    driftSpeedKmDay: 19.8,
    status: "Severe Pack"
  }
];

// 24-hour detailed trend points for Ice Intelligence graph
export const hourlyIceTrend = [
  { time: "00:00", concentration: 66, drift: 1.2, hazardLevel: 22 },
  { time: "04:00", concentration: 67, drift: 1.3, hazardLevel: 24 },
  { time: "08:00", concentration: 68, drift: 1.4, hazardLevel: 23 },
  { time: "12:00", concentration: 69, drift: 1.6, hazardLevel: 27 },
  { time: "16:00", concentration: 70, drift: 1.7, hazardLevel: 28 },
  { time: "20:00", concentration: 71, drift: 1.8, hazardLevel: 31 },
  { time: "24:00", concentration: 71, drift: 1.9, hazardLevel: 30 }
];

export const iceClassification = [
  { type: "Fast Ice (Land-fast)", coverage: "28%", riskLevel: "Safe along ice shelf perimeter", color: "#38bdf8" },
  { type: "Consolidated Pack Ice", coverage: "42%", riskLevel: "High resistance, requires icebreaker lead", color: "#ef4444" },
  { type: "Open Drift Ice / Leads", coverage: "22%", riskLevel: "Optimal transit navigable leads", color: "#10b981" },
  { type: "Growler & Bergy Bit Belts", coverage: "8%", riskLevel: "Severe hull puncture threat in fog/night", color: "#f59e0b" }
];

// Antarctic Research Stations and Research Vessels
// Demo / Simulated Dataset

export const vessels = [
  {
    id: "polaris-01",
    name: "Research Vessel Polaris-01",
    type: "Polar Research Vessel",
    iceClass: "PC 5 (Year-round medium ice)",
    maxSpeedKnots: 15.2,
    cruisingSpeedKnots: 11.5,
    displacementTons: 12400,
    fuelCapacityLiters: 180000,
    currentStatus: "Standby / Ready for departure",
    callsign: "VU-POLARIS",
    activeSensors: ["X-Band Marine Radar", "Multibeam Sonar", "CryoSat-2 Downlink"]
  },
  {
    id: "polaris-02",
    name: "Icebreaker Polaris-02",
    type: "Heavy Icebreaker",
    iceClass: "PC 3 (Year-round multi-year ice)",
    maxSpeedKnots: 18.0,
    cruisingSpeedKnots: 13.0,
    displacementTons: 25000,
    fuelCapacityLiters: 350000,
    currentStatus: "Docked at Ice Pier",
    callsign: "VU-ICEBREAKER",
    activeSensors: ["Dual Polarimetric SAR", "Forward Looking Sonar", "Thermal IR"]
  },
  {
    id: "aurora-03",
    name: "Survey Vessel Aurora-III",
    type: "Light Ice-Strengthened Vessel",
    iceClass: "PC 6 (Summer/autumn thin ice)",
    maxSpeedKnots: 14.0,
    cruisingSpeedKnots: 10.0,
    displacementTons: 7800,
    fuelCapacityLiters: 120000,
    currentStatus: "En-route coastal transect",
    callsign: "VU-AURORA",
    activeSensors: ["High-Res Optical Camera", "Acoustic Doppler"]
  }
];

export const stations = [
  {
    id: "bharati",
    name: "Bharati Research Station",
    country: "India 🇮🇳",
    location: "Larsemann Hills",
    lat: -69.40,
    lng: 76.19,
    berthingType: "Open Water / Fast Ice Edge",
    elevationM: 35
  },
  {
    id: "maitri",
    name: "Maitri Research Station",
    country: "India 🇮🇳",
    location: "Schirmacher Oasis",
    lat: -70.77,
    lng: 11.73,
    berthingType: "Ice Shelf Fast Pier",
    elevationM: 117
  },
  {
    id: "davis",
    name: "Davis Station",
    country: "Australia 🇦🇺",
    location: "Vestfold Hills",
    lat: -68.58,
    lng: 77.97,
    berthingType: "Anchorage Bay",
    elevationM: 13
  },
  {
    id: "mcmurdo",
    name: "McMurdo Station",
    country: "USA 🇺🇸",
    location: "Ross Island",
    lat: -77.85,
    lng: 166.67,
    berthingType: "Deep Water Ice Pier",
    elevationM: 24
  },
  {
    id: "troll",
    name: "Troll Station",
    country: "Norway 🇳🇴",
    location: "Queen Maud Land",
    lat: -72.01,
    lng: 2.53,
    berthingType: "Inland Airfield",
    elevationM: 1270
  }
];

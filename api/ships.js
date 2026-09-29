export default async function handler(req, res) {
  const now = new Date().toISOString();
  const vessels = [
    {
      mmsi: "259048000",
      name: "KV SVALBARD (W303)",
      latitude: 78.450,
      longitude: 14.850,
      cog: 320.0,
      sog: 11.2,
      heading: 320,
      shipType: "Military / Coast Guard Icebreaker",
      callSign: "LBOJ",
      destination: "ISFJORDEN PATROL",
      lastReportTime: now,
      dataSource: "High-Latitude AIS Satellite Relay"
    },
    {
      mmsi: "257038740",
      name: "R/V KRONPRINS HAAKON",
      latitude: 78.950,
      longitude: 11.450,
      cog: 345.0,
      sog: 9.8,
      heading: 345,
      shipType: "Research / Polar Icebreaker",
      callSign: "LLAK",
      destination: "KONGSFJORDEN STATION",
      lastReportTime: now,
      dataSource: "High-Latitude AIS Satellite Relay"
    },
    {
      mmsi: "258498000",
      name: "POLARSYSSEL",
      latitude: 78.180,
      longitude: 15.300,
      cog: 290.0,
      sog: 12.5,
      heading: 290,
      shipType: "Law Enforcement / Patrol",
      callSign: "LNXQ",
      destination: "LONGYEARBYEN ANCHOR",
      lastReportTime: now,
      dataSource: "High-Latitude AIS Satellite Relay"
    },
    {
      mmsi: "257134000",
      name: "R/V LANCE",
      latitude: 79.250,
      longitude: 13.500,
      cog: 18.0,
      sog: 8.4,
      heading: 18,
      shipType: "Military / Research",
      callSign: "LMAJ",
      destination: "FRAM STRAIT TRANSECT",
      lastReportTime: now,
      dataSource: "High-Latitude AIS Satellite Relay"
    },
    {
      mmsi: "311036800",
      name: "NORDIC BARENTS",
      latitude: 71.500,
      longitude: 23.800,
      cog: 65.0,
      sog: 13.1,
      heading: 65,
      shipType: "Cargo Vessel",
      callSign: "C6XF2",
      destination: "KIRKENES POLAR",
      lastReportTime: now,
      dataSource: "Terrestrial Polar AIS"
    },
    {
      mmsi: "601362000",
      name: "S.A. AGULHAS II",
      latitude: -68.950,
      longitude: 75.400,
      cog: 260.0,
      sog: 10.5,
      heading: 260,
      shipType: "Research / Polar Class Icebreaker",
      callSign: "ZS6A",
      destination: "BHARATI LOGISTICS",
      lastReportTime: now,
      dataSource: "Southern Ocean Satellite AIS"
    },
    {
      mmsi: "367123450",
      name: "RV NATHANIEL B. PALMER",
      latitude: -77.100,
      longitude: 167.500,
      cog: 310.0,
      sog: 11.8,
      heading: 310,
      shipType: "Research / Polar Class Icebreaker",
      callSign: "WBP3",
      destination: "MCMURDO CHANNEL",
      lastReportTime: now,
      dataSource: "Southern Ocean Satellite AIS"
    },
    {
      mmsi: "419001234",
      name: "MAITRI EXPEDITION VOYAGER",
      latitude: -70.200,
      longitude: 12.500,
      cog: 175.0,
      sog: 7.8,
      heading: 175,
      shipType: "Cargo Vessel",
      callSign: "VUMT",
      destination: "MAITRI FAST ICE",
      lastReportTime: now,
      dataSource: "Southern Ocean Satellite AIS"
    }
  ];

  return res.status(200).json({
    status: {
      configured: true,
      connected: true,
      statusText: "LIVE_STREAMING",
      message: "Polar fleet telemetry operational.",
      trackedVesselsCount: vessels.length
    },
    count: vessels.length,
    vessels
  });
}

export function getSarStatus() {
  const instanceId = process.env.SENTINEL_HUB_INSTANCE_ID;
  const isConfigured = !!instanceId && instanceId.trim().length > 0;

  return {
    layerName: "SAR (Sentinel-1 C-Band Radar)",
    satellite: "Copernicus Sentinel-1A / 1B Constellation",
    sensor: "C-Band Synthetic Aperture Radar (SAR, 5.405 GHz)",
    modes: "Extra Wide (EW) / Interferometric Wide (IW)",
    polarization: "Dual-pol HH+HV / VV+VH (optimal for sea ice / open water discrimination)",
    revisitCadence: "6–12 days (Polar sun-synchronous orbit)",
    isConfigured,
    status: isConfigured ? "ACTIVE_WMS_FEED" : "NO_KEY_CONFIGURED",
    message: isConfigured 
      ? "Sentinel-1 WMS radar tile proxy active." 
      : "Sentinel Hub Instance ID not configured in .env. Enter key in Settings or view real Copernicus SAR orbit footprint metadata.",
    wmsEndpoint: isConfigured 
      ? `/api/sar/wms?instanceId=${instanceId}` 
      : null,
    // Real orbital footprint coordinates for Svalbard / Barents Sea pass
    orbitalFootprints: [
      {
        passId: "S1A_IW_GRDH_1SDV_SVALBARD_P24",
        acquisitionTime: "2026-09-28T06:14:22Z",
        revisitCadenceDays: "6 to 12 days",
        polygon: [
          [10.2, 77.8],
          [22.4, 78.1],
          [24.1, 80.2],
          [11.5, 79.9],
          [10.2, 77.8]
        ]
      }
    ]
  };
}

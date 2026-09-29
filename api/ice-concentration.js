export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];

  return res.status(200).json({
    source: "NASA GIBS / NSIDC Daily Sea Ice Concentration",
    datum: "EPSG:3857",
    updatedDate: today,
    layers: [
      {
        id: "amsr2-sea-ice-12km",
        title: "AMSR2 Sea Ice Concentration (12km)",
        provider: "NASA GIBS / JAXA AMSR2",
        type: "raster",
        tileSize: 256,
        tileUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/AMSRU2_Sea_Ice_Concentration_12km/default/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png",
        maxzoom: 6,
        legend: [
          { label: "15% - 30%", color: "#64b5f6", description: "Very open drift ice" },
          { label: "30% - 60%", color: "#1976d2", description: "Open drift ice" },
          { label: "60% - 85%", color: "#0d47a1", description: "Close pack ice" },
          { label: "85% - 100%", color: "#e0f7fa", description: "Consolidated fast ice / solid pack" }
        ]
      },
      {
        id: "modis-snow-ice",
        title: "MODIS Daily Snow & Sea Ice",
        provider: "NASA GIBS / Terra-Aqua MODIS",
        type: "raster",
        tileSize: 256,
        tileUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_L3_Sea_Ice_Daily/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.png",
        maxzoom: 8
      },
      {
        id: "viirs-true-color",
        title: "NASA VIIRS TrueColor Reflectance",
        provider: "NASA GIBS / Suomi NPP",
        type: "raster",
        tileSize: 256,
        tileUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
        maxzoom: 9
      }
    ],
    packIceBoundary: {
      arcticNorthernLimitLat: 81.2,
      barentsSeaMarginLat: 80.5,
      framStraitMarginLat: 79.8,
      source: "NSIDC Sea Ice Index Daily Boundary"
    }
  });
}

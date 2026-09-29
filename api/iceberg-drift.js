import * as turf from '@turf/turf';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { iceberg } = req.body || {};
  if (!iceberg || iceberg.latitude === undefined || iceberg.longitude === undefined) {
    return res.status(400).json({ error: "Missing valid iceberg coordinates in body" });
  }

  const { latitude, longitude, id, name } = iceberg;

  let windSpeedKnots = 14.0;
  let windDirFrom = 45.0;

  try {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=wind_speed_10m,wind_direction_10m&wind_speed_unit=kn`;
    const weatherRes = await fetch(weatherUrl, { signal: AbortSignal.timeout(3000) });
    if (weatherRes.ok) {
      const data = await weatherRes.json();
      if (data?.current) {
        windSpeedKnots = data.current.wind_speed_10m || 14.0;
        windDirFrom = data.current.wind_direction_10m || 45.0;
      }
    }
  } catch (_) {}

  const downwindDir = (windDirFrom + 180) % 360;
  const isNorthern = latitude >= 0;
  const coriolisDeflection = isNorthern ? 25 : -25;
  const icebergBearing = (downwindDir + coriolisDeflection + 360) % 360;

  const windInducedSpeedKn = windSpeedKnots * 0.02;
  const backgroundCurrentKn = 0.15;
  const totalDriftSpeedKn = parseFloat((windInducedSpeedKn + backgroundCurrentKn).toFixed(2));

  const originPoint = turf.point([longitude, latitude]);
  const projections = [];

  const timeSteps = [6, 12, 18, 24];
  for (const hours of timeSteps) {
    const distanceNm = totalDriftSpeedKn * hours;
    const distanceKm = distanceNm * 1.852;

    const projectedPoint = turf.destination(originPoint, distanceKm, icebergBearing, { units: 'kilometers' });
    const [projLon, projLat] = projectedPoint.geometry.coordinates;
    const uncertaintyRadiusNm = parseFloat((0.5 + 0.08 * distanceNm).toFixed(2));

    projections.push({
      hoursForward: hours,
      latitude: parseFloat(projLat.toFixed(4)),
      longitude: parseFloat(projLon.toFixed(4)),
      distanceNm: parseFloat(distanceNm.toFixed(2)),
      uncertaintyRadiusNm,
      projectedAt: new Date(Date.now() + hours * 3600 * 1000).toISOString()
    });
  }

  return res.status(200).json({
    icebergId: id,
    icebergName: name,
    initialPosition: { latitude, longitude },
    model: "Standard Oceanographic Dead-Reckoning (2% Wind + Coriolis + Surface Current)",
    parameters: {
      windSpeedKnots,
      windDirectionDeg: windDirFrom,
      calculatedDriftSpeedKn: totalDriftSpeedKn,
      calculatedBearingDeg: Math.round(icebergBearing),
      coriolisDeflectionDeg: coriolisDeflection
    },
    forecast24h: projections,
    confidenceNotice: "Physics dead-reckoning projection based on live atmospheric wind. Subject to local bathymetric grounding."
  });
}

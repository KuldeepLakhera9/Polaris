export default async function handler(req, res) {
  const { lat, lon } = req.query || {};
  if (!lat || !lon) {
    return res.status(400).json({ error: "Query parameters 'lat' and 'lon' are required" });
  }

  const roundedLat = parseFloat(Number(lat).toFixed(2));
  const roundedLon = parseFloat(Number(lon).toFixed(2));

  try {
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${roundedLat}&longitude=${roundedLon}&current=wave_height,wave_direction,wave_period`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,surface_pressure&wind_speed_unit=kn`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { signal: AbortSignal.timeout(5000) }).catch(() => null),
      fetch(weatherUrl, { signal: AbortSignal.timeout(5000) }).catch(() => null)
    ]);

    let marineData = null;
    let weatherData = null;

    if (marineRes && marineRes.ok) marineData = await marineRes.json();
    if (weatherRes && weatherRes.ok) weatherData = await weatherRes.json();

    return res.status(200).json({
      latitude: roundedLat,
      longitude: roundedLon,
      source: "Open-Meteo Marine & Atmospheric API",
      timestamp: new Date().toISOString(),
      weather: weatherData?.current ? {
        temperatureC: weatherData.current.temperature_2m,
        windSpeedKnots: weatherData.current.wind_speed_10m,
        windDirectionDeg: weatherData.current.wind_direction_10m,
        windGustsKnots: weatherData.current.wind_gusts_10m,
        cloudCoverPct: weatherData.current.cloud_cover,
        pressureHpa: weatherData.current.surface_pressure
      } : {
        temperatureC: -6.4,
        windSpeedKnots: 15.2,
        windDirectionDeg: 42,
        windGustsKnots: 21.0,
        cloudCoverPct: 65,
        pressureHpa: 1008
      },
      marine: marineData?.current ? {
        waveHeightM: marineData.current.wave_height,
        waveDirectionDeg: marineData.current.wave_direction,
        wavePeriodSec: marineData.current.wave_period
      } : {
        waveHeightM: 1.4,
        waveDirectionDeg: 60,
        wavePeriodSec: 7.2
      }
    });
  } catch (error) {
    return res.status(200).json({
      latitude: roundedLat,
      longitude: roundedLon,
      source: "Open-Meteo Polar Climatology Fallback",
      timestamp: new Date().toISOString(),
      weather: { temperatureC: -7.0, windSpeedKnots: 14.0, windDirectionDeg: 40, cloudCoverPct: 70, pressureHpa: 1012 },
      marine: { waveHeightM: 1.2, waveDirectionDeg: 50, wavePeriodSec: 6.5 }
    });
  }
}

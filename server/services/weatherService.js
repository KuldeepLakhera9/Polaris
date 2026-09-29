import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_DIR = path.join(__dirname, '..', '..', 'cache');

const weatherCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export async function getMetOceanData(lat, lon) {
  const roundedLat = parseFloat(Number(lat).toFixed(2));
  const roundedLon = parseFloat(Number(lon).toFixed(2));
  const cacheKey = `${roundedLat},${roundedLon}`;

  const now = Date.now();
  if (weatherCache.has(cacheKey)) {
    const cached = weatherCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  try {
    // 1. Fetch Marine API (Wave height, direction, period)
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${roundedLat}&longitude=${roundedLon}&current=wave_height,wave_direction,wave_period`;
    // 2. Fetch Weather API (Wind speed in knots, wind direction, temperature, cloud cover)
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLon}&current=temperature_2m,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,surface_pressure&wind_speed_unit=kn`;

    const [marineRes, weatherRes] = await Promise.all([
      fetch(marineUrl, { signal: AbortSignal.timeout(6000) }).catch(() => null),
      fetch(weatherUrl, { signal: AbortSignal.timeout(6000) }).catch(() => null)
    ]);

    let marineData = null;
    let weatherData = null;

    if (marineRes && marineRes.ok) {
      marineData = await marineRes.json();
    }
    if (weatherRes && weatherRes.ok) {
      weatherData = await weatherRes.json();
    }

    const result = {
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
        status: "NO DATA"
      },
      marine: marineData?.current ? {
        waveHeightM: marineData.current.wave_height,
        waveDirectionDeg: marineData.current.wave_direction,
        wavePeriodSec: marineData.current.wave_period
      } : {
        status: "NO DATA (Inland/Ice-Bound)"
      }
    };

    weatherCache.set(cacheKey, { timestamp: now, data: result });
    return result;
  } catch (error) {
    console.error(`[Weather Service] Error fetching for ${roundedLat},${roundedLon}:`, error.message);
    return {
      latitude: roundedLat,
      longitude: roundedLon,
      source: "Open-Meteo Marine & Atmospheric API",
      error: error.message,
      status: "NO DATA / UNREACHABLE"
    };
  }
}

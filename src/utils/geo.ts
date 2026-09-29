import * as turf from '@turf/turf';
import * as SunCalc from 'suncalc';

// Format decimal degrees to maritime Degrees and Decimal Minutes: DD° MM.MM' [NSEW]
export function formatMaritimeCoord(decimal: number, isLatitude: boolean): string {
  if (decimal === undefined || decimal === null || isNaN(decimal)) {
    return 'NO FIX';
  }
  const absolute = Math.abs(decimal);
  const degrees = Math.floor(absolute);
  const minutes = (absolute - degrees) * 60;
  const cardinal = isLatitude 
    ? (decimal >= 0 ? 'N' : 'S') 
    : (decimal >= 0 ? 'E' : 'W');

  return `${degrees}° ${minutes.toFixed(2)}' ${cardinal}`;
}

export function formatCoordinatePair(lat: number, lon: number): string {
  return `${formatMaritimeCoord(lat, true)}, ${formatMaritimeCoord(lon, false)}`;
}

// Great circle distance in nautical miles and initial bearing
export function getDistanceAndBearing(
  fromLat: number,
  fromLon: number,
  toLat: number,
  toLon: number
): { distanceNm: number; bearingDeg: number } {
  try {
    const fromPt = turf.point([fromLon, fromLat]);
    const toPt = turf.point([toLon, toLat]);

    const distKm = turf.distance(fromPt, toPt, { units: 'kilometers' });
    const distNm = parseFloat((distKm / 1.852).toFixed(1));

    let bearing = turf.bearing(fromPt, toPt);
    if (bearing < 0) bearing += 360;
    const bearingDeg = Math.round(bearing);

    return { distanceNm: distNm, bearingDeg };
  } catch (e) {
    return { distanceNm: 0, bearingDeg: 0 };
  }
}

// Astronomy calculation with SunCalc
export function getAstronomicalData(date: Date, lat: number, lon: number) {
  try {
    const times = SunCalc.getTimes(date, lat, lon);
    const moon = SunCalc.getMoonIllumination(date);

    let sunRangeStr = "--:-- – --:--";

    if (isNaN(times.sunrise?.getTime()) || isNaN(times.sunset?.getTime())) {
      // Polar day or polar night at high latitudes
      const noonPos = SunCalc.getPosition(new Date(date.setHours(12, 0, 0, 0)), lat, lon);
      sunRangeStr = noonPos.altitude > 0 ? "POLAR DAY 24H" : "POLAR NIGHT 24H";
    } else {
      const formatTime = (d: Date) => {
        const h = String(d.getUTCHours()).padStart(2, '0');
        const m = String(d.getUTCMinutes()).padStart(2, '0');
        return `${h}:${m}`;
      };
      sunRangeStr = `${formatTime(times.sunrise)} – ${formatTime(times.sunset)}`;
    }

    const moonPct = Math.round(moon.fraction * 100);

    return {
      sunRangeStr,
      moonPct,
      phase: moon.phase
    };
  } catch (e) {
    return {
      sunRangeStr: "--:-- – --:--",
      moonPct: 0,
      phase: 0
    };
  }
}

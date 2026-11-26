/**
 * Amber Plains Weather Intelligence Service
 * Ports Open-Meteo integration from Axelo weatherService.js to TypeScript.
 * Zero API key required — Open-Meteo is free and open.
 * Advisory logic is deterministic rule-based; no AI hallucination risk.
 */

export interface AmberPlainsPark {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  elevationM: number;
}

export interface WeatherCurrentCondition {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  windDirection: string;
  precipMm: number;
  uvIndex: number;
  wmoCode: number;
  isDay: boolean;
  updatedAt: string;
}

export interface WeatherDailyForecast {
  date: string;
  maxTempC: number;
  minTempC: number;
  precipMm: number;
  precipProbability: number;
  wmoCode: number;
  uvIndexMax: number;
}

export type SafariAdvisoryLevel = "Ideal" | "Fair" | "Caution";
export type SafariSeason = "Peak Dry Season" | "Long Rains" | "Short Rains" | "Shoulder Season";

export interface SafariAdvisory {
  level: SafariAdvisoryLevel;
  alerts: string[];
  gameViewingRating: 1 | 2 | 3 | 4 | 5;
  fourByFourRequired: boolean;
  trackConditionNote: string;
}

export interface ParkWeatherReport {
  park: AmberPlainsPark;
  current: WeatherCurrentCondition;
  forecast: WeatherDailyForecast[];
  advisory: SafariAdvisory;
  season: SafariSeason;
  fetchedAt: string;
}

// ─── Authoritative park reference data ───────────────────────────────────────
// Coordinates are verified WGS84 for each national park headquarters/main gate.
export const AMBER_PLAINS_PARKS: AmberPlainsPark[] = [
  { id: "amboseli", name: "Amboseli NP", region: "Southern Rift", lat: -2.6527, lon: 37.2606, elevationM: 1180 },
  { id: "tsavo-east", name: "Tsavo East NP", region: "Coast Hinterland", lat: -2.5000, lon: 38.5000, elevationM: 300 },
  { id: "tsavo-west", name: "Tsavo West NP", region: "Coast Hinterland", lat: -3.3800, lon: 38.0100, elevationM: 1000 },
  { id: "maasai-mara", name: "Maasai Mara NR", region: "Mara Ecosystem", lat: -1.5000, lon: 35.1500, elevationM: 1500 },
  { id: "samburu", name: "Samburu NR", region: "Northern Frontier", lat: 0.6200, lon: 37.5300, elevationM: 870 },
  { id: "lake-nakuru", name: "Lake Nakuru NP", region: "Rift Valley", lat: -0.3600, lon: 36.0900, elevationM: 1759 },
  { id: "aberdare", name: "Aberdare NP", region: "Central Highlands", lat: -0.3000, lon: 36.6500, elevationM: 2600 },
  { id: "mount-kenya", name: "Mt Kenya NP", region: "Central Highlands", lat: -0.1521, lon: 37.3084, elevationM: 2000 },
  { id: "meru", name: "Meru NP", region: "Northern Frontier", lat: 0.1500, lon: 38.2300, elevationM: 1000 },
  { id: "nairobi", name: "Nairobi NP", region: "Nairobi Metro", lat: -1.3500, lon: 36.8167, elevationM: 1670 },
];

// ─── Open-Meteo WMO weather code label map ───────────────────────────────────
const WMO_LABELS: Record<number, string> = {
  0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Foggy", 48: "Icy fog",
  51: "Light drizzle", 53: "Moderate drizzle", 55: "Dense drizzle",
  61: "Slight rain", 63: "Moderate rain", 65: "Heavy rain",
  71: "Slight snow", 73: "Moderate snow", 75: "Heavy snow",
  77: "Snow grains",
  80: "Slight showers", 81: "Moderate showers", 82: "Violent showers",
  85: "Slight snow showers", 86: "Heavy snow showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm + heavy hail",
};

export function getWeatherLabel(wmoCode: number): string {
  return WMO_LABELS[wmoCode] ?? "Unknown conditions";
}

/** Map WMO code to a simple emoji for compact displays */
export function wmoToIcon(wmoCode: number): string {
  if (wmoCode === 0 || wmoCode === 1) return "☀️";
  if (wmoCode === 2 || wmoCode === 3) return "⛅";
  if (wmoCode >= 45 && wmoCode <= 48) return "🌫️";
  if (wmoCode >= 51 && wmoCode <= 55) return "🌦️";
  if (wmoCode >= 61 && wmoCode <= 65) return "🌧️";
  if (wmoCode >= 71 && wmoCode <= 77) return "❄️";
  if (wmoCode >= 80 && wmoCode <= 82) return "🌧️";
  if (wmoCode >= 95) return "⛈️";
  return "🌤️";
}

/** Determine the prevailing Kenyan safari season by calendar month (1-based). */
export function getSafariSeason(month: number): SafariSeason {
  if (month >= 7 && month <= 10) return "Peak Dry Season";   // Jul–Oct: Great Migration
  if (month >= 3 && month <= 5) return "Long Rains";        // Mar–May: Green season
  if (month >= 10 && month <= 12) return "Short Rains";      // Oct–Dec
  return "Shoulder Season";                                   // Jan–Feb, Jun
}

/** Wind degrees to compass bearing string */
function degreesToCompass(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

// ─── Deterministic safari advisory generator ─────────────────────────────────
export function generateSafariAdvisory(
  current: WeatherCurrentCondition,
  forecast: WeatherDailyForecast[],
  park: AmberPlainsPark
): SafariAdvisory {
  const alerts: string[] = [];
  let level: SafariAdvisoryLevel = "Ideal";
  let gameViewingRating: 1 | 2 | 3 | 4 | 5 = 5;
  let fourByFourRequired = false;
  let trackConditionNote = "Tracks dry and passable in standard 4x4.";

  // High wind
  if (current.windKph > 50) {
    alerts.push(`High winds ${current.windKph.toFixed(0)} km/h — balloon safaris suspended.`);
    level = "Caution";
    gameViewingRating = Math.max(1, gameViewingRating - 2) as typeof gameViewingRating;
  } else if (current.windKph > 35) {
    alerts.push(`Elevated winds ${current.windKph.toFixed(0)} km/h — wildlife may be sheltering.`);
    if (level === "Ideal") level = "Fair";
    gameViewingRating = Math.max(2, gameViewingRating - 1) as typeof gameViewingRating;
  }

  // Rain / heavy precipitation
  if (current.precipMm > 10) {
    alerts.push(`Heavy rain ${current.precipMm.toFixed(1)} mm — river crossings may be hazardous.`);
    level = "Caution";
    fourByFourRequired = true;
    trackConditionNote = "Tracks waterlogged — diff-lock and low range required. Lead vehicle advisory.";
    gameViewingRating = Math.max(2, gameViewingRating - 2) as typeof gameViewingRating;
  } else if (current.precipMm > 3) {
    alerts.push(`Rain ${current.precipMm.toFixed(1)} mm — murram tracks becoming slippery.`);
    if (level === "Ideal") level = "Fair";
    fourByFourRequired = true;
    trackConditionNote = "Tracks soft — 4x4 engaged throughout. Sand ladders and tow rope recommended.";
    gameViewingRating = Math.max(3, gameViewingRating - 1) as typeof gameViewingRating;
  }

  // High UV
  if (current.uvIndex >= 11) {
    alerts.push(`Extreme UV index ${current.uvIndex} — mandatory hats, sunscreen SPF50+ and eye protection for guides and guests.`);
  } else if (current.uvIndex >= 8) {
    alerts.push(`Very high UV index ${current.uvIndex} — recommend protective clothing for open-vehicle drives.`);
  }

  // Fog (common in high-elevation parks: Aberdare, Mt Kenya)
  if (current.wmoCode === 45 || current.wmoCode === 48) {
    alerts.push(`Foggy conditions — visibility reduced. Convoy driving and reduced speed zones apply.`);
    if (park.elevationM > 1800) {
      alerts.push(`Elevated park (${park.elevationM}m) — fog may persist until late morning.`);
    }
    if (level === "Ideal") level = "Fair";
    gameViewingRating = Math.max(2, gameViewingRating - 1) as typeof gameViewingRating;
  }

  // Thunderstorm
  if (current.wmoCode >= 95) {
    alerts.push(`Active thunderstorm — all open-vehicle game drives suspended. Guest safety protocol active.`);
    level = "Caution";
    gameViewingRating = 1;
    fourByFourRequired = true;
    trackConditionNote = "All tracks closed during active lightning. Guides await all-clear from KWS.";
  }

  // Extreme heat (coastal parks: Tsavo East/West)
  if (current.tempC > 38) {
    alerts.push(`Extreme heat ${current.tempC.toFixed(0)}°C — game drives limited to 06:30–09:30 and 16:00–18:30. Midday rest mandatory.`);
    if (level === "Ideal") level = "Fair";
    gameViewingRating = Math.max(3, gameViewingRating - 1) as typeof gameViewingRating;
  }

  // 3-day rainfall forecast lookout
  const next3Days = forecast.slice(0, 3);
  const heavyRainDays = next3Days.filter(d => d.precipMm > 15).length;
  if (heavyRainDays >= 2) {
    alerts.push(`Forecast: heavy rain expected on ${heavyRainDays} of the next 3 days — brief operations team on contingency routing.`);
  }

  if (alerts.length === 0) {
    alerts.push("All conditions nominal — excellent safari conditions.");
  }

  return { level, alerts, gameViewingRating, fourByFourRequired, trackConditionNote };
}

// ─── Open-Meteo fetch ─────────────────────────────────────────────────────────
const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    apparent_temperature?: number;
    relative_humidity_2m?: number;
    wind_speed_10m?: number;
    wind_direction_10m?: number;
    precipitation?: number;
    uv_index?: number;
    weather_code?: number;
    is_day?: number;
    time?: string;
  };
  daily?: {
    time?: string[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
    precipitation_sum?: number[];
    precipitation_probability_max?: number[];
    weather_code?: number[];
    uv_index_max?: number[];
  };
}

/** Fetch current conditions and 7-day forecast for a single park. */
export async function fetchParkWeather(park: AmberPlainsPark): Promise<ParkWeatherReport> {
  const params = new URLSearchParams({
    latitude: park.lat.toString(),
    longitude: park.lon.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "precipitation",
      "uv_index",
      "weather_code",
      "is_day",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "precipitation_probability_max",
      "weather_code",
      "uv_index_max",
    ].join(","),
    wind_speed_unit: "kmh",
    timezone: "Africa/Nairobi",
    forecast_days: "7",
  });

  const url = `${OPEN_METEO_BASE}?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 10800 } }); // 3h cache

  if (!res.ok) {
    throw new Error(
      `Open-Meteo fetch failed for ${park.name}: HTTP ${res.status} ${res.statusText}`
    );
  }

  const data = (await res.json()) as OpenMeteoResponse;

  const c = data.current ?? {};
  const d = data.daily ?? {};

  const current: WeatherCurrentCondition = {
    tempC: Number(c.temperature_2m ?? 0),
    feelsLikeC: Number(c.apparent_temperature ?? 0),
    humidity: Math.round(Number(c.relative_humidity_2m ?? 0)),
    windKph: Number(c.wind_speed_10m ?? 0),
    windDirection: degreesToCompass(Number(c.wind_direction_10m ?? 0)),
    precipMm: Number(c.precipitation ?? 0),
    uvIndex: Number(c.uv_index ?? 0),
    wmoCode: Math.round(Number(c.weather_code ?? 0)),
    isDay: c.is_day === 1,
    updatedAt: c.time ?? new Date().toISOString(),
  };

  const forecast: WeatherDailyForecast[] = (d.time ?? []).map(
    (date: string, i: number) => ({
      date,
      maxTempC: Number(d.temperature_2m_max?.[i] ?? 0),
      minTempC: Number(d.temperature_2m_min?.[i] ?? 0),
      precipMm: Number(d.precipitation_sum?.[i] ?? 0),
      precipProbability: Math.round(Number(d.precipitation_probability_max?.[i] ?? 0)),
      wmoCode: Math.round(Number(d.weather_code?.[i] ?? 0)),
      uvIndexMax: Number(d.uv_index_max?.[i] ?? 0),
    })
  );

  const month = new Date().getMonth() + 1;
  const season = getSafariSeason(month);
  const advisory = generateSafariAdvisory(current, forecast, park);

  return {
    park,
    current,
    forecast,
    advisory,
    season,
    fetchedAt: new Date().toISOString(),
  };
}

/** Fetch weather for all 10 parks concurrently with individual error tolerance. */
export async function fetchAllParksWeather(): Promise<ParkWeatherReport[]> {
  const results = await Promise.allSettled(
    AMBER_PLAINS_PARKS.map(park => fetchParkWeather(park))
  );

  return results
    .filter((r): r is PromiseFulfilledResult<ParkWeatherReport> => r.status === "fulfilled")
    .map(r => r.value);
}

import type { WeatherData, LocationData } from "../types/RenderContext.ts";
import { cache } from "./cache.ts";

const WMO_CODES: Record<number, string> = {
  0: "Clear",
  1: "Mostly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  61: "Light Rain",
  63: "Rain",
  65: "Heavy Rain",
  71: "Light Snow",
  73: "Snow",
  75: "Heavy Snow",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  95: "Thunderstorm",
  96: "Hail Storm",
  99: "Heavy Hail",
};

/**
 * Fetch current weather from Open-Meteo (free, no key required).
 * Requires location data to be available in the cache.
 */
export async function fetchWeather(): Promise<WeatherData | null> {
  try {
    // Try to get cached location first
    const loc = await cache.get<LocationData | null>({
      key: "location",
      ttlSeconds: 3600,
      fetch: async () => null,
    });
    if (!loc) return null;

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,weather_code`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;

    const json = (await res.json()) as {
      current?: { temperature_2m?: number; weather_code?: number };
    };
    const current = json.current;
    if (!current || current.temperature_2m == null) return null;

    const condition = WMO_CODES[current.weather_code ?? 0] ?? "Unknown";
    return {
      temperature: current.temperature_2m,
      condition,
    };
  } catch {
    return null;
  }
}

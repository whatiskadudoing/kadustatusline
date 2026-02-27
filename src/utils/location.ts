import type { LocationData } from "../types/RenderContext.ts";

/**
 * Fetch location data from ip-api.com (free, no key required).
 * Returns null on failure.
 */
export async function fetchLocation(): Promise<LocationData | null> {
  try {
    const res = await fetch("http://ip-api.com/json/?fields=city,regionName,lat,lon", {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as Record<string, unknown>;
    const city = json.city as string | undefined;
    const state = json.regionName as string | undefined;
    const lat = json.lat as number | undefined;
    const lon = json.lon as number | undefined;
    if (!city || lat == null || lon == null) return null;
    return { city, state: state ?? "", lat, lon };
  } catch {
    return null;
  }
}

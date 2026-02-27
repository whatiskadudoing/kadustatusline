import type { StatusData } from "../types/StatusData.ts";
import type { Settings } from "../types/Settings.ts";
import type {
  RenderContext,
  GitData,
  LocationData,
  WeatherData,
  UsageData,
  PrData,
} from "../types/RenderContext.ts";
import { cache } from "./cache.ts";
import { getGitData } from "./git.ts";
import { fetchLocation } from "./location.ts";
import { fetchWeather } from "./weather.ts";
import { fetchUsage } from "./usage.ts";
import { fetchPrs } from "./pr.ts";

/**
 * Run all data-fetching tasks in parallel and return the parts of
 * RenderContext that come from external sources (git, location, weather, etc.).
 *
 * Each fetcher is wrapped in the FileCache with the TTL from settings.
 * Failures are silently swallowed so the statusline always renders.
 */
export async function prefetchAll(
  _data: StatusData,
  settings: Settings,
): Promise<Partial<RenderContext>> {
  const results = await Promise.allSettled([
    // Git data
    cache.get<GitData>({
      key: "git",
      ttlSeconds: settings.cacheTTL.git,
      fetch: () => getGitData(),
    }),

    // Location data via ip-api.com
    cache.get<LocationData | null>({
      key: "location",
      ttlSeconds: settings.cacheTTL.location,
      fetch: () => fetchLocation(),
    }),

    // Weather data via open-meteo.com (needs location first, so may be null)
    cache.get<WeatherData | null>({
      key: "weather",
      ttlSeconds: settings.cacheTTL.weather,
      fetch: () => fetchWeather(),
    }),

    // API usage data via Anthropic OAuth
    cache.get<UsageData | null>({
      key: "usage",
      ttlSeconds: settings.cacheTTL.usage,
      fetch: () => fetchUsage(),
    }),

    // PR data via gh CLI
    cache.get<PrData[] | null>({
      key: "pr",
      ttlSeconds: settings.cacheTTL.pr,
      fetch: () => fetchPrs(),
    }),
  ]);

  const partial: Partial<RenderContext> = {};

  if (results[0]?.status === "fulfilled" && results[0].value) {
    partial.gitData = results[0].value;
  }
  if (results[1]?.status === "fulfilled" && results[1].value) {
    partial.locationData = results[1].value;
  }
  if (results[2]?.status === "fulfilled" && results[2].value) {
    partial.weatherData = results[2].value;
  }
  if (results[3]?.status === "fulfilled" && results[3].value) {
    partial.usageData = results[3].value;
  }
  if (results[4]?.status === "fulfilled" && results[4].value) {
    partial.prData = results[4].value;
  }

  return partial;
}

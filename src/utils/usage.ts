import type { UsageData } from "../types/RenderContext.ts";
import { getAnthropicOAuthToken } from "./keychain.ts";

/**
 * Fetch API usage data from the Anthropic rate-limit API.
 * Requires a valid OAuth token from the macOS keychain.
 */
export async function fetchUsage(): Promise<UsageData | null> {
  try {
    const token = await getAnthropicOAuthToken();
    if (!token) return null;

    const res = await fetch("https://api.anthropic.com/v1/organizations/usage", {
      headers: {
        Authorization: `Bearer ${token}`,
        "anthropic-version": "2023-06-01",
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) return null;

    const json = (await res.json()) as {
      rate_limits?: Array<{
        type?: string;
        utilization?: number;
        resets_at?: string;
      }>;
    };

    if (!json.rate_limits) return null;

    const fiveHour = json.rate_limits.find((r) => r.type === "five_hour");
    const sevenDay = json.rate_limits.find((r) => r.type === "seven_day");

    if (!fiveHour || !sevenDay) return null;

    return {
      fiveHour: {
        utilization: (fiveHour.utilization ?? 0) * 100,
        resetsAt: fiveHour.resets_at ?? "",
      },
      sevenDay: {
        utilization: (sevenDay.utilization ?? 0) * 100,
        resetsAt: sevenDay.resets_at ?? "",
      },
    };
  } catch {
    return null;
  }
}

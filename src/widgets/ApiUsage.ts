import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

function usageColor(pct: number): string {
  if (pct >= 80) return "#fb7185";
  if (pct >= 60) return "#fb9238";
  if (pct >= 40) return "#fbbf24";
  return "#4ade80";
}

function formatResetTime(isoStr: string, timezone: string): string {
  try {
    const dt = new Date(isoStr);
    return dt.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  } catch {
    return "—";
  }
}

function formatResetTimeWeekly(isoStr: string, timezone: string): string {
  try {
    const dt = new Date(isoStr);
    const day = dt.toLocaleDateString("en-US", { timeZone: timezone, weekday: "short" });
    const time = dt.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    return `${day} ${time}`;
  } catch {
    return "—";
  }
}

export const ApiUsageWidget: Widget = {
  name: "api-usage",
  displayName: "API Usage",
  description: "5-hour and 7-day rate limit percentages with reset clocks",
  category: "usage",

  render(_item: WidgetItem, ctx: RenderContext, settings: Settings): WidgetOutput | null {
    const usage = ctx.usageData;
    if (!usage) return null;

    const tz = settings.timezone;
    const h5 = Math.round(usage.fiveHour.utilization);
    const d7 = Math.round(usage.sevenDay.utilization);
    const h5Reset = formatResetTime(usage.fiveHour.resetsAt, tz);
    const d7Reset = formatResetTimeWeekly(usage.sevenDay.resetsAt, tz);

    const segments: ColorSegment[] = [];
    const sepColor = "#475569";

    segments.push({ text: "▰ ", fg: "#fbbf24" });

    if (ctx.displayMode === "nano") {
      segments.push({ text: `${h5}%`, fg: usageColor(h5) });
      segments.push({ text: `↻${h5Reset} `, fg: "#94a3b8" });
      segments.push({ text: `${d7}%`, fg: usageColor(d7) });
      segments.push({ text: "/wk", fg: "#94a3b8" });
    } else if (ctx.displayMode === "micro") {
      segments.push({ text: "5H: ", fg: "#94a3b8" });
      segments.push({ text: `${h5}%`, fg: usageColor(h5) });
      segments.push({ text: ` ↻${h5Reset}`, fg: "#94a3b8" });
      segments.push({ text: " │ ", fg: sepColor, dim: true });
      segments.push({ text: "WK: ", fg: "#94a3b8" });
      segments.push({ text: `${d7}%`, fg: usageColor(d7) });
      segments.push({ text: ` ↻${d7Reset}`, fg: "#94a3b8" });
    } else {
      segments.push({ text: "USAGE: ", fg: "#d9a31d", bold: true });
      segments.push({ text: "5H: ", fg: "#94a3b8" });
      segments.push({ text: `${h5}%`, fg: usageColor(h5) });
      segments.push({ text: ` ↻`, fg: "#94a3b8" });
      segments.push({ text: h5Reset, fg: "#64748b" });
      segments.push({ text: " │ ", fg: sepColor, dim: true });
      segments.push({ text: "WK: ", fg: "#94a3b8" });
      segments.push({ text: `${d7}%`, fg: usageColor(d7) });
      segments.push({ text: ` ↻`, fg: "#94a3b8" });
      segments.push({ text: d7Reset, fg: "#64748b" });
    }

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#fbbf24";
  },
};

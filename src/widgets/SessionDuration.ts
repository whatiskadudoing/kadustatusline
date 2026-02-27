import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export function formatDuration(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const hours = Math.floor(sec / 3600);
  const mins = Math.floor((sec % 3600) / 60);
  const secs = sec % 60;

  if (hours > 0) return `${hours}h${mins}m`;
  if (mins > 0) return `${mins}m${String(secs).padStart(2, "0")}s`;
  return `${secs}s`;
}

export const SessionDurationWidget: Widget = {
  name: "session-duration",
  displayName: "Session Duration",
  description: "Elapsed time for the current session",
  category: "session",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const durationMs = ctx.data.cost?.total_duration_ms;
    if (durationMs == null) return null;

    const formatted = formatDuration(durationMs);
    return {
      text: `Session: ${formatted}`,
      segments: [
        { text: "Session: ", dim: true },
        { text: formatted, fg: "#eab308" },
      ],
    };
  },

  getDefaultColor() {
    return "#eab308";
  },
};

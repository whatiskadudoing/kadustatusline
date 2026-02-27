import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

const BLOCK_DURATION_MS = 5 * 60 * 60 * 1000; // 5 hours

export const BlockTimerWidget: Widget = {
  name: "block-timer",
  displayName: "Block Timer",
  description: "5-hour usage block progress",
  category: "usage",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const durationMs = ctx.data.cost?.total_duration_ms;
    if (durationMs == null) return null;

    // Calculate position within current 5h block
    const blockElapsed = durationMs % BLOCK_DURATION_MS;
    const pct = Math.round((blockElapsed / BLOCK_DURATION_MS) * 100);

    const elapsedMin = Math.floor(blockElapsed / 60000);
    const hours = Math.floor(elapsedMin / 60);
    const mins = elapsedMin % 60;
    const timeStr = hours > 0 ? `${hours}h${mins}m` : `${mins}m`;

    const segments: ColorSegment[] = [];

    // Simple progress bar (10 chars)
    const barLen = 10;
    const filled = Math.round((pct * barLen) / 100);
    let bar = "";
    for (let i = 0; i < barLen; i++) {
      bar += i < filled ? "█" : "░";
    }

    const color = pct >= 80 ? "#fb7185" : pct >= 60 ? "#fbbf24" : "#4ade80";

    segments.push({ text: `BLK ${bar} ${timeStr}`, fg: color });

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

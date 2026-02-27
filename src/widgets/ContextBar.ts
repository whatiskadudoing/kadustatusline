import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

const BUCKET_CHAR = "⛁";

/** Interpolate RGB between two colors based on position in bar */
function bucketColor(pos: number, max: number): string {
  const pct = (pos / max) * 100;
  let r: number, g: number, b: number;

  if (pct <= 33) {
    const t = pct / 33;
    r = Math.round(74 + (250 - 74) * t);
    g = Math.round(222 + (204 - 222) * t);
    b = Math.round(128 + (21 - 128) * t);
  } else if (pct <= 66) {
    const t = (pct - 33) / 33;
    r = Math.round(250 + (251 - 250) * t);
    g = Math.round(204 + (146 - 204) * t);
    b = Math.round(21 + (60 - 21) * t);
  } else {
    const t = (pct - 66) / 34;
    r = Math.round(251 + (239 - 251) * t);
    g = Math.round(146 + (68 - 146) * t);
    b = Math.round(60 + (68 - 60) * t);
  }

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function percentageColor(pct: number): string {
  if (pct >= 80) return "#fb7185"; // rose
  if (pct >= 60) return "#fb9238"; // orange
  if (pct >= 40) return "#fbbf24"; // amber
  return "#4ade80"; // emerald
}

function barWidth(mode: string): number {
  switch (mode) {
    case "nano": return 10;
    case "micro": return 15;
    case "mini": return 25;
    default: return 55;
  }
}

export const ContextBarWidget: Widget = {
  name: "context-bar",
  displayName: "Context Bar",
  description: "Gradient progress bar showing context window usage",
  category: "context",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const cw = ctx.data.context_window;
    if (!cw) return null;

    const pct = Math.round(cw.used_percentage ?? 0);
    const width = barWidth(ctx.displayMode);
    const filled = Math.round((pct * width) / 100);

    const segments: ColorSegment[] = [];

    // Icon + label for mini/normal
    if (ctx.displayMode === "mini" || ctx.displayMode === "normal") {
      segments.push({ text: "◉ ", fg: "#818cf8" });
      segments.push({ text: "CONTEXT: ", fg: "#a5b4fc", bold: true });
    } else {
      segments.push({ text: "◉ ", fg: "#818cf8" });
    }

    // Filled buckets with gradient
    for (let i = 0; i < width; i++) {
      if (i < filled) {
        segments.push({ text: BUCKET_CHAR, fg: bucketColor(i, width) });
      } else {
        segments.push({ text: BUCKET_CHAR, fg: "#4b5263", dim: true });
      }
    }

    // Percentage
    segments.push({ text: ` ${pct}%`, fg: percentageColor(pct) });

    const text = segments.map((s) => s.text).join("");
    return { text, segments };
  },

  getDefaultColor() {
    return "#818cf8";
  },
};

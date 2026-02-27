import { freemem, totalmem } from "node:os";
import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const MemoryUsageWidget: Widget = {
  name: "memory-usage",
  displayName: "Memory Usage",
  description: "System memory usage percentage",
  category: "system",

  render(_item: WidgetItem, _ctx: RenderContext, _settings: Settings): WidgetOutput {
    const total = totalmem();
    const free = freemem();
    const used = total - free;
    const pct = Math.round((used / total) * 100);
    const text = `RAM:${pct}%`;

    return {
      text,
      segments: [{ text, fg: pct >= 90 ? "#fb7185" : pct >= 70 ? "#fbbf24" : "#4ade80" }],
    };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

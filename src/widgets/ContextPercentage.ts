import type { Widget, WidgetOutput, WidgetItem } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const ContextPercentageWidget: Widget = {
  name: "context-percentage",
  displayName: "Context %",
  description: "Shows context window usage percentage",
  category: "context",

  render(item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const pct = ctx.data.context_window?.used_percentage;
    if (pct == null) return null;
    const color = pct > 80 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e";
    return {
      text: `Ctx: ${pct}%`,
      segments: [
        { text: "Ctx: ", fg: "#60a5fa" },
        { text: `${pct}%`, fg: color, bold: pct > 80 },
      ],
    };
  },

  getDefaultColor(): string {
    return "#3b82f6";
  },
};

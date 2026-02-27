import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const SessionCostWidget: Widget = {
  name: "session-cost",
  displayName: "Session Cost",
  description: "Dollar cost for the current session",
  category: "session",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const cost = ctx.data.cost?.total_cost_usd;
    if (cost == null) return null;

    const formatted = `$${cost.toFixed(2)}`;
    return {
      text: formatted,
      segments: [{ text: formatted }],
    };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

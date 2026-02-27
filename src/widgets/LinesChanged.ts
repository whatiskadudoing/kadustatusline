import type { Widget, WidgetOutput, WidgetItem } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const LinesChangedWidget: Widget = {
  name: "lines-changed",
  displayName: "Lines Changed",
  description: "Shows lines added and removed in the session",
  category: "session",

  render(item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const added = ctx.data.cost?.total_lines_added;
    const removed = ctx.data.cost?.total_lines_removed;
    if (added == null && removed == null) return null;
    const a = added ?? 0;
    const r = removed ?? 0;
    return {
      text: `(+${a},-${r})`,
      segments: [
        { text: "(", dim: true },
        { text: `+${a}`, fg: "#22c55e" },
        { text: ",", dim: true },
        { text: `-${r}`, fg: "#ef4444" },
        { text: ")", dim: true },
      ],
    };
  },

  getDefaultColor(): string {
    return "#94a3b8";
  },
};

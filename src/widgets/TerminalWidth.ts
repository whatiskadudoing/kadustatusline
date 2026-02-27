import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const TerminalWidthWidget: Widget = {
  name: "terminal-width",
  displayName: "Terminal Width",
  description: "Current terminal columns",
  category: "system",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput {
    const text = `${ctx.terminalWidth}cols`;
    return {
      text,
      segments: [{ text }],
    };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

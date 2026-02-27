import type { Widget, WidgetOutput, WidgetItem } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const OutputStyleWidget: Widget = {
  name: "output-style",
  displayName: "Output Style",
  description: "Shows the current output style",
  category: "session",

  render(item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const data = ctx.data as any;
    const style = data.output_style?.name;
    if (!style) return null;
    return {
      text: `Style: ${style}`,
      segments: [
        { text: "Style: ", dim: true },
        { text: style },
      ],
    };
  },

  getDefaultColor(): string {
    return "#94a3b8";
  },
};

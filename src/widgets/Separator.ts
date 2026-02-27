import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const SeparatorWidget: Widget = {
  name: "separator",
  displayName: "Separator",
  description: "Visual divider between widgets",
  category: "display",

  render(_item: WidgetItem, _ctx: RenderContext, settings: Settings): WidgetOutput {
    const char = settings.separator.character;
    return {
      text: ` ${char} `,
      segments: [{ text: ` ${char} `, fg: settings.separator.color, dim: true }],
    };
  },

  getDefaultColor() {
    return "#475569";
  },
};

import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const CustomTextWidget: Widget = {
  name: "custom-text",
  displayName: "Custom Text",
  description: "User-defined static text",
  category: "custom",

  render(item: WidgetItem, _ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const text = item.customText;
    if (!text) return null;

    return {
      text,
      segments: [{ text }],
    };
  },

  getDefaultColor() {
    return "#cbd5e1";
  },
};

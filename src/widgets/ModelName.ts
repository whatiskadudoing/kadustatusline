import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const ModelNameWidget: Widget = {
  name: "model-name",
  displayName: "Model Name",
  description: "Current AI model (e.g., Opus, Sonnet)",
  category: "session",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const model = ctx.data.model;
    if (!model) return null;

    const name = typeof model === "string" ? model : model.display_name ?? model.id ?? "unknown";

    return {
      text: name,
      segments: [{ text: name, bold: true }],
    };
  },

  getDefaultColor() {
    return "#cbd5e1";
  },
};

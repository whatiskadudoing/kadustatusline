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

    let name: string;
    let version = "";
    if (typeof model === "string") {
      name = model;
    } else {
      name = model.display_name ?? model.id ?? "unknown";
      // Extract version from id like "claude-opus-4-6" → "4.6"
      if (model.id) {
        const match = model.id.match(/(\d+)-(\d+)$/);
        if (match) version = ` ${match[1]}.${match[2]}`;
      }
    }

    return {
      text: `Model: ${name}${version}`,
      segments: [
        { text: "Model: ", fg: "#06b6d4", dim: false },
        { text: `${name}${version}`, fg: "#06b6d4", bold: true },
      ],
    };
  },

  getDefaultColor() {
    return "#06b6d4";
  },
};

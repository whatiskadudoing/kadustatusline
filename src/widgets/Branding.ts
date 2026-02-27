import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const BrandingWidget: Widget = {
  name: "branding",
  displayName: "Branding",
  description: "Header with project name and separator lines",
  category: "branding",

  render(_item: WidgetItem, ctx: RenderContext, settings: Settings): WidgetOutput {
    const name = settings.brandingName;
    const colors = settings.brandingColors;
    const segments: ColorSegment[] = [];
    const sepColor = settings.lineSeparator.color;

    if (ctx.displayMode === "nano") {
      segments.push({ text: "── │ ", fg: sepColor });
      // Color each letter of the name
      for (let i = 0; i < name.length; i++) {
        const colorIdx = Math.min(i, colors.length - 1);
        segments.push({ text: name[i]!, fg: colors[colorIdx] });
      }
      segments.push({ text: " │ ────────────", fg: sepColor });
    } else {
      segments.push({ text: "── │ ", fg: sepColor });
      for (let i = 0; i < name.length; i++) {
        const colorIdx = Math.min(i, colors.length - 1);
        segments.push({ text: name[i]!, fg: colors[colorIdx] });
      }

      if (ctx.displayMode !== "micro") {
        segments.push({ text: " STATUSLINE", fg: colors[1] ?? colors[0] ?? "#3b82f6" });
      }

      // Fill remaining width with dashes
      const textLen = name.length + (ctx.displayMode !== "micro" ? " STATUSLINE".length : 0);
      const dashCount = Math.max(4, 72 - textLen - 8);
      segments.push({ text: ` │ ${"─".repeat(dashCount)}`, fg: sepColor });
    }

    const text = segments.map((s) => s.text).join("");
    return { text, segments };
  },

  getDefaultColor() {
    return "#3b82f6";
  },
};

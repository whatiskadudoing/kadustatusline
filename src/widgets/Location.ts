import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const LocationWidget: Widget = {
  name: "location",
  displayName: "Location",
  description: "City and state from IP geolocation",
  category: "branding",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const loc = ctx.locationData;
    if (!loc) return null;
    if (ctx.displayMode === "nano") return null;

    const segments: ColorSegment[] = [];
    segments.push({ text: "LOC: ", fg: "#64748b" });
    segments.push({ text: loc.city, fg: "#93c5fd" });

    if (ctx.displayMode !== "micro") {
      segments.push({ text: ", ", fg: "#475569" });
      segments.push({ text: loc.state, fg: "#64748b" });
    }

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#93c5fd";
  },
};

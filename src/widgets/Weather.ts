import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const WeatherWidget: Widget = {
  name: "weather",
  displayName: "Weather",
  description: "Temperature and condition",
  category: "branding",

  render(_item: WidgetItem, ctx: RenderContext, settings: Settings): WidgetOutput | null {
    const w = ctx.weatherData;
    if (!w) return null;
    if (ctx.displayMode === "nano") return null;

    const unit = settings.temperatureUnit === "fahrenheit" ? "°F" : "°C";
    const temp = settings.temperatureUnit === "fahrenheit"
      ? Math.round(w.temperature * 9 / 5 + 32)
      : Math.round(w.temperature * 10) / 10;

    const text = `${temp}${unit} ${w.condition}`;
    const segments: ColorSegment[] = [{ text, fg: "#87ceeb" }];

    return { text, segments };
  },

  getDefaultColor() {
    return "#87ceeb";
  },
};

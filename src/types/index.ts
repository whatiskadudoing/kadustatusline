// ---------------------------------------------------------------------------
// Barrel re-exports for src/types
// ---------------------------------------------------------------------------

// StatusData
export { StatusDataSchema } from "./StatusData.ts";
export type { StatusData } from "./StatusData.ts";

// DisplayMode
export { getDisplayMode } from "./DisplayMode.ts";
export type { DisplayMode } from "./DisplayMode.ts";

// Widget
export { WidgetItemSchema } from "./Widget.ts";
export type {
  ColorSegment,
  WidgetOutput,
  WidgetCategory,
  Widget,
  WidgetItem,
} from "./Widget.ts";

// RenderContext
export type {
  GitData,
  LocationData,
  WeatherData,
  UsageData,
  PrData,
  RenderContext,
} from "./RenderContext.ts";

// Settings
export { SettingsSchema, DEFAULT_SETTINGS } from "./Settings.ts";
export type { Settings } from "./Settings.ts";

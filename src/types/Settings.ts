import { z } from "zod";
import { WidgetItemSchema } from "./Widget.ts";

// ---------------------------------------------------------------------------
// Settings Zod schema — validated config with sensible defaults
// ---------------------------------------------------------------------------

export const SettingsSchema = z.object({
  version: z.number().default(1),

  colorLevel: z
    .enum(["none", "basic", "256", "truecolor"])
    .default("truecolor"),

  brandingName: z.string().default("KADU"),
  brandingColors: z
    .array(z.string())
    .default(["#1e3a8a", "#3b82f6", "#93c5fd"]),

  timezone: z.string().default("America/Sao_Paulo"),
  temperatureUnit: z.enum(["celsius", "fahrenheit"]).default("celsius"),

  cacheTTL: z
    .object({
      git: z.number().default(5),
      pr: z.number().default(30),
      location: z.number().default(3600),
      weather: z.number().default(900),
      usage: z.number().default(60),
    })
    .default({ git: 5, pr: 30, location: 3600, weather: 900, usage: 60 }),

  separator: z
    .object({
      character: z.string().default("\u2502"),
      color: z.string().default("#475569"),
    })
    .default({ character: "\u2502", color: "#475569" }),

  lineSeparator: z
    .object({
      enabled: z.boolean().default(true),
      character: z.string().default("\u2500"),
      width: z.number().default(72),
      color: z.string().default("#475569"),
    })
    .default({ enabled: true, character: "\u2500", width: 72, color: "#475569" }),

  lines: z.array(z.array(WidgetItemSchema)).default([
    // Line 0 — branding + location + weather
    [
      { id: "branding", type: "branding" },
      { id: "sep-0a", type: "separator" },
      { id: "location", type: "location" },
      { id: "sep-0b", type: "separator" },
      { id: "weather", type: "weather" },
    ],
    // Line 1 — context bar + tokens + model
    [
      { id: "context-bar", type: "context-bar" },
      { id: "sep-1a", type: "separator" },
      { id: "token-breakdown", type: "token-breakdown" },
      { id: "sep-1b", type: "separator" },
      { id: "model-name", type: "model-name" },
    ],
    // Line 2 — usage / cost / duration / block timer
    [
      { id: "api-usage", type: "api-usage" },
      { id: "sep-2a", type: "separator" },
      { id: "session-cost", type: "session-cost" },
      { id: "sep-2b", type: "separator" },
      { id: "session-duration", type: "session-duration" },
      { id: "sep-2c", type: "separator" },
      { id: "block-timer", type: "block-timer" },
    ],
    // Line 3 — git + PR
    [
      { id: "git-status", type: "git-status" },
      { id: "sep-3a", type: "separator" },
      { id: "pr-dashboard", type: "pr-dashboard" },
    ],
    // Line 4 — system info
    [
      { id: "terminal-width", type: "terminal-width" },
      { id: "sep-4a", type: "separator" },
      { id: "memory-usage", type: "memory-usage" },
    ],
  ]),
});

/** Inferred TypeScript type from the Zod schema. */
export type Settings = z.infer<typeof SettingsSchema>;

/**
 * The default settings object — parse an empty object through the schema so
 * every `.default()` kicks in.
 */
export const DEFAULT_SETTINGS: Settings = SettingsSchema.parse({});

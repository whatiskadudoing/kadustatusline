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
      character: z.string().default("|"),
      color: z.string().default("#475569"),
    })
    .default({ character: "|", color: "#475569" }),

  lineSeparator: z
    .object({
      enabled: z.boolean().default(false),
      character: z.string().default("\u2500"),
      width: z.number().default(72),
      color: z.string().default("#475569"),
    })
    .default({ enabled: false, character: "\u2500", width: 72, color: "#475569" }),

  lines: z.array(z.array(WidgetItemSchema)).default([
    // Line 1 — model, context %, cost, session, lines changed
    [
      { id: "model-name", type: "model-name" },
      { id: "sep-1a", type: "separator" },
      { id: "context-pct", type: "context-percentage" },
      { id: "sep-1b", type: "separator" },
      { id: "session-cost", type: "session-cost" },
      { id: "sep-1c", type: "separator" },
      { id: "session-duration", type: "session-duration" },
      { id: "sep-1d", type: "separator" },
      { id: "lines-changed", type: "lines-changed" },
    ],
    // Line 2 — tokens (In | Out | Cached | Total), style, version, vim
    [
      { id: "token-breakdown", type: "token-breakdown" },
      { id: "sep-2a", type: "separator" },
      { id: "output-style", type: "output-style" },
      { id: "sep-2b", type: "separator" },
      { id: "version", type: "version" },
      { id: "sep-2c", type: "separator" },
      { id: "vim-mode", type: "vim-mode" },
    ],
    // Line 3 — context bar, API usage, block timer
    [
      { id: "context-bar", type: "context-bar" },
      { id: "sep-3a", type: "separator" },
      { id: "api-usage", type: "api-usage" },
      { id: "sep-3b", type: "separator" },
      { id: "block-timer", type: "block-timer" },
    ],
    // Line 4 — git status, PR dashboard
    [
      { id: "git-status", type: "git-status" },
      { id: "sep-4a", type: "separator" },
      { id: "pr-dashboard", type: "pr-dashboard" },
    ],
    // Line 5 — branding, location, weather, system
    [
      { id: "branding", type: "branding" },
      { id: "sep-5a", type: "separator" },
      { id: "location", type: "location" },
      { id: "sep-5b", type: "separator" },
      { id: "weather", type: "weather" },
      { id: "sep-5c", type: "separator" },
      { id: "memory-usage", type: "memory-usage" },
      { id: "sep-5d", type: "separator" },
      { id: "terminal-width", type: "terminal-width" },
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

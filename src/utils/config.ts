import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { SettingsSchema, DEFAULT_SETTINGS } from "../types/Settings.ts";
import type { Settings } from "../types/Settings.ts";

const CONFIG_DIR = join(homedir(), ".config", "kadustatusline");
const CONFIG_FILE = join(CONFIG_DIR, "settings.json");

/**
 * Load user settings from ~/.config/kadustatusline/settings.json.
 * Falls back to DEFAULT_SETTINGS when the file does not exist or is invalid.
 */
export async function loadSettings(): Promise<Settings> {
  try {
    const raw = readFileSync(CONFIG_FILE, "utf-8");
    const parsed = SettingsSchema.safeParse(JSON.parse(raw));
    if (parsed.success) return parsed.data;
  } catch {
    // File missing or unreadable — use defaults.
  }
  return DEFAULT_SETTINGS;
}

/**
 * Persist settings to ~/.config/kadustatusline/settings.json.
 * Creates the config directory if it does not exist.
 */
export async function saveSettings(settings: Settings): Promise<void> {
  mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(settings, null, 2) + "\n");
}

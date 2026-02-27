import { spawnSync } from "node:child_process";
import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const CustomCommandWidget: Widget = {
  name: "custom-command",
  displayName: "Custom Command",
  description: "Execute a shell command and display its output",
  category: "custom",

  render(item: WidgetItem, _ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const cmd = item.commandPath;
    if (!cmd) return null;

    const timeout = item.timeout ?? 2000;

    try {
      const result = spawnSync("sh", ["-c", cmd], {
        timeout,
        encoding: "utf-8",
        stdio: ["ignore", "pipe", "ignore"],
      });
      const text = (result.stdout ?? "").trim();
      if (!text) return null;

      const maxWidth = item.maxWidth ?? 40;
      const truncated = text.length > maxWidth ? text.slice(0, maxWidth - 1) + "…" : text;

      return {
        text: truncated,
        segments: [{ text: truncated }],
      };
    } catch {
      return null;
    }
  },

  getDefaultColor() {
    return "#cbd5e1";
  },
};

import type { Widget, WidgetOutput, WidgetItem } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const VimModeWidget: Widget = {
  name: "vim-mode",
  displayName: "Vim Mode",
  description: "Shows the current vim mode when vim is enabled",
  category: "session",

  render(item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const vim = (ctx.data as any).vim;
    if (!vim?.mode) return null;
    const mode = vim.mode.toUpperCase();
    const modeColor = mode === "INSERT" ? "#22c55e" : mode === "VISUAL" ? "#a855f7" : "#3b82f6";
    return {
      text: mode,
      segments: [
        { text: "VIM:", dim: true },
        { text: mode, fg: modeColor, bold: true },
      ],
    };
  },

  getDefaultColor(): string {
    return "#3b82f6";
  },
};

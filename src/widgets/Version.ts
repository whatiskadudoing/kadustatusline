import type { Widget, WidgetOutput, WidgetItem } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const VersionWidget: Widget = {
  name: "version",
  displayName: "Version",
  description: "Shows the Claude Code version",
  category: "session",

  render(item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const version = ctx.data.version;
    if (!version) return null;
    return {
      text: `v${version}`,
      segments: [
        { text: "v", dim: true },
        { text: version },
      ],
    };
  },

  getDefaultColor(): string {
    return "#94a3b8";
  },
};

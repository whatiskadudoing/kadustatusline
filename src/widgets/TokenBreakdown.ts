import type { Widget, WidgetItem, WidgetOutput } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export const TokenBreakdownWidget: Widget = {
  name: "token-breakdown",
  displayName: "Token Breakdown",
  description: "Input/output token counts",
  category: "context",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const cw = ctx.data.context_window;
    if (!cw) return null;

    const input = cw.total_input_tokens ?? 0;
    const output = cw.total_output_tokens ?? 0;

    const text = `↓${formatTokens(input)} ↑${formatTokens(output)}`;
    return {
      text,
      segments: [
        { text: `↓${formatTokens(input)}`, fg: "#93c5fd" },
        { text: " " },
        { text: `↑${formatTokens(output)}`, fg: "#c4b5fd" },
      ],
    };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

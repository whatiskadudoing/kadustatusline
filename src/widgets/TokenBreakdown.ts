import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
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
  description: "Input, output, cached, and total token counts",
  category: "context",

  render(_item: WidgetItem, ctx: RenderContext, settings: Settings): WidgetOutput | null {
    const cw = ctx.data.context_window;
    if (!cw) return null;

    const input = cw.total_input_tokens ?? 0;
    const output = cw.total_output_tokens ?? 0;
    const cached =
      (cw.current_usage?.cache_read_input_tokens ?? 0) +
      (cw.current_usage?.cache_creation_input_tokens ?? 0);
    const total = input + output + cached;

    const sepChar = settings.separator.character;
    const sepColor = settings.separator.color;

    const segments: ColorSegment[] = [
      { text: "In: ", dim: true },
      { text: formatTokens(input), fg: "#93c5fd" },
      { text: ` ${sepChar} `, fg: sepColor, dim: true },
      { text: "Out: ", dim: true },
      { text: formatTokens(output), fg: "#c4b5fd" },
      { text: ` ${sepChar} `, fg: sepColor, dim: true },
      { text: "Cached: ", dim: true },
      { text: formatTokens(cached), fg: "#93c5fd" },
      { text: ` ${sepChar} `, fg: sepColor, dim: true },
      { text: "Total: ", dim: true },
      { text: formatTokens(total), fg: "#e2e8f0", bold: true },
    ];

    const text = `In: ${formatTokens(input)} | Out: ${formatTokens(output)} | Cached: ${formatTokens(cached)} | Total: ${formatTokens(total)}`;
    return { text, segments };
  },

  getDefaultColor() {
    return "#94a3b8";
  },
};

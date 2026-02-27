import { describe, it, expect } from "vitest";
import { TokenBreakdownWidget } from "../TokenBreakdown.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "token-breakdown" };

function ctx(input?: number, output?: number): RenderContext {
  return {
    data: input != null
      ? { context_window: { total_input_tokens: input, total_output_tokens: output ?? 0, context_window_size: 200000 } }
      : {},
    displayMode: "normal",
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("TokenBreakdownWidget", () => {
  it("formats thousands with K suffix", () => {
    const result = TokenBreakdownWidget.render(item, ctx(85000, 21000), DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toContain("↓85.0K");
    expect(result!.text).toContain("↑21.0K");
  });

  it("formats millions with M suffix", () => {
    const result = TokenBreakdownWidget.render(item, ctx(1500000, 500000), DEFAULT_SETTINGS);
    expect(result!.text).toContain("↓1.5M");
    expect(result!.text).toContain("↑500.0K");
  });

  it("formats small numbers without suffix", () => {
    const result = TokenBreakdownWidget.render(item, ctx(500, 100), DEFAULT_SETTINGS);
    expect(result!.text).toContain("↓500");
    expect(result!.text).toContain("↑100");
  });

  it("returns null when no context data", () => {
    expect(TokenBreakdownWidget.render(item, ctx(), DEFAULT_SETTINGS)).toBeNull();
  });

  it("has colored segments", () => {
    const result = TokenBreakdownWidget.render(item, ctx(1000, 500), DEFAULT_SETTINGS);
    expect(result!.segments).toBeDefined();
    expect(result!.segments!.length).toBe(3);
  });
});

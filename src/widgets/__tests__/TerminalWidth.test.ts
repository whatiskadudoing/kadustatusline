import { describe, it, expect } from "vitest";
import { TerminalWidthWidget } from "../TerminalWidth.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "terminal-width" };

function ctx(width: number): RenderContext {
  return {
    data: {},
    displayMode: "normal",
    terminalWidth: width,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("TerminalWidthWidget", () => {
  it("renders terminal width with cols suffix", () => {
    const result = TerminalWidthWidget.render(item, ctx(120), DEFAULT_SETTINGS);
    expect(result!.text).toBe("120cols");
  });

  it("renders different widths", () => {
    expect(TerminalWidthWidget.render(item, ctx(80), DEFAULT_SETTINGS)!.text).toBe("80cols");
    expect(TerminalWidthWidget.render(item, ctx(200), DEFAULT_SETTINGS)!.text).toBe("200cols");
  });
});

import { describe, it, expect } from "vitest";
import { MemoryUsageWidget } from "../MemoryUsage.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "memory-usage" };
const ctx: RenderContext = {
  data: {},
  displayMode: "normal",
  terminalWidth: 120,
  isPreview: false,
  lineIndex: 0,
} as RenderContext;

describe("MemoryUsageWidget", () => {
  it("renders RAM percentage", () => {
    const result = MemoryUsageWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toMatch(/^RAM:\d+%$/);
  });

  it("has colored segment", () => {
    const result = MemoryUsageWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result!.segments).toBeDefined();
    expect(result!.segments!.length).toBe(1);
    expect(result!.segments![0]!.fg).toBeDefined();
  });
});

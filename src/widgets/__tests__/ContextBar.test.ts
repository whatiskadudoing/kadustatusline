import { describe, it, expect } from "vitest";
import { ContextBarWidget } from "../ContextBar.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "context-bar" };

function ctx(pct: number, mode: RenderContext["displayMode"] = "normal"): RenderContext {
  return {
    data: { context_window: { used_percentage: pct, context_window_size: 200000 } },
    displayMode: mode,
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("ContextBarWidget", () => {
  it("renders with percentage", () => {
    const result = ContextBarWidget.render(item, ctx(53), DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toContain("53%");
    expect(result!.text).toContain("CONTEXT:");
  });

  it("renders nano mode without label", () => {
    const result = ContextBarWidget.render(item, ctx(25, "nano"), DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).not.toContain("CONTEXT:");
    expect(result!.text).toContain("25%");
  });

  it("returns null when no context data", () => {
    const emptyCtx: RenderContext = {
      data: {},
      displayMode: "normal",
      terminalWidth: 120,
      isPreview: false,
      lineIndex: 0,
    } as RenderContext;
    expect(ContextBarWidget.render(item, emptyCtx, DEFAULT_SETTINGS)).toBeNull();
  });

  it("has correct number of segments", () => {
    const result = ContextBarWidget.render(item, ctx(50), DEFAULT_SETTINGS);
    // Should have: icon, label, 55 buckets, percentage
    expect(result!.segments!.length).toBeGreaterThan(50);
  });
});

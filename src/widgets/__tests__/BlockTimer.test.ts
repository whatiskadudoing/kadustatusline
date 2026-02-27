import { describe, it, expect } from "vitest";
import { BlockTimerWidget } from "../BlockTimer.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "block-timer" };

function ctx(durationMs?: number): RenderContext {
  return {
    data: durationMs != null ? { cost: { total_duration_ms: durationMs } } : {},
    displayMode: "normal",
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("BlockTimerWidget", () => {
  it("renders progress bar with time", () => {
    // 30 minutes = 1800000ms
    const result = BlockTimerWidget.render(item, ctx(1800000), DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toContain("BLK");
    expect(result!.text).toContain("30m");
  });

  it("renders hours and minutes", () => {
    // 2h30m = 9000000ms
    const result = BlockTimerWidget.render(item, ctx(9000000), DEFAULT_SETTINGS);
    expect(result!.text).toContain("BLK");
    expect(result!.text).toContain("2h30m");
  });

  it("returns null when no duration", () => {
    expect(BlockTimerWidget.render(item, ctx(), DEFAULT_SETTINGS)).toBeNull();
  });

  it("wraps around 5-hour blocks", () => {
    // 5h30m = 5.5 * 3600000 = 19800000ms → wraps to 30m
    const result = BlockTimerWidget.render(item, ctx(19800000), DEFAULT_SETTINGS);
    expect(result!.text).toContain("30m");
  });
});

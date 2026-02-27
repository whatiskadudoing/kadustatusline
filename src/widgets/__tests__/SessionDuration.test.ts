import { describe, it, expect } from "vitest";
import { SessionDurationWidget, formatDuration } from "../SessionDuration.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "session-duration" };

describe("formatDuration", () => {
  it("formats seconds", () => {
    expect(formatDuration(45000)).toBe("45s");
  });

  it("formats minutes and seconds", () => {
    expect(formatDuration(542000)).toBe("9m02s");
  });

  it("formats hours and minutes", () => {
    expect(formatDuration(7320000)).toBe("2h2m");
  });
});

describe("SessionDurationWidget", () => {
  it("renders formatted duration", () => {
    const ctx: RenderContext = {
      data: { cost: { total_duration_ms: 542000 } },
      displayMode: "normal",
      terminalWidth: 120,
      isPreview: false,
      lineIndex: 0,
    } as RenderContext;
    expect(SessionDurationWidget.render(item, ctx, DEFAULT_SETTINGS)?.text).toBe("9m02s");
  });

  it("returns null when no duration", () => {
    const ctx: RenderContext = {
      data: {},
      displayMode: "normal",
      terminalWidth: 120,
      isPreview: false,
      lineIndex: 0,
    } as RenderContext;
    expect(SessionDurationWidget.render(item, ctx, DEFAULT_SETTINGS)).toBeNull();
  });
});

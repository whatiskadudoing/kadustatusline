import { describe, it, expect } from "vitest";
import { SessionCostWidget } from "../SessionCost.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "session-cost" };

function ctx(cost?: number): RenderContext {
  return {
    data: cost != null ? { cost: { total_cost_usd: cost } } : {},
    displayMode: "normal",
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("SessionCostWidget", () => {
  it("formats cost to 2 decimal places", () => {
    expect(SessionCostWidget.render(item, ctx(2.456), DEFAULT_SETTINGS)?.text).toBe("$2.46");
  });

  it("formats zero cost", () => {
    expect(SessionCostWidget.render(item, ctx(0), DEFAULT_SETTINGS)?.text).toBe("$0.00");
  });

  it("returns null when no cost data", () => {
    expect(SessionCostWidget.render(item, ctx(), DEFAULT_SETTINGS)).toBeNull();
  });
});

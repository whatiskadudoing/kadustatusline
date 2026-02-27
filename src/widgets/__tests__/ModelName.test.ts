import { describe, it, expect } from "vitest";
import { ModelNameWidget } from "../ModelName.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "model-name" };

function ctx(overrides: Partial<RenderContext["data"]> = {}): RenderContext {
  return {
    data: { ...overrides } as RenderContext["data"],
    displayMode: "normal",
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  };
}

describe("ModelNameWidget", () => {
  it("renders model display name with version", () => {
    const result = ModelNameWidget.render(item, ctx({ model: { display_name: "Opus", id: "claude-opus-4-6" } }), DEFAULT_SETTINGS);
    expect(result?.text).toBe("Model: Opus 4.6");
  });

  it("falls back to model id with version", () => {
    const result = ModelNameWidget.render(item, ctx({ model: { id: "claude-sonnet-4-6" } }), DEFAULT_SETTINGS);
    expect(result?.text).toBe("Model: claude-sonnet-4-6 4.6");
  });

  it("handles string model", () => {
    const result = ModelNameWidget.render(item, ctx({ model: "Haiku" }), DEFAULT_SETTINGS);
    expect(result?.text).toBe("Model: Haiku");
  });

  it("returns null when no model", () => {
    const result = ModelNameWidget.render(item, ctx(), DEFAULT_SETTINGS);
    expect(result).toBeNull();
  });
});

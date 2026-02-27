import { describe, it, expect } from "vitest";
import { SeparatorWidget } from "../Separator.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "separator" };
const ctx: RenderContext = {
  data: {},
  displayMode: "normal",
  terminalWidth: 120,
  isPreview: false,
  lineIndex: 0,
} as RenderContext;

describe("SeparatorWidget", () => {
  it("renders default separator character", () => {
    const result = SeparatorWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result?.text).toBe(" │ ");
  });

  it("uses custom separator from settings", () => {
    const settings = { ...DEFAULT_SETTINGS, separator: { character: "|", color: "#ff0000" } };
    const result = SeparatorWidget.render(item, ctx, settings);
    expect(result?.text).toBe(" | ");
  });
});

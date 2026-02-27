import { describe, it, expect } from "vitest";
import { CustomTextWidget } from "../CustomText.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const ctx: RenderContext = {
  data: {},
  displayMode: "normal",
  terminalWidth: 120,
  isPreview: false,
  lineIndex: 0,
} as RenderContext;

describe("CustomTextWidget", () => {
  it("renders custom text", () => {
    const item: WidgetItem = { id: "1", type: "custom-text", customText: "Hello World" };
    const result = CustomTextWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toBe("Hello World");
  });

  it("returns null when no customText", () => {
    const item: WidgetItem = { id: "1", type: "custom-text" };
    expect(CustomTextWidget.render(item, ctx, DEFAULT_SETTINGS)).toBeNull();
  });
});

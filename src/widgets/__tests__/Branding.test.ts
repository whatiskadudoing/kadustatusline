import { describe, it, expect } from "vitest";
import { BrandingWidget } from "../Branding.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { DEFAULT_SETTINGS } from "../../types/Settings.ts";

const item: WidgetItem = { id: "1", type: "branding" };

function ctx(mode: RenderContext["displayMode"] = "normal"): RenderContext {
  return {
    data: {},
    displayMode: mode,
    terminalWidth: 120,
    isPreview: false,
    lineIndex: 0,
  } as RenderContext;
}

describe("BrandingWidget", () => {
  it("renders with branding name from settings", () => {
    const result = BrandingWidget.render(item, ctx(), DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toContain(DEFAULT_SETTINGS.brandingName);
  });

  it("includes STATUSLINE text in normal mode", () => {
    const result = BrandingWidget.render(item, ctx("normal"), DEFAULT_SETTINGS);
    expect(result!.text).toContain("STATUSLINE");
  });

  it("excludes STATUSLINE text in micro mode", () => {
    const result = BrandingWidget.render(item, ctx("micro"), DEFAULT_SETTINGS);
    expect(result!.text).not.toContain("STATUSLINE");
  });

  it("renders compact in nano mode", () => {
    const result = BrandingWidget.render(item, ctx("nano"), DEFAULT_SETTINGS);
    expect(result!.text).toContain(DEFAULT_SETTINGS.brandingName);
    expect(result!.text).not.toContain("STATUSLINE");
  });

  it("has segments with color info", () => {
    const result = BrandingWidget.render(item, ctx(), DEFAULT_SETTINGS);
    expect(result!.segments).toBeDefined();
    expect(result!.segments!.length).toBeGreaterThan(0);
  });
});

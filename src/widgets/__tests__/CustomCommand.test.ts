import { describe, it, expect } from "vitest";
import { CustomCommandWidget } from "../CustomCommand.ts";
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

describe("CustomCommandWidget", () => {
  it("runs a command and returns output", () => {
    const item: WidgetItem = { id: "1", type: "custom-command", commandPath: "echo hello" };
    const result = CustomCommandWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text).toBe("hello");
  });

  it("returns null when no commandPath", () => {
    const item: WidgetItem = { id: "1", type: "custom-command" };
    expect(CustomCommandWidget.render(item, ctx, DEFAULT_SETTINGS)).toBeNull();
  });

  it("truncates long output", () => {
    const item: WidgetItem = { id: "1", type: "custom-command", commandPath: "echo " + "a".repeat(50), maxWidth: 20 };
    const result = CustomCommandWidget.render(item, ctx, DEFAULT_SETTINGS);
    expect(result).not.toBeNull();
    expect(result!.text.length).toBeLessThanOrEqual(20);
  });

  it("returns null on empty output", () => {
    const item: WidgetItem = { id: "1", type: "custom-command", commandPath: "true" };
    expect(CustomCommandWidget.render(item, ctx, DEFAULT_SETTINGS)).toBeNull();
  });
});

import { describe, it, expect } from "vitest";
import { hexToRgb, rgbToAnsi, colorize, interpolateColor, gradient, RESET } from "../colors.ts";

describe("hexToRgb", () => {
  it("parses 6-digit hex", () => {
    expect(hexToRgb("#ff0000")).toEqual([255, 0, 0]);
    expect(hexToRgb("#4ade80")).toEqual([74, 222, 128]);
  });

  it("handles lowercase and uppercase", () => {
    expect(hexToRgb("#FF00FF")).toEqual([255, 0, 255]);
  });
});

describe("rgbToAnsi", () => {
  it("produces truecolor escape", () => {
    expect(rgbToAnsi(74, 222, 128)).toBe("\x1b[38;2;74;222;128m");
  });
});

describe("colorize", () => {
  it("wraps text with color and reset", () => {
    const result = colorize("hello", "#ff0000");
    expect(result).toContain("\x1b[38;2;255;0;0m");
    expect(result).toContain("hello");
    expect(result).toContain(RESET);
  });

  it("adds bold", () => {
    const result = colorize("hi", "#00ff00", { bold: true });
    expect(result).toContain("\x1b[1m");
  });
});

describe("interpolateColor", () => {
  it("returns start color at t=0", () => {
    expect(interpolateColor("#000000", "#ffffff", 0)).toBe("#000000");
  });

  it("returns end color at t=1", () => {
    expect(interpolateColor("#000000", "#ffffff", 1)).toBe("#ffffff");
  });

  it("returns midpoint at t=0.5", () => {
    expect(interpolateColor("#000000", "#ffffff", 0.5)).toBe("#808080");
  });
});

describe("gradient", () => {
  it("produces colored characters", () => {
    const result = gradient("ABC", "#ff0000", "#0000ff");
    expect(result).toContain("A");
    expect(result).toContain("B");
    expect(result).toContain("C");
    // Should contain ANSI escape sequences
    expect(result).toContain("\x1b[38;2;");
  });
});

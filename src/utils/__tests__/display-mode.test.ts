import { describe, it, expect } from "vitest";
import { getDisplayMode } from "../../types/DisplayMode.ts";

describe("getDisplayMode", () => {
  it("returns nano for width < 35", () => {
    expect(getDisplayMode(20)).toBe("nano");
    expect(getDisplayMode(34)).toBe("nano");
  });

  it("returns micro for 35 <= width < 55", () => {
    expect(getDisplayMode(35)).toBe("micro");
    expect(getDisplayMode(54)).toBe("micro");
  });

  it("returns mini for 55 <= width < 80", () => {
    expect(getDisplayMode(55)).toBe("mini");
    expect(getDisplayMode(79)).toBe("mini");
  });

  it("returns normal for width >= 80", () => {
    expect(getDisplayMode(80)).toBe("normal");
    expect(getDisplayMode(200)).toBe("normal");
  });
});

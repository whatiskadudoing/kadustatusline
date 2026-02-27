/**
 * Display‑mode tiers that widgets can use to decide how much detail to render.
 *
 * Breakpoints (terminal columns):
 *   nano   < 35
 *   micro  < 55
 *   mini   < 80
 *   normal >= 80
 */
export type DisplayMode = "nano" | "micro" | "mini" | "normal";

/** Map a terminal width (columns) to the appropriate DisplayMode. */
export function getDisplayMode(width: number): DisplayMode {
  if (width < 35) return "nano";
  if (width < 55) return "micro";
  if (width < 80) return "mini";
  return "normal";
}

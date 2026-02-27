/**
 * Color utilities supporting truecolor (hex), 256-color, and 16-color terminals.
 */

/** ANSI reset sequence. */
export const RESET = "\x1b[0m";

/**
 * Convert a hex color string (e.g. "#ff8800" or "ff8800") to an RGB tuple.
 */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace(/^#/, "");
  const n = parseInt(h, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/**
 * Return an ANSI truecolor foreground escape for the given RGB values.
 */
export function rgbToAnsi(r: number, g: number, b: number): string {
  return `\x1b[38;2;${r};${g};${b}m`;
}

/**
 * Wrap `text` with ANSI foreground color (from a hex string) and optional
 * bold / dim modifiers.  Resets at the end.
 */
export function colorize(
  text: string,
  fg?: string,
  opts?: { bold?: boolean; dim?: boolean },
): string {
  let prefix = "";

  if (fg) {
    const [r, g, b] = hexToRgb(fg);
    prefix += rgbToAnsi(r, g, b);
  }

  if (opts?.bold) prefix += "\x1b[1m";
  if (opts?.dim) prefix += "\x1b[2m";

  if (!prefix) return text;
  return prefix + text + RESET;
}

/**
 * Linearly interpolate between two hex colors at position `t` (0 = from, 1 = to).
 * Returns a hex string including the leading `#`.
 */
export function interpolateColor(
  fromHex: string,
  toHex: string,
  t: number,
): string {
  const [r1, g1, b1] = hexToRgb(fromHex);
  const [r2, g2, b2] = hexToRgb(toHex);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  const toHexByte = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
}

/**
 * Render `text` as a per-character color gradient from `fromHex` to `toHex`.
 */
export function gradient(
  text: string,
  fromHex: string,
  toHex: string,
): string {
  if (text.length <= 1) return colorize(text, fromHex);

  let result = "";
  for (let i = 0; i < text.length; i++) {
    const t = i / (text.length - 1);
    const hex = interpolateColor(fromHex, toHex, t);
    const [r, g, b] = hexToRgb(hex);
    result += rgbToAnsi(r, g, b) + text[i];
  }
  return result + RESET;
}

import type { StatusData } from "../types/StatusData.ts";
import type { Settings } from "../types/Settings.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { ColorSegment, WidgetItem } from "../types/Widget.ts";
import { colorize, RESET } from "./colors.ts";

/**
 * Lazily import the widget registry so that widgets/index.ts can be the
 * single source of truth for all registered widgets.
 */
async function getWidgetRegistry() {
  const { widgetRegistry } = await import("../widgets/index.ts");
  return widgetRegistry;
}

/**
 * Apply ANSI color codes to a list of ColorSegments and concatenate them.
 */
function renderSegments(segments: ColorSegment[], itemColor?: string): string {
  return segments
    .map((seg) => {
      const fg = seg.fg ?? itemColor;
      return colorize(seg.text, fg, { bold: seg.bold, dim: seg.dim });
    })
    .join("");
}

/**
 * Render a single widget item into a colored string.
 * Returns an empty string if the widget produces no output.
 */
async function renderItem(
  item: WidgetItem,
  ctx: RenderContext,
  settings: Settings,
  registry: Map<string, import("../types/Widget.ts").Widget>,
): Promise<string> {
  const widget = registry.get(item.type);
  if (!widget) return "";

  const output = widget.render(item, ctx, settings);
  if (!output) return "";

  const itemColor = item.color ?? widget.getDefaultColor();

  if (output.segments && output.segments.length > 0) {
    return renderSegments(output.segments, itemColor);
  }

  return colorize(output.text, itemColor, { bold: item.bold });
}

/**
 * Render all configured lines of the statusline.
 *
 * For each line definition in `settings.lines`:
 *   1. Iterate over widget items.
 *   2. Look up each widget in the registry by type.
 *   3. Call render(), apply colors, join non-empty results.
 *   4. Insert line separators between lines when enabled.
 *
 * Each returned string is already prefixed with a reset and has regular
 * spaces replaced with non-breaking spaces (for shell display safety).
 */
export async function renderAllLines(
  _data: StatusData,
  settings: Settings,
  ctx: RenderContext,
): Promise<string[]> {
  const registry = await getWidgetRegistry();
  const output: string[] = [];

  for (let lineIdx = 0; lineIdx < settings.lines.length; lineIdx++) {
    const lineItems = settings.lines[lineIdx];
    if (!lineItems) continue;

    // Insert line separator before every line except the first.
    if (
      lineIdx > 0 &&
      settings.lineSeparator.enabled &&
      settings.lineSeparator.character
    ) {
      const sepChar = settings.lineSeparator.character;
      const sepWidth = settings.lineSeparator.width;
      const sepColor = settings.lineSeparator.color;
      const sepLine = colorize(sepChar.repeat(sepWidth), sepColor);
      output.push(sepLine);
    }

    // Build the render context for this specific line index.
    const lineCtx: RenderContext = { ...ctx, lineIndex: lineIdx };

    const parts: string[] = [];
    for (const item of lineItems) {
      const rendered = await renderItem(item, lineCtx, settings, registry);
      if (rendered) parts.push(rendered);
    }

    const joined = parts.join("");
    output.push(joined);
  }

  return output;
}

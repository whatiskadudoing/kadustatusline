import { z } from "zod";
import type { RenderContext } from "./RenderContext.ts";
import type { Settings } from "./Settings.ts";

// ---------------------------------------------------------------------------
// Color segment — a single styled run of text inside a widget's output
// ---------------------------------------------------------------------------

export interface ColorSegment {
  text: string;
  fg?: string;
  bg?: string;
  bold?: boolean;
  dim?: boolean;
}

// ---------------------------------------------------------------------------
// Widget output — plain text plus optional rich segments
// ---------------------------------------------------------------------------

export interface WidgetOutput {
  text: string;
  segments?: ColorSegment[];
}

// ---------------------------------------------------------------------------
// Widget categories
// ---------------------------------------------------------------------------

export type WidgetCategory =
  | "branding"
  | "context"
  | "usage"
  | "git"
  | "session"
  | "system"
  | "display"
  | "custom";

// ---------------------------------------------------------------------------
// Widget interface — every widget must implement this contract
// ---------------------------------------------------------------------------

export interface Widget {
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly category: WidgetCategory;

  render(
    item: WidgetItem,
    ctx: RenderContext,
    settings: Settings,
  ): WidgetOutput | null;

  getDefaultColor(): string;
}

// ---------------------------------------------------------------------------
// WidgetItem — Zod schema for a single item in a status line
// ---------------------------------------------------------------------------

export const WidgetItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  color: z.string().optional(),
  bold: z.boolean().optional(),
  customText: z.string().optional(),
  commandPath: z.string().optional(),
  maxWidth: z.number().optional(),
  timeout: z.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type WidgetItem = z.infer<typeof WidgetItemSchema>;

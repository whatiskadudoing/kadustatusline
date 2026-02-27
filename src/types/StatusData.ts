import { z } from "zod";

/**
 * Zod schema for the JSON payload that Claude Code pipes into ccstatus.
 * Uses `.passthrough()` so unknown future fields are preserved, not stripped.
 */
export const StatusDataSchema = z
  .object({
    hook_event_name: z.string().optional(),
    session_id: z.string().optional(),
    transcript_path: z.string().optional(),
    cwd: z.string().optional(),

    model: z
      .union([
        z.string(),
        z
          .object({
            display_name: z.string().optional(),
            id: z.string().optional(),
          })
          .passthrough(),
      ])
      .optional(),

    workspace: z
      .object({
        current_dir: z.string().optional(),
        project_dir: z.string().optional(),
      })
      .passthrough()
      .optional(),

    version: z.string().optional(),

    exceeds_200k_tokens: z.boolean().optional(),

    output_style: z
      .object({
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),

    vim: z
      .object({
        mode: z.string().optional(),
      })
      .passthrough()
      .optional(),

    agent: z
      .object({
        name: z.string().optional(),
      })
      .passthrough()
      .optional(),

    context_window: z
      .object({
        used_percentage: z.number().optional(),
        remaining_percentage: z.number().optional(),
        context_window_size: z.number().optional(),
        total_input_tokens: z.number().optional(),
        total_output_tokens: z.number().optional(),
        current_usage: z
          .object({
            input_tokens: z.number().optional(),
            output_tokens: z.number().optional(),
            cache_creation_input_tokens: z.number().optional(),
            cache_read_input_tokens: z.number().optional(),
          })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),

    cost: z
      .object({
        total_cost_usd: z.number().optional(),
        total_duration_ms: z.number().optional(),
        total_api_duration_ms: z.number().optional(),
        total_lines_added: z.number().optional(),
        total_lines_removed: z.number().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

/** Inferred TypeScript type from the Zod schema. */
export type StatusData = z.infer<typeof StatusDataSchema>;

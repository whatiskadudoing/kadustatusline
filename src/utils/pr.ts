import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { PrData } from "../types/RenderContext.ts";

const execFileAsync = promisify(execFile);

/**
 * Fetch open PRs authored by the current user via the `gh` CLI.
 * Returns null if `gh` is not installed or not authenticated.
 */
export async function fetchPrs(): Promise<PrData[] | null> {
  try {
    const { stdout } = await execFileAsync(
      "gh",
      [
        "pr", "list",
        "--author", "@me",
        "--state", "open",
        "--json", "number,title,isDraft,reviewDecision,reviews,comments",
        "--limit", "10",
      ],
      { timeout: 10000 },
    );

    const raw = JSON.parse(stdout.trim()) as Array<{
      number: number;
      title: string;
      isDraft: boolean;
      reviewDecision: string;
      reviews: Array<{ state?: string }>;
      comments: Array<unknown>;
    }>;

    return raw.map((pr) => ({
      number: pr.number,
      title: pr.title,
      isDraft: pr.isDraft,
      reviewDecision: pr.reviewDecision ?? "",
      approvals: (pr.reviews ?? []).filter((r) => r.state === "APPROVED").length,
      commentsCount: (pr.comments ?? []).length,
    }));
  } catch {
    return null;
  }
}

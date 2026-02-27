import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { GitData } from "../types/RenderContext.ts";

const execFileAsync = promisify(execFile);

/**
 * Run a git command and return its trimmed stdout.
 */
export async function execGit(args: string[]): Promise<string> {
  const { stdout } = await execFileAsync("git", args, { timeout: 5000 });
  return stdout.trim();
}

/**
 * Gather all git status data in parallel.
 * Returns `{ isGitRepo: false, ... }` when not inside a git repository.
 */
export async function getGitData(): Promise<GitData> {
  const empty: GitData = {
    branch: "",
    stashCount: 0,
    modified: 0,
    staged: 0,
    untracked: 0,
    totalChanged: 0,
    ahead: 0,
    behind: 0,
    lastCommitEpoch: 0,
    isGitRepo: false,
  };

  try {
    await execGit(["rev-parse", "--is-inside-work-tree"]);
  } catch {
    return empty;
  }

  const [branchResult, statusResult, stashResult, logResult, revListResult] =
    await Promise.allSettled([
      execGit(["rev-parse", "--abbrev-ref", "HEAD"]),
      execGit(["status", "--porcelain"]),
      execGit(["stash", "list"]),
      execGit(["log", "-1", "--format=%ct"]),
      execGit(["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]),
    ]);

  const branch =
    branchResult.status === "fulfilled" ? branchResult.value : "";

  let modified = 0;
  let staged = 0;
  let untracked = 0;

  if (statusResult.status === "fulfilled" && statusResult.value) {
    for (const line of statusResult.value.split("\n")) {
      if (!line) continue;
      const x = line[0];
      const y = line[1];
      if (x === "?" && y === "?") {
        untracked++;
      } else {
        if (x && x !== " " && x !== "?") staged++;
        if (y && y !== " " && y !== "?") modified++;
      }
    }
  }

  const stashCount =
    stashResult.status === "fulfilled" && stashResult.value
      ? stashResult.value.split("\n").length
      : 0;

  const lastCommitEpoch =
    logResult.status === "fulfilled" ? parseInt(logResult.value, 10) || 0 : 0;

  let ahead = 0;
  let behind = 0;
  if (revListResult.status === "fulfilled" && revListResult.value) {
    const parts = revListResult.value.split(/\s+/);
    ahead = parseInt(parts[0] ?? "0", 10) || 0;
    behind = parseInt(parts[1] ?? "0", 10) || 0;
  }

  return {
    branch,
    stashCount,
    modified,
    staged,
    untracked,
    totalChanged: modified + staged + untracked,
    ahead,
    behind,
    lastCommitEpoch,
    isGitRepo: true,
  };
}

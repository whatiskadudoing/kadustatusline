import type { GitData } from "../types/RenderContext.ts";

/**
 * Run a git command via Bun.spawn and return its trimmed stdout.
 * Rejects if the process exits with a non-zero code.
 */
export async function execGit(args: string[]): Promise<string> {
  const proc = Bun.spawn(["git", ...args], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const output = await new Response(proc.stdout).text();
  const exitCode = await proc.exited;
  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(`git ${args[0]} failed (${exitCode}): ${stderr.trim()}`);
  }
  return output.trim();
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

  // Quick check: are we inside a work tree?
  try {
    await execGit(["rev-parse", "--is-inside-work-tree"]);
  } catch {
    return empty;
  }

  // Run all queries in parallel.
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

  // Parse porcelain status
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

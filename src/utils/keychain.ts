import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/**
 * Attempt to read the Claude Code OAuth token from the macOS keychain.
 * Returns `null` if the credential is not found or cannot be parsed.
 */
export async function getAnthropicOAuthToken(): Promise<string | null> {
  try {
    const { stdout } = await execFileAsync(
      "security",
      ["find-generic-password", "-s", "Claude Code-credentials", "-w"],
      { timeout: 3000 },
    );

    const trimmed = stdout.trim();
    if (!trimmed) return null;

    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const oauth = parsed["claudeAiOauth"] as
      | { accessToken?: string }
      | undefined;

    return oauth?.accessToken ?? null;
  } catch {
    return null;
  }
}

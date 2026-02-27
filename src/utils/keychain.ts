/**
 * macOS Keychain integration for retrieving the Anthropic / Claude Code
 * OAuth access token.
 */

/**
 * Attempt to read the Claude Code OAuth token from the macOS keychain.
 * Returns `null` if the credential is not found or cannot be parsed.
 */
export async function getAnthropicOAuthToken(): Promise<string | null> {
  try {
    const proc = Bun.spawn(
      [
        "security",
        "find-generic-password",
        "-s",
        "Claude Code-credentials",
        "-w",
      ],
      {
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) return null;

    const trimmed = output.trim();
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

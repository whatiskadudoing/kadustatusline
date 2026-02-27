import { spawnSync } from "node:child_process";

/**
 * Detect terminal width using a fallback chain:
 *   1. `stty size`
 *   2. `tput cols`
 *   3. COLUMNS environment variable
 *   4. Default: 80
 */
export function getTerminalWidth(): number {
  // 1. Try stty
  try {
    const proc = spawnSync("stty", ["size"], {
      stdio: ["inherit", "pipe", "pipe"],
      encoding: "utf-8",
    });
    const output = (proc.stdout ?? "").trim();
    if (output) {
      const cols = parseInt(output.split(/\s+/)[1] ?? "", 10);
      if (cols > 0) return cols;
    }
  } catch {}

  // 2. Try tput
  try {
    const proc = spawnSync("tput", ["cols"], {
      stdio: ["inherit", "pipe", "pipe"],
      encoding: "utf-8",
    });
    const output = (proc.stdout ?? "").trim();
    if (output) {
      const cols = parseInt(output, 10);
      if (cols > 0) return cols;
    }
  } catch {}

  // 3. Try COLUMNS env
  const envCols = process.env["COLUMNS"];
  if (envCols) {
    const cols = parseInt(envCols, 10);
    if (cols > 0) return cols;
  }

  // 4. Default
  return 80;
}

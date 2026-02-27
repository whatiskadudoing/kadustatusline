import { readStdin } from "./utils/stdin.ts";
import { getTerminalWidth } from "./utils/terminal.ts";
import { getDisplayMode } from "./types/DisplayMode.ts";
import { StatusDataSchema } from "./types/StatusData.ts";
import { loadSettings } from "./utils/config.ts";
import { prefetchAll } from "./utils/prefetch.ts";
import { renderAllLines } from "./utils/renderer.ts";
import type { RenderContext } from "./types/RenderContext.ts";

async function main() {
  if (!process.stdin.isTTY) {
    // Piped mode: read JSON from stdin, render statusline, exit
    const raw = await readStdin();
    const parsed = StatusDataSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      process.stderr.write(`kadustatusline: invalid input: ${parsed.error.message}\n`);
      process.exit(1);
    }

    const data = parsed.data;
    const settings = await loadSettings();
    const terminalWidth = getTerminalWidth();
    const displayMode = getDisplayMode(terminalWidth);
    const prefetched = await prefetchAll(data, settings);

    const ctx: RenderContext = {
      data,
      displayMode,
      terminalWidth,
      isPreview: false,
      lineIndex: 0,
      ...prefetched,
    };

    const lines = await renderAllLines(data, settings, ctx);
    for (const line of lines) {
      const output = "\x1b[0m" + line.replace(/ /g, "\u00A0");
      process.stdout.write(output + "\n");
    }
  } else {
    // Interactive mode: launch TUI configurator
    const { runTUI } = await import("./tui/App.tsx");
    await runTUI();
  }
}

main().catch((err) => {
  process.stderr.write(`kadustatusline: ${err}\n`);
  process.exit(1);
});

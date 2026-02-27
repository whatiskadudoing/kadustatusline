import React, { useState, useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Settings } from "../../types/Settings.ts";
import type { RenderContext } from "../../types/RenderContext.ts";
import { renderAllLines } from "../../utils/renderer.ts";
import { getDisplayMode } from "../../types/DisplayMode.ts";
import stripAnsi from "strip-ansi";

// Example data that mimics a real Claude Code JSON payload
const EXAMPLE_DATA = {
  model: { display_name: "Opus", id: "claude-opus-4-6" },
  context_window: {
    used_percentage: 53,
    context_window_size: 200000,
    total_input_tokens: 85000,
    total_output_tokens: 21000,
  },
  cost: { total_cost_usd: 1.83, total_duration_ms: 542000 },
  workspace: { cwd: "/Users/kadu/developer/trisor/kadustatusline" },
} as import("../../types/StatusData.ts").StatusData;

export interface PreviewProps {
  settings: Settings;
  onBack: () => void;
}

export function Preview({ settings, onBack }: PreviewProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [width, setWidth] = useState(process.stdout.columns || 80);

  useInput((_input, key) => {
    if (key.escape) onBack();
    if (key.leftArrow) setWidth((w) => Math.max(30, w - 10));
    if (key.rightArrow) setWidth((w) => Math.min(200, w + 10));
  });

  useEffect(() => {
    const ctx: RenderContext = {
      data: EXAMPLE_DATA,
      displayMode: getDisplayMode(width),
      terminalWidth: width,
      isPreview: true,
      lineIndex: 0,
    };

    renderAllLines(EXAMPLE_DATA, settings, ctx).then(setLines);
  }, [settings, width]);

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Preview</Text>
      <Text dimColor>Simulated width: {width}cols ({getDisplayMode(width)} mode)</Text>
      <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="gray" paddingX={1}>
        {lines.map((line, i) => (
          <Text key={i}>{stripAnsi(line)}</Text>
        ))}
        {lines.length === 0 && <Text dimColor>Loading...</Text>}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>←→ change width  esc back</Text>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Settings } from "../../types/Settings.ts";
import type { WidgetItem } from "../../types/Widget.ts";
import { getAllWidgets } from "../../widgets/index.ts";

export interface LineEditorProps {
  settings: Settings;
  onSave: (lines: WidgetItem[][]) => void;
  onBack: () => void;
}

export function LineEditor({ settings, onSave, onBack }: LineEditorProps) {
  const [lines, setLines] = useState<WidgetItem[][]>(() =>
    settings.lines.map((line) => [...line]),
  );
  const [lineIdx, setLineIdx] = useState(0);
  const [itemIdx, setItemIdx] = useState(0);
  const [mode, setMode] = useState<"nav" | "add">("nav");
  const [addIdx, setAddIdx] = useState(0);

  const allWidgets = getAllWidgets().filter((w) => w.name !== "separator");
  const currentLine = lines[lineIdx] ?? [];

  useInput((input, key) => {
    if (mode === "add") {
      if (key.upArrow) setAddIdx((i) => Math.max(0, i - 1));
      if (key.downArrow) setAddIdx((i) => Math.min(allWidgets.length - 1, i + 1));
      if (key.escape) setMode("nav");
      if (key.return) {
        const widget = allWidgets[addIdx]!;
        const newItem: WidgetItem = {
          id: `${widget.name}-${Date.now()}`,
          type: widget.name,
        };
        const newLines = [...lines];
        const line = [...(newLines[lineIdx] ?? [])];
        // Insert separator before widget if line is not empty
        if (line.length > 0) {
          line.push({ id: `sep-${Date.now()}`, type: "separator" });
        }
        line.push(newItem);
        newLines[lineIdx] = line;
        setLines(newLines);
        setMode("nav");
      }
      return;
    }

    // Navigation mode
    if (key.upArrow) setLineIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setLineIdx((i) => Math.min(lines.length - 1, i + 1));
    if (key.leftArrow) setItemIdx((i) => Math.max(0, i - 1));
    if (key.rightArrow) setItemIdx((i) => Math.min(currentLine.length - 1, i + 1));
    if (key.escape) onBack();

    if (input === "a") {
      setAddIdx(0);
      setMode("add");
    }

    if (input === "d" && currentLine.length > 0) {
      const newLines = [...lines];
      const line = [...currentLine];
      line.splice(itemIdx, 1);
      newLines[lineIdx] = line;
      setLines(newLines);
      setItemIdx((i) => Math.max(0, i - 1));
    }

    if (input === "n") {
      setLines([...lines, []]);
      setLineIdx(lines.length);
      setItemIdx(0);
    }

    if (input === "s") {
      onSave(lines);
    }
  });

  if (mode === "add") {
    return (
      <Box flexDirection="column">
        <Text bold color="blue">Add Widget to Line {lineIdx + 1}</Text>
        <Box flexDirection="column" marginTop={1}>
          {allWidgets.map((w, i) => (
            <Text key={w.name} color={i === addIdx ? "cyan" : undefined}>
              {i === addIdx ? "❯ " : "  "}{w.displayName} <Text dimColor>({w.category})</Text>
            </Text>
          ))}
        </Box>
        <Box marginTop={1}>
          <Text dimColor>↑↓ navigate  ⏎ add  esc cancel</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Line Editor</Text>
      <Box flexDirection="column" marginTop={1}>
        {lines.map((line, li) => (
          <Box key={li}>
            <Text color={li === lineIdx ? "cyan" : undefined}>
              {li === lineIdx ? "❯ " : "  "}Line {li + 1}:{" "}
            </Text>
            {line.map((item, ii) => (
              <Text
                key={item.id}
                color={li === lineIdx && ii === itemIdx ? "yellow" : undefined}
                bold={li === lineIdx && ii === itemIdx}
              >
                {item.type === "separator" ? " │ " : ` [${item.type}] `}
              </Text>
            ))}
            {line.length === 0 && <Text dimColor>(empty)</Text>}
          </Box>
        ))}
      </Box>
      <Box marginTop={1} flexDirection="column">
        <Text dimColor>↑↓ line  ←→ widget  a add  d delete  n new line  s save  esc back</Text>
      </Box>
    </Box>
  );
}

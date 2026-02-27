import React, { useState } from "react";
import { Box, Text, useInput } from "ink";

export interface MainMenuProps {
  onSelect: (choice: "lines" | "theme" | "preview" | "install" | "quit") => void;
}

const ITEMS = [
  { key: "lines" as const, label: "Edit Lines", desc: "Add, remove, and reorder widgets per line" },
  { key: "theme" as const, label: "Theme", desc: "Change branding name, colors, separator" },
  { key: "preview" as const, label: "Preview", desc: "Live preview with example data" },
  { key: "install" as const, label: "Install", desc: "Write to Claude Code settings.json" },
  { key: "quit" as const, label: "Quit", desc: "Exit configurator" },
];

export function MainMenu({ onSelect }: MainMenuProps) {
  const [idx, setIdx] = useState(0);

  useInput((_input, key) => {
    if (key.upArrow) setIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setIdx((i) => Math.min(ITEMS.length - 1, i + 1));
    if (key.return) onSelect(ITEMS[idx]!.key);
    if (_input === "q") onSelect("quit");
  });

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color="blue">kadustatusline</Text>
        <Text dimColor> configurator</Text>
      </Box>
      {ITEMS.map((item, i) => (
        <Box key={item.key}>
          <Text color={i === idx ? "cyan" : undefined}>
            {i === idx ? "❯ " : "  "}
            {item.label}
          </Text>
          {i === idx && <Text dimColor>  {item.desc}</Text>}
        </Box>
      ))}
      <Box marginTop={1}>
        <Text dimColor>↑↓ navigate  ⏎ select  q quit</Text>
      </Box>
    </Box>
  );
}

import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import type { Settings } from "../../types/Settings.ts";

export interface ThemeSelectorProps {
  settings: Settings;
  onSave: (partial: Partial<Settings>) => void;
  onBack: () => void;
}

const PRESETS = [
  {
    name: "Default Blue",
    brandingColors: ["#1e3a8a", "#3b82f6", "#93c5fd"],
    separator: { character: "│", color: "#475569" },
  },
  {
    name: "Emerald",
    brandingColors: ["#064e3b", "#10b981", "#6ee7b7"],
    separator: { character: "│", color: "#475569" },
  },
  {
    name: "Purple",
    brandingColors: ["#581c87", "#a855f7", "#d8b4fe"],
    separator: { character: "│", color: "#6b21a8" },
  },
  {
    name: "Sunset",
    brandingColors: ["#9a3412", "#f97316", "#fdba74"],
    separator: { character: "│", color: "#7c2d12" },
  },
  {
    name: "Rose",
    brandingColors: ["#9f1239", "#f43f5e", "#fda4af"],
    separator: { character: "│", color: "#881337" },
  },
];

export function ThemeSelector({ settings, onSave, onBack }: ThemeSelectorProps) {
  const [idx, setIdx] = useState(0);
  const [field, setField] = useState<"preset" | "name">("preset");
  const [brandingName, setBrandingName] = useState(settings.brandingName);

  useInput((input, key) => {
    if (field === "name") {
      if (key.return) {
        setField("preset");
        return;
      }
      if (key.escape) {
        setField("preset");
        return;
      }
      if (key.backspace || key.delete) {
        setBrandingName((n) => n.slice(0, -1));
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setBrandingName((n) => n + input);
      }
      return;
    }

    if (key.upArrow) setIdx((i) => Math.max(0, i - 1));
    if (key.downArrow) setIdx((i) => Math.min(PRESETS.length - 1, i + 1));
    if (key.escape) onBack();

    if (input === "n") {
      setField("name");
    }

    if (key.return) {
      const preset = PRESETS[idx]!;
      onSave({
        brandingName,
        brandingColors: preset.brandingColors,
        separator: preset.separator,
      });
    }
  });

  if (field === "name") {
    return (
      <Box flexDirection="column">
        <Text bold color="blue">Branding Name</Text>
        <Box marginTop={1}>
          <Text>Name: </Text>
          <Text color="yellow">{brandingName}</Text>
          <Text color="cyan">_</Text>
        </Box>
        <Box marginTop={1}>
          <Text dimColor>Type name  ⏎ confirm  esc cancel</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Theme</Text>
      <Box marginTop={1}>
        <Text>Branding: </Text>
        <Text color="yellow" bold>{brandingName}</Text>
        <Text dimColor>  (press n to change)</Text>
      </Box>
      <Box flexDirection="column" marginTop={1}>
        {PRESETS.map((p, i) => (
          <Box key={p.name}>
            <Text color={i === idx ? "cyan" : undefined}>
              {i === idx ? "❯ " : "  "}{p.name}
            </Text>
            <Text> </Text>
            {p.brandingColors.map((c, ci) => (
              <Text key={ci} color={c}>██</Text>
            ))}
          </Box>
        ))}
      </Box>
      <Box marginTop={1}>
        <Text dimColor>↑↓ navigate  ⏎ apply  n rename  esc back</Text>
      </Box>
    </Box>
  );
}

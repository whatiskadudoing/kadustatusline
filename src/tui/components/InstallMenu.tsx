import React, { useState } from "react";
import { Box, Text, useInput } from "ink";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

export interface InstallMenuProps {
  onBack: () => void;
}

export function InstallMenu({ onBack }: InstallMenuProps) {
  const [status, setStatus] = useState<"prompt" | "done" | "error">("prompt");
  const [message, setMessage] = useState("");

  const claudeSettingsPath = join(homedir(), ".claude", "settings.json");

  useInput((input, key) => {
    if (key.escape) onBack();

    if (status === "prompt" && key.return) {
      try {
        let existing: Record<string, unknown> = {};
        try {
          existing = JSON.parse(readFileSync(claudeSettingsPath, "utf-8"));
        } catch {
          // File doesn't exist yet
        }

        existing.statusLine = {
          type: "command",
          command: "kadustatusline",
        };

        writeFileSync(claudeSettingsPath, JSON.stringify(existing, null, 2) + "\n");
        setStatus("done");
        setMessage(`Written to ${claudeSettingsPath}`);
      } catch (err) {
        setStatus("error");
        setMessage(String(err));
      }
    }

    if (input === "q" || (status !== "prompt" && key.return)) {
      onBack();
    }
  });

  return (
    <Box flexDirection="column">
      <Text bold color="blue">Install to Claude Code</Text>

      {status === "prompt" && (
        <Box flexDirection="column" marginTop={1}>
          <Text>This will update your Claude Code settings to use kadustatusline:</Text>
          <Box marginTop={1}>
            <Text dimColor>{claudeSettingsPath}</Text>
          </Box>
          <Box marginTop={1}>
            <Text color="yellow">Press ⏎ to install, esc to cancel</Text>
          </Box>
        </Box>
      )}

      {status === "done" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="green">Installed successfully!</Text>
          <Text dimColor>{message}</Text>
          <Text dimColor>Restart Claude Code to see the new statusline.</Text>
          <Box marginTop={1}>
            <Text dimColor>Press ⏎ or esc to go back</Text>
          </Box>
        </Box>
      )}

      {status === "error" && (
        <Box flexDirection="column" marginTop={1}>
          <Text color="red">Error: {message}</Text>
          <Box marginTop={1}>
            <Text dimColor>Press ⏎ or esc to go back</Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}

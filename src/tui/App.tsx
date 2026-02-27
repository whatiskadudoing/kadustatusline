import React, { useState, useEffect } from "react";
import { render, Box, Text } from "ink";
import { loadSettings, saveSettings } from "../utils/config.ts";
import type { Settings } from "../types/Settings.ts";
import type { WidgetItem } from "../types/Widget.ts";
import { MainMenu } from "./components/MainMenu.tsx";
import { LineEditor } from "./components/LineEditor.tsx";
import { ThemeSelector } from "./components/ThemeSelector.tsx";
import { Preview } from "./components/Preview.tsx";
import { InstallMenu } from "./components/InstallMenu.tsx";

type Screen = "menu" | "lines" | "theme" | "preview" | "install";

function App() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings().then(setSettings);
  }, []);

  if (!settings) {
    return (
      <Box padding={1}>
        <Text dimColor>Loading settings...</Text>
      </Box>
    );
  }

  const persist = async (updated: Settings) => {
    setSettings(updated);
    await saveSettings(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (screen === "lines") {
    return (
      <Box flexDirection="column" padding={1}>
        <LineEditor
          settings={settings}
          onSave={(lines: WidgetItem[][]) => {
            persist({ ...settings, lines });
            setScreen("menu");
          }}
          onBack={() => setScreen("menu")}
        />
      </Box>
    );
  }

  if (screen === "theme") {
    return (
      <Box flexDirection="column" padding={1}>
        <ThemeSelector
          settings={settings}
          onSave={(partial) => {
            persist({ ...settings, ...partial });
            setScreen("menu");
          }}
          onBack={() => setScreen("menu")}
        />
      </Box>
    );
  }

  if (screen === "preview") {
    return (
      <Box flexDirection="column" padding={1}>
        <Preview settings={settings} onBack={() => setScreen("menu")} />
      </Box>
    );
  }

  if (screen === "install") {
    return (
      <Box flexDirection="column" padding={1}>
        <InstallMenu onBack={() => setScreen("menu")} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      {saved && <Text color="green">Settings saved!</Text>}
      <MainMenu
        onSelect={(choice) => {
          if (choice === "quit") process.exit(0);
          setScreen(choice);
        }}
      />
    </Box>
  );
}

export async function runTUI(): Promise<void> {
  const { waitUntilExit } = render(<App />);
  await waitUntilExit();
}

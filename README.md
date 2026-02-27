# claude-status-widgets

A modular, customizable status line for [Claude Code](https://claude.com/claude-code) — built with Bun, React/Ink, and TypeScript.

Inspired by [ccstatusline](https://github.com/sirmalloc/ccstatusline).

## Quick Start

Add this to your `~/.claude/settings.json`:

```json
{
  "statusLine": {
    "type": "command",
    "command": "bunx claude-status-widgets@latest",
    "padding": 0
  }
}
```

That's it! Claude Code will pipe status data into the widget on every update.

> **npx alternative:** If you don't have Bun installed, use `npx claude-status-widgets@latest` instead.

## Prerequisites

- **Bun** (recommended) — [Install Bun](https://bun.sh): `curl -fsSL https://bun.sh/install | bash`
- Or **Node.js** 18+ with npx

## Installation Options

### Zero-install (recommended)
`bunx claude-status-widgets@latest` — downloads and runs on first use, auto-updates.

### Global install
```bash
bun install -g claude-status-widgets
# or
npm install -g claude-status-widgets
```

Then use `claude-status` directly in your settings:
```json
{
  "statusLine": {
    "type": "command",
    "command": "claude-status",
    "padding": 0
  }
}
```

## Interactive Configuration

Run the tool directly (not piped) to launch the TUI configurator:

```bash
bunx claude-status-widgets
```

This opens an interactive UI where you can:
- Edit widget lines and order
- Customize themes and colors
- Preview your statusline live
- Get installation instructions

Settings are saved to `~/.config/ccstatus/settings.json`.

## Available Widgets

| Widget | Type | Description |
|--------|------|-------------|
| Branding | `branding` | Colored header with project name |
| Location | `location` | City/state from IP geolocation |
| Weather | `weather` | Temperature & condition |
| Context Bar | `context-bar` | Visual progress bar of context usage |
| Context % | `context-percentage` | Context usage percentage |
| Token Breakdown | `token-breakdown` | Input/output/cache token counts |
| Model Name | `model-name` | Current AI model |
| API Usage | `api-usage` | 5h & 7d rate limit utilization |
| Session Cost | `session-cost` | Session cost in USD |
| Session Duration | `session-duration` | Time elapsed |
| Block Timer | `block-timer` | 5-hour usage block progress |
| Git Status | `git-status` | Branch, changes, sync status |
| PR Dashboard | `pr-dashboard` | Open PRs with approvals |
| Lines Changed | `lines-changed` | Lines added/removed |
| Version | `version` | Claude Code version |
| Output Style | `output-style` | Current output style |
| Vim Mode | `vim-mode` | Vim mode indicator |
| Terminal Width | `terminal-width` | Terminal column count |
| Memory Usage | `memory-usage` | System RAM usage |
| Separator | `separator` | Visual divider between widgets |
| Custom Text | `custom-text` | Static user-defined text |
| Custom Command | `custom-command` | Dynamic shell command output |

## How It Works

Claude Code pipes a JSON payload via stdin on every conversation update. The tool:

1. Parses and validates the JSON input (Zod schema)
2. Loads your settings from `~/.config/ccstatus/settings.json`
3. Fetches auxiliary data in parallel (git, weather, location, API usage, PRs)
4. Renders configured widget lines with ANSI colors
5. Outputs each line to stdout (displayed by Claude Code)

### Responsive Display Modes

The output adapts to your terminal width:
- **Normal** (≥80 cols): Full detail
- **Mini** (55-79 cols): Condensed labels
- **Micro** (35-54 cols): Short labels
- **Nano** (<35 cols): Minimal symbols

## Testing with Example Data

```bash
cat scripts/payload.example.json | bunx claude-status-widgets
```

## Development

```bash
# Install dependencies
bun install

# Run with example data
bun run example

# Run tests
bun run test

# Type check
bun run typecheck

# Build
bun run build
```

## Claude Code Status Line API

This tool consumes the official [Claude Code status line API](https://code.claude.com/docs/en/statusline). Available fields:

| Field | Description |
|-------|-------------|
| `model.id`, `model.display_name` | Current model |
| `context_window.used_percentage` | Context usage % |
| `context_window.total_input_tokens` | Total input tokens |
| `context_window.total_output_tokens` | Total output tokens |
| `cost.total_cost_usd` | Session cost |
| `cost.total_duration_ms` | Session duration |
| `cost.total_lines_added/removed` | Code changes |
| `version` | Claude Code version |
| `vim.mode` | Vim mode (when enabled) |
| `agent.name` | Agent name (when using --agent) |

## License

MIT

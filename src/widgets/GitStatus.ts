import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";
import { basename } from "node:path";

function ageDisplay(epochSec: number): { text: string; color: string } {
  const ageSec = Math.floor(Date.now() / 1000) - epochSec;
  const mins = Math.floor(ageSec / 60);
  const hours = Math.floor(ageSec / 3600);
  const days = Math.floor(ageSec / 86400);

  if (mins < 1) return { text: "now", color: "#7dd3fc" };
  if (hours < 1) return { text: `${mins}m`, color: "#7dd3fc" };
  if (hours < 24) return { text: `${hours}h`, color: "#60a5fa" };
  if (days < 7) return { text: `${days}d`, color: "#3b82f6" };
  return { text: `${days}d`, color: "#6366f1" };
}

export const GitStatusWidget: Widget = {
  name: "git-status",
  displayName: "Git Status",
  description: "Branch, commit age, modified/staged/untracked, stash, sync",
  category: "git",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const git = ctx.gitData;
    if (!git?.isGitRepo) return null;

    const segments: ColorSegment[] = [];
    const dir = basename(ctx.data.workspace?.current_dir ?? ctx.data.cwd ?? ".");

    const icon = { text: "◈ ", fg: "#38bdf8" };
    const sepColor = "#475569";

    if (ctx.displayMode === "nano") {
      segments.push(icon);
      segments.push({ text: dir, fg: "#93c5fd" });
      segments.push({ text: ` ${git.branch}`, fg: "#bae6fd" });
      return { text: segments.map((s) => s.text).join(""), segments };
    }

    if (ctx.displayMode === "micro") {
      segments.push(icon);
      segments.push({ text: dir, fg: "#93c5fd" });
      segments.push({ text: ` ${git.branch}`, fg: "#bae6fd" });
      if (git.lastCommitEpoch > 0) {
        const age = ageDisplay(git.lastCommitEpoch);
        segments.push({ text: ` ${age.text}`, fg: age.color });
      }
      if (git.totalChanged > 0) {
        segments.push({ text: ` *${git.totalChanged}`, fg: "#60a5fa" });
      } else {
        segments.push({ text: " ✓", fg: "#7dd3fc" });
      }
      return { text: segments.map((s) => s.text).join(""), segments };
    }

    // mini + normal
    segments.push(icon);

    if (ctx.displayMode === "normal") {
      segments.push({ text: "PWD: ", fg: "#38bdf8", bold: true });
    }

    segments.push({ text: dir, fg: "#93c5fd" });
    segments.push({ text: " │ ", fg: sepColor, dim: true });

    if (ctx.displayMode === "normal") {
      segments.push({ text: "Branch: ", fg: "#38bdf8", bold: true });
    }
    segments.push({ text: git.branch, fg: "#bae6fd" });

    if (git.lastCommitEpoch > 0) {
      const age = ageDisplay(git.lastCommitEpoch);
      segments.push({ text: " │ ", fg: sepColor, dim: true });
      if (ctx.displayMode === "normal") {
        segments.push({ text: "Age: ", fg: "#38bdf8", bold: true });
      }
      segments.push({ text: age.text, fg: age.color });
    }

    if (ctx.displayMode === "normal" && git.stashCount > 0) {
      segments.push({ text: " │ ", fg: sepColor, dim: true });
      segments.push({ text: "Stash: ", fg: "#38bdf8", bold: true });
      segments.push({ text: String(git.stashCount), fg: "#a5b4fc" });
    }

    segments.push({ text: " │ ", fg: sepColor, dim: true });
    if (git.totalChanged > 0 || git.untracked > 0) {
      if (git.totalChanged > 0) {
        if (ctx.displayMode === "normal") {
          segments.push({ text: "Mod: ", fg: "#38bdf8", bold: true });
        }
        segments.push({ text: String(git.totalChanged), fg: "#60a5fa" });
      }
      if (git.untracked > 0) {
        if (git.totalChanged > 0) segments.push({ text: " " });
        if (ctx.displayMode === "normal") {
          segments.push({ text: "New: ", fg: "#38bdf8", bold: true });
        } else {
          segments.push({ text: "+" });
        }
        segments.push({ text: String(git.untracked), fg: "#3b82f6" });
      }
    } else {
      segments.push({ text: "✓ clean", fg: "#7dd3fc" });
    }

    if (git.ahead > 0 || git.behind > 0) {
      segments.push({ text: " │ ", fg: sepColor, dim: true });
      if (ctx.displayMode === "normal") {
        segments.push({ text: "Sync: ", fg: "#38bdf8", bold: true });
      }
      if (git.ahead > 0) segments.push({ text: `↑${git.ahead}`, fg: "#7dd3fc" });
      if (git.behind > 0) segments.push({ text: `↓${git.behind}`, fg: "#a5b4fc" });
    }

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#38bdf8";
  },
};

import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";
import { basename } from "node:path";

export const GitStatusWidget: Widget = {
  name: "git-status",
  displayName: "Git Status",
  description: "Branch, changes, project name, and working directory",
  category: "git",

  render(_item: WidgetItem, ctx: RenderContext, settings: Settings): WidgetOutput | null {
    const git = ctx.gitData;
    if (!git?.isGitRepo) return null;

    const segments: ColorSegment[] = [];
    const sepChar = settings.separator.character;
    const sepColor = settings.separator.color;
    const dir = basename(ctx.data.workspace?.project_dir ?? ctx.data.workspace?.current_dir ?? ctx.data.cwd ?? ".");
    const cwd = ctx.data.workspace?.current_dir ?? ctx.data.cwd ?? "";

    // Branch with ⎇ symbol (like ccstatusline)
    segments.push({ text: "⎇ ", fg: "#a855f7" });
    segments.push({ text: git.branch, fg: "#c084fc" });

    // File changes like (+M,-U) or ✓ clean
    segments.push({ text: ` ${sepChar} `, fg: sepColor, dim: true });
    if (git.totalChanged > 0 || git.untracked > 0) {
      const mod = git.modified + git.staged;
      segments.push({ text: "(", dim: true });
      if (mod > 0) segments.push({ text: `~${mod}`, fg: "#f59e0b" });
      if (mod > 0 && git.untracked > 0) segments.push({ text: ",", dim: true });
      if (git.untracked > 0) segments.push({ text: `+${git.untracked}`, fg: "#22c55e" });
      segments.push({ text: ")", dim: true });
    } else {
      segments.push({ text: "✓", fg: "#22c55e" });
    }

    // Sync status (ahead/behind)
    if (git.ahead > 0 || git.behind > 0) {
      segments.push({ text: " " });
      if (git.ahead > 0) segments.push({ text: `↑${git.ahead}`, fg: "#22c55e" });
      if (git.behind > 0) segments.push({ text: `↓${git.behind}`, fg: "#f59e0b" });
    }

    // Project name
    segments.push({ text: ` ${sepChar} `, fg: sepColor, dim: true });
    segments.push({ text: dir, fg: "#93c5fd" });

    // CWD (truncated if too long, only in normal/mini mode)
    if (ctx.displayMode === "normal" || ctx.displayMode === "mini") {
      segments.push({ text: ` ${sepChar} `, fg: sepColor, dim: true });
      segments.push({ text: "cwd: ", dim: true });
      const maxCwdLen = ctx.displayMode === "normal" ? 40 : 25;
      const truncatedCwd = cwd.length > maxCwdLen ? cwd.slice(0, maxCwdLen) + "..." : cwd;
      segments.push({ text: truncatedCwd, fg: "#94a3b8" });
    }

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#a855f7";
  },
};

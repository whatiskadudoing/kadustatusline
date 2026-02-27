import type { Widget, WidgetItem, WidgetOutput, ColorSegment } from "../types/Widget.ts";
import type { RenderContext } from "../types/RenderContext.ts";
import type { Settings } from "../types/Settings.ts";

export const PrDashboardWidget: Widget = {
  name: "pr-dashboard",
  displayName: "PR Dashboard",
  description: "Open PRs with approval/draft/comment indicators",
  category: "git",

  render(_item: WidgetItem, ctx: RenderContext, _settings: Settings): WidgetOutput | null {
    const prs = ctx.prData;
    if (!prs) return null;

    const segments: ColorSegment[] = [];
    const sepColor = "#475569";

    segments.push({ text: "◎ ", fg: "#2dd4bf" });

    if (ctx.displayMode === "mini" || ctx.displayMode === "normal") {
      segments.push({ text: "PRs: ", fg: "#22d3ee", bold: true });
    }

    if (prs.length === 0) {
      segments.push({ text: "none open", fg: "#64748b", dim: true });
      return { text: segments.map((s) => s.text).join(""), segments };
    }

    if (ctx.displayMode === "nano") {
      segments.push({ text: `${prs.length}PRs`, fg: "#cbd5e1" });
      return { text: segments.map((s) => s.text).join(""), segments };
    }

    const maxPrs = ctx.displayMode === "micro" ? 3 : prs.length;

    for (let i = 0; i < Math.min(maxPrs, prs.length); i++) {
      const pr = prs[i]!;

      if (i > 0) {
        segments.push({ text: "  │", fg: sepColor, dim: true });
      }

      if (pr.isDraft) {
        const title = pr.title.slice(0, ctx.displayMode === "normal" ? 20 : 15);
        segments.push({ text: `  #${pr.number} ${title} draft`, fg: "#64748b", dim: true });
        continue;
      }

      if (ctx.displayMode === "micro") {
        segments.push({ text: ` #${pr.number}`, fg: "#67e8f9" });
        if (pr.reviewDecision === "APPROVED" || pr.approvals >= 2) {
          segments.push({ text: "✓", fg: "#4ade80" });
        } else if (pr.reviewDecision === "CHANGES_REQUESTED") {
          segments.push({ text: "✗", fg: "#fb7185" });
        }
      } else {
        segments.push({ text: `  #${pr.number}`, fg: "#67e8f9" });

        if (ctx.displayMode === "normal") {
          const title = pr.title.slice(0, 20);
          segments.push({ text: ` ${title}`, fg: "#cbd5e1" });
        }

        if (pr.approvals >= 2) {
          segments.push({ text: " ✓✓ ready", fg: "#4ade80", bold: true });
        } else if (pr.approvals >= 1) {
          segments.push({ text: " ✓", fg: "#4ade80" });
        }

        if (pr.reviewDecision === "CHANGES_REQUESTED") {
          segments.push({ text: " ✗changes", fg: "#fb7185" });
        }

        if (pr.commentsCount > 0) {
          segments.push({ text: ` 💬${pr.commentsCount}`, fg: "#94a3b8" });
        }
      }
    }

    return { text: segments.map((s) => s.text).join(""), segments };
  },

  getDefaultColor() {
    return "#2dd4bf";
  },
};

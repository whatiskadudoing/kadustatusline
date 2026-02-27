import type { Widget } from "../types/Widget.ts";

import { BrandingWidget } from "./Branding.ts";
import { LocationWidget } from "./Location.ts";
import { WeatherWidget } from "./Weather.ts";
import { ContextBarWidget } from "./ContextBar.ts";
import { ApiUsageWidget } from "./ApiUsage.ts";
import { GitStatusWidget } from "./GitStatus.ts";
import { PrDashboardWidget } from "./PrDashboard.ts";
import { SessionCostWidget } from "./SessionCost.ts";
import { SessionDurationWidget } from "./SessionDuration.ts";
import { ModelNameWidget } from "./ModelName.ts";
import { TokenBreakdownWidget } from "./TokenBreakdown.ts";
import { BlockTimerWidget } from "./BlockTimer.ts";
import { TerminalWidthWidget } from "./TerminalWidth.ts";
import { MemoryUsageWidget } from "./MemoryUsage.ts";
import { SeparatorWidget } from "./Separator.ts";
import { CustomTextWidget } from "./CustomText.ts";
import { CustomCommandWidget } from "./CustomCommand.ts";
import { VersionWidget } from "./Version.ts";
import { OutputStyleWidget } from "./OutputStyle.ts";
import { VimModeWidget } from "./VimMode.ts";
import { LinesChangedWidget } from "./LinesChanged.ts";
import { ContextPercentageWidget } from "./ContextPercentage.ts";

const widgets: Widget[] = [
  BrandingWidget,
  LocationWidget,
  WeatherWidget,
  ContextBarWidget,
  ApiUsageWidget,
  GitStatusWidget,
  PrDashboardWidget,
  SessionCostWidget,
  SessionDurationWidget,
  ModelNameWidget,
  TokenBreakdownWidget,
  BlockTimerWidget,
  TerminalWidthWidget,
  MemoryUsageWidget,
  SeparatorWidget,
  CustomTextWidget,
  CustomCommandWidget,
  VersionWidget,
  OutputStyleWidget,
  VimModeWidget,
  LinesChangedWidget,
  ContextPercentageWidget,
];

export const widgetRegistry = new Map<string, Widget>(
  widgets.map((w) => [w.name, w]),
);

export function getWidget(type: string): Widget | undefined {
  return widgetRegistry.get(type);
}

export function getAllWidgets(): Widget[] {
  return widgets;
}

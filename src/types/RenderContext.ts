import type { StatusData } from "./StatusData.ts";
import type { DisplayMode } from "./DisplayMode.ts";

// ---------------------------------------------------------------------------
// Auxiliary data interfaces fetched / computed before rendering
// ---------------------------------------------------------------------------

export interface GitData {
  branch: string;
  stashCount: number;
  modified: number;
  staged: number;
  untracked: number;
  totalChanged: number;
  ahead: number;
  behind: number;
  lastCommitEpoch: number;
  isGitRepo: boolean;
}

export interface LocationData {
  city: string;
  state: string;
  lat: number;
  lon: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
}

export interface UsageData {
  fiveHour: {
    utilization: number;
    resetsAt: string;
  };
  sevenDay: {
    utilization: number;
    resetsAt: string;
  };
}

export interface PrData {
  number: number;
  title: string;
  isDraft: boolean;
  reviewDecision: string;
  approvals: number;
  commentsCount: number;
}

// ---------------------------------------------------------------------------
// RenderContext — the bag of data every widget receives at render time
// ---------------------------------------------------------------------------

export interface RenderContext {
  data: StatusData;
  displayMode: DisplayMode;
  terminalWidth: number;
  isPreview: boolean;
  lineIndex: number;
  gitData?: GitData;
  locationData?: LocationData;
  weatherData?: WeatherData;
  usageData?: UsageData;
  prData?: PrData[];
}

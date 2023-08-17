import type { InputViewerOpts } from "@jakzo/vr-input-viewer";

export interface Settings
  extends Pick<
    InputViewerOpts,
    "controllerLayout" | "hideHud" | "hidePositions" | "showStats"
  > {
  host: string;
}

export type Logger = Record<
  "info" | "warn" | "error",
  (...data: unknown[]) => void
>;

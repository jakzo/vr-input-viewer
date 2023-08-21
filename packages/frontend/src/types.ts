import type { InputViewerOpts } from "@jakzo/vr-input-viewer";

export interface Settings
  extends Pick<
    InputViewerOpts,
    "controllerLayout" | "hideHud" | "hidePositions" | "showStats"
  > {
  inputSource: string;
  inputSourceOpts: Record<string, Record<string, unknown>>;
}

export type Logger = Record<
  "info" | "warn" | "error",
  (...data: unknown[]) => void
>;

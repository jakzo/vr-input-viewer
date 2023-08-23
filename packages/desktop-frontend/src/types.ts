import type { TrackedDevicePose_t } from "openvr";

export interface VrFfiBridge {
  openvrIsAvailable: () => Promise<boolean>;
  openvrInit: () => Promise<void>;
  openvrGetInputs: () => Promise<{
    hmd: TrackedDevicePose_t | null;
    left: TrackedDevicePose_t | null;
    right: TrackedDevicePose_t | null;
  }>;
  openvrShutdown: () => Promise<void>;
}

declare global {
  interface Window {
    vrFfiBridge: VrFfiBridge;
  }
}

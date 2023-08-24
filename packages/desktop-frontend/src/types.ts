import type { OpenVR } from "@jakzo/vr-ffi";

export interface VrFfiBridge {
  openvrIsAvailable: () => Promise<boolean>;
  openvrInit: () => Promise<void>;
  openvrGetInputs: () => Promise<{
    hmd: OpenVR.TrackedDevicePose | null;
    left: OpenVR.TrackedDevicePose | null;
    right: OpenVR.TrackedDevicePose | null;
  }>;
  openvrShutdown: () => Promise<void>;
}

declare global {
  interface Window {
    vrFfiBridge: VrFfiBridge;
  }
}

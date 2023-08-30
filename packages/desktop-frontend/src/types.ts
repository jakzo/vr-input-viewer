import type { OpenVR } from "@jakzo/vr-ffi";

export interface VrFfiBridge {
  openvrIsAvailable: () => Promise<boolean>;
  openvrInit: () => Promise<void>;
  openvrGetInputs: () => Promise<
    Record<
      "hmd" | "left" | "right",
      | {
          pose: OpenVR.TrackedDevicePose | undefined;
          state: OpenVR.VRControllerState | undefined;
        }
      | undefined
    >
  >;
  openvrShutdown: () => Promise<void>;
}

declare global {
  interface Window {
    vrFfiBridge: VrFfiBridge;
    platform: { getPlatform: () => NodeJS.Platform };
  }
}

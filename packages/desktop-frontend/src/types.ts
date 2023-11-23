import type { OpenVR } from "@jakzo/vr-ffi";

export interface VrFfiBridge {
  openvrIsAvailable: () => Promise<boolean>;
  openvrInit: () => Promise<void>;
  openvrGetDeviceProp: (
    deviceIndex: number,
    prop: OpenVR.TrackedDeviceProperty_String,
  ) => Promise<string>;
  openvrGetInputs: () => Promise<
    Record<
      "hmd" | "left" | "right",
      | {
          index: number;
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

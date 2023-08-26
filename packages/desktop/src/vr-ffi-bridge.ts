// @ts-expect-error - type-only import of ESM
import type { VrFfiBridge } from "@jakzo/vr-input-viewer-desktop-frontend";
import { OpenVR } from "@jakzo/vr-ffi";
import { declareBridgeApi } from "./tipc/main";

let ivrSystem: ReturnType<typeof OpenVR.Init> | undefined;

export const vrFfiBridge = declareBridgeApi({
  async openvrIsAvailable() {
    return OpenVR.IsRuntimeInstalled() && OpenVR.IsHmdPresent();
  },
  async openvrInit() {
    ivrSystem = OpenVR.Init(OpenVR.VRApplicationType.Background);
  },
  async openvrGetInputs() {
    if (!ivrSystem) throw new Error("openvrInit() must be called first");

    const indexHmd = ivrSystem.GetSortedTrackedDeviceIndicesOfClass(
      OpenVR.TrackedDeviceClass.HMD,
    )[0];
    const indexControllerLeft =
      ivrSystem.GetTrackedDeviceIndexForControllerRole(
        OpenVR.TrackedControllerRole.LeftHand,
      );
    const indexControllerRight =
      ivrSystem.GetTrackedDeviceIndexForControllerRole(
        OpenVR.TrackedControllerRole.RightHand,
      );

    const poses = ivrSystem.GetDeviceToAbsoluteTrackingPose(
      OpenVR.TrackingUniverseOrigin.Standing,
      0,
    );

    return {
      hmd:
        indexHmd !== undefined
          ? { pose: poses[indexHmd], state: undefined }
          : undefined,
      left:
        indexControllerLeft !== undefined
          ? {
              pose: poses[indexControllerLeft],
              state: ivrSystem.GetControllerState(indexControllerLeft),
            }
          : undefined,
      right:
        indexControllerRight !== undefined
          ? {
              pose: poses[indexControllerRight],
              state: ivrSystem.GetControllerState(indexControllerRight),
            }
          : undefined,
    };
  },
  async openvrShutdown() {
    OpenVR.Shutdown();
  },
} satisfies VrFfiBridge);

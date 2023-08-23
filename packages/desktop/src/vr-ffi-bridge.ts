// @ts-expect-error - type-only import of ESM
import type { VrFfiBridge } from "@jakzo/vr-input-viewer-desktop-frontend";
import { OpenVR } from "@jakzo/vr-ffi";
import { declareBridgeApi } from "./tipc/main";

let ivrSystem: ReturnType<typeof OpenVR.VR_Init> | undefined;

export const vrFfiBridge = declareBridgeApi({
  async openvrIsAvailable() {
    return OpenVR.VR_IsRuntimeInstalled() && OpenVR.VR_IsHmdPresent();
  },
  async openvrInit() {
    ivrSystem = OpenVR.VR_Init(OpenVR.EVRApplicationType.Background);
  },
  async openvrGetInputs() {
    if (!ivrSystem) throw new Error("openvrInit() must be called first");

    const indexesHmd = ivrSystem.GetSortedTrackedDeviceIndicesOfClass(
      OpenVR.ETrackedDeviceClass.HMD,
    );
    const indexHmd = indexesHmd[0];

    const indexesController = ivrSystem.GetSortedTrackedDeviceIndicesOfClass(
      OpenVR.ETrackedDeviceClass.Controller,
    );
    // TODO: Use ivrSystem.GetControllerRoleForTrackedDeviceIndex() for hand
    const indexControllerLeft = indexesController.find((index) => index === 1);
    const indexControllerRight = indexesController.find((index) => index === 2);

    const poses = ivrSystem.GetDeviceToAbsoluteTrackingPose(
      OpenVR.ETrackingUniverseOrigin.Standing,
      0,
    );

    return {
      hmd: (indexHmd !== undefined && poses[indexHmd]) || null,
      left:
        (indexControllerLeft !== undefined && poses[indexControllerLeft]) ||
        null,
      right:
        (indexControllerRight !== undefined && poses[indexControllerRight]) ||
        null,
    };
  },
  async openvrShutdown() {
    OpenVR.VR_Shutdown();
  },
} satisfies VrFfiBridge);

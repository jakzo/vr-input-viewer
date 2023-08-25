import {
  TrackedDeviceClass,
  TrackedDeviceResult,
  TrackingUniverseOrigin,
  VRApplicationType,
} from "./types";

declare class IVRSystem {
  GetDeviceToAbsoluteTrackingPose(
    origin: TrackingUniverseOrigin,
    predictedSecondsToPhotonsFromNow: number,
  ): TrackedDeviceResult;
  GetSortedTrackedDeviceIndicesOfClass(device: TrackedDeviceClass): number[];
}

interface OpenvrNative {
  IVRSystem: typeof IVRSystem;
  Init(type: VRApplicationType): IVRSystem;
  Shutdown(): IVRSystem;
  IsHmdPresent(): boolean;
  IsRuntimeInstalled(): boolean;
}

export const native = require("../../build/Release/openvr") as OpenvrNative;

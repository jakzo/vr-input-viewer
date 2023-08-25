import assert from "assert";
import { OpenVR } from "../src";

console.log(
  "Note that this test requires SteamVR to be running and headset connected",
);

assert(
  OpenVR.IsRuntimeInstalled() === true,
  "IsRuntimeInstalled() did not return a boolean",
);

assert(
  OpenVR.IsHmdPresent() === true,
  "IsHmdPresent() did not return a boolean",
);

assert(typeof OpenVR.IVRSystem === "function", "IVRSystem is not a function");

assert.throws(
  () => new OpenVR.IVRSystem(),
  "IVRSystem is constructable from JS",
);

const system = OpenVR.Init(OpenVR.VRApplicationType.Background);
assert(
  system instanceof OpenVR.IVRSystem,
  "Init() did not return an IVRSystem",
);

const hmdIndices = system.GetSortedTrackedDeviceIndicesOfClass(
  OpenVR.TrackedDeviceClass.HMD,
);
console.log({ hmdIndices });
assert(
  JSON.stringify(hmdIndices) === "[0]",
  "GetSortedTrackedDeviceIndicesOfClass() did not return [0]",
);

const poses = system.GetDeviceToAbsoluteTrackingPose(
  OpenVR.TrackingUniverseOrigin.Standing,
  0,
);
console.log({ poses: Array.isArray(poses) ? poses[0] : poses });
const poseKeys = new Set([
  "deviceToAbsoluteTracking",
  "velocity",
  "angularVelocity",
  "trackingResult",
  "poseIsValid",
  "deviceIsConnected",
]);
assert(
  Array.isArray(poses) &&
    Object.keys(poses[0]!).length === poseKeys.size &&
    Object.keys(poses[0]!).every((key) => poseKeys.has(key)),
  "GetDeviceToAbsoluteTrackingPose() did not return the right shape",
);

console.log("Pass!");

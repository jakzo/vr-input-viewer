export * from "./typescript";

import { OpenvrNative } from "./native";
export const { Init, Shutdown, IsHmdPresent, IsRuntimeInstalled, IVRSystem } =
  require("../../build/Release/openvr.node") as OpenvrNative;

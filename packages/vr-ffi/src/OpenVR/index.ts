export * from "./types";

import { native } from "./native";
export const { Init, Shutdown, IsHmdPresent, IsRuntimeInstalled, IVRSystem } =
  native;

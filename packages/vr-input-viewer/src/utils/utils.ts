import * as THREE from "three";

export type Handedness = "left" | "right";
export type VirtualXRInputSource = DeepMutable<XRInputSource> & {
  handedness: Handedness;
  gamepad: DeepMutable<Gamepad>;
};
export type Transforms = Record<"hmd" | Handedness, Transform>;

export type DeepMutable<T> = { -readonly [P in keyof T]: DeepMutable<T[P]> };

export class Transform {
  constructor(
    public position = new THREE.Vector3(),
    public rotation = new THREE.Quaternion(),
  ) {}
}

export const throttle = (ms: number, fn: () => void): (() => void) => {
  let isWaiting = false;
  let isCalled = false;
  const onWaited = () => {
    const wasCalled = isCalled;
    isWaiting = isCalled = false;
    if (wasCalled) fn();
  };
  return function throttled() {
    if (isWaiting) {
      isCalled = true;
      return;
    }
    isWaiting = true;
    setTimeout(onWaited, ms);
    fn();
  };
};

export const withBaseUrl = (relativeUrl: string) => {
  const baseUrl = window.location.toString();
  return new URL(
    relativeUrl,
    baseUrl + (baseUrl.endsWith(".html") || baseUrl.endsWith("/") ? "" : "/"),
  ).toString();
};

import * as THREE from "three";

export type Handedness = "left" | "right";
export type Transforms = Record<"hmd" | Handedness, Transform>;

export class Transform {
  constructor(
    public position = new THREE.Vector3(),
    public rotation = new THREE.Quaternion(),
  ) {}
}

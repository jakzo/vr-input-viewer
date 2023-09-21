import * as THREE from "three";
import { Handedness, Transforms } from "../utils/types.js";
import { RollingMedian } from "../utils/RollingMedian.js";

export class HeightTrackers {
  container = new THREE.Object3D();
  trackers: Record<keyof Transforms, THREE.Mesh>;
  heightLog = new RollingMedian<[number, number]>((a, b) => a[1] - b[1]);
  heightMarker: THREE.Mesh;

  constructor(
    public transforms: Transforms,
    public medianHeightWindow: number,
    public playerHeight?: number | undefined,
  ) {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.5,
      side: THREE.FrontSide,
    });

    this.trackers = {
      hmd: this.createTracker(material),
      left: this.createTracker(material),
      right: this.createTracker(material),
    };
    this.container.add(this.trackers.hmd);

    this.heightMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.03),
      new THREE.MeshBasicMaterial({ color: "#55cccc" }),
    );
    this.container.add(this.heightMarker);
  }

  createTracker(material: THREE.Material): THREE.Mesh {
    const geometry = new THREE.CylinderGeometry(0.01, 0.01, 1, 32);
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  update() {
    for (const key of Object.keys(this.transforms) as (keyof Transforms)[]) {
      const position = this.transforms[key].position;
      const tracker = this.trackers[key];
      tracker.position.set(position.x, position.y / 2, position.z);
      tracker.scale.y = position.y;
    }

    const now = Date.now();
    const windowStart = now - this.medianHeightWindow * 1000;
    while ((this.heightLog.first()?.[0] ?? Infinity) < windowStart) {
      this.heightLog.shift();
    }
    const hmdPos = this.transforms.hmd.position;
    this.heightLog.push([now, hmdPos.y]);
    this.heightMarker.position.set(
      hmdPos.x,
      this.playerHeight ?? this.heightLog.median()?.[1] ?? 0,
      hmdPos.z,
    );
  }

  onControllerConnected(handedness: Handedness) {
    this.container.add(this.trackers[handedness]);
  }

  onControllerDisconnected(handedness: Handedness) {
    this.container.remove(this.trackers[handedness]);
  }
}

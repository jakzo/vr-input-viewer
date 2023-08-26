import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

import { createEnvironment } from "../Environment.js";
import { createHeadset } from "./Headset.js";
import { VirtualXRInputSource, throttle } from "../utils/utils.js";
import { Grid } from "./Grid.js";
import { HeightTrackers } from "./HeightTrackers.js";
import { Transforms, Handedness } from "../utils/types.js";

export interface PositionViewerOpts {
  container: HTMLElement;
  transforms: Transforms;
  showStats?: boolean | undefined;
  assetsBaseUrl?: string | undefined;
  webxrInputProfilesBaseUrl?: string | undefined;
  headsetName?: string | undefined;
}

export class PositionViewer {
  stats: Stats | undefined;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  orbit: OrbitControls;
  grid: Grid = new Grid(0.8, 0.25, 0.05);
  heightTrackers: HeightTrackers;
  renderer: THREE.WebGLRenderer;
  resizeObserver: ResizeObserver;
  controllerModelFactory: XRControllerModelFactory =
    new XRControllerModelFactory();
  controllers: Record<
    "left" | "right",
    { gripSpace: THREE.Group; container: THREE.Group }
  >;
  headset: THREE.Object3D;
  transforms: [THREE.Object3D, Transforms[keyof Transforms]][];
  loader = new GLTFLoader();
  headsetName: string;

  constructor(public opts: PositionViewerOpts) {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.camera.position.set(0, 1.8, 1.4);

    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    const setSize = throttle(100, () => {
      const width = opts.container.clientWidth;
      const height = opts.container.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
    setSize();
    this.resizeObserver = new ResizeObserver(setSize);
    this.resizeObserver.observe(opts.container);
    opts.container.append(this.renderer.domElement);

    this.controllers = {
      left: this.createController(),
      right: this.createController(),
    };

    this.headsetName = opts.headsetName ?? "oculus-quest2";
    this.headset = createHeadset(this.headsetName, opts.assetsBaseUrl);
    this.scene.add(this.headset);

    if (opts.webxrInputProfilesBaseUrl)
      this.controllerModelFactory.path = opts.webxrInputProfilesBaseUrl.replace(
        /\/$/,
        "",
      );

    this.transforms = [
      [this.headset, opts.transforms.hmd],
      [this.controllers.left.container, opts.transforms.left],
      [this.controllers.right.container, opts.transforms.right],
    ];

    this.stats = opts.showStats ? Stats() : undefined;
    if (this.stats) opts.container.appendChild(this.stats.dom);

    this.scene.add(createEnvironment());

    this.scene.add(this.grid.plane);

    this.heightTrackers = new HeightTrackers(opts.transforms, 60);
    this.scene.add(this.heightTrackers.container);

    this.orbit = new OrbitControls(this.camera, this.renderer.domElement);
    this.orbit.target = new THREE.Vector3(0, 0.9, 0);
    this.orbit.update();

    this.renderer.setAnimationLoop(this.animate);
  }

  private createController() {
    const container = new THREE.Group();
    const gripSpace = new THREE.Group();
    gripSpace.add(this.controllerModelFactory.createControllerModel(gripSpace));
    // TODO: Figure out what's going on with this offset
    gripSpace.position.z += 0.08;
    this.scene.add(container);
    return { gripSpace, container };
  }

  onControllerConnected(xrInputSource: VirtualXRInputSource) {
    const { gripSpace, container } = this.controllers[xrInputSource.handedness];
    gripSpace.dispatchEvent({ type: "connected", data: xrInputSource });
    container.add(gripSpace);
    this.heightTrackers.onControllerConnected(xrInputSource.handedness);
  }

  onControllerDisconnected(handedness: Handedness) {
    const { gripSpace, container } = this.controllers[handedness];
    gripSpace.dispatchEvent({ type: "disconnected" });
    container.remove(gripSpace);
    this.heightTrackers.onControllerDisconnected(handedness);
  }

  remove() {
    this.renderer.setAnimationLoop(null);
    this.stats?.dom.remove();
    this.renderer.domElement.remove();
    this.resizeObserver.disconnect();
  }

  animate = (_time: number): void => {
    this.stats?.begin();

    for (const [obj, { position, rotation }] of this.transforms) {
      obj.position.copy(position);
      obj.setRotationFromQuaternion(rotation);
    }

    this.grid.update();
    this.heightTrackers.update();

    this.renderer.render(this.scene, this.camera);

    this.stats?.end();
  };
}

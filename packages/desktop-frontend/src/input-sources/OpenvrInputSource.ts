import * as THREE from "three";
import {
  VrInputSource,
  VrInputSourceArgs,
  type VrInputSourceConfig,
} from "@jakzo/vr-input-viewer-frontend";
import { OpenVR } from "@jakzo/vr-ffi";
import type { Handedness, Transform } from "@jakzo/vr-input-viewer";

const tempMatrix = new THREE.Matrix4();

const BUTTON_MAPPINGS: bigint[] = [33n, 2n, 32n, 0n, 7n, 1n];

export interface OpenvrInputSourceOpts {}

export class OpenvrInputSource extends VrInputSource<OpenvrInputSourceOpts> {
  static config: VrInputSourceConfig<OpenvrInputSourceOpts> = {
    name: "OpenVR",
    opts: {},
  };

  override type = OpenvrInputSource;

  retryDelay = 2_000;
  retryTimeout: number | undefined;
  isInitialized = false;
  indexHmd: number | undefined;
  indexControllers: Record<Handedness, number | undefined> = {
    left: undefined,
    right: undefined,
  };

  constructor(...args: VrInputSourceArgs<OpenvrInputSourceOpts>) {
    super(...args);

    void this.checkIfHmdPresentOrInit();
  }

  override onOptsChanged() {}

  scheduleCheckIfHmdPresent() {
    if (this.isInitialized || this.retryTimeout) return;
    this.retryTimeout = window.setTimeout(
      this.checkIfHmdPresentOrInit,
      this.retryDelay,
    );
  }

  unscheduleCheckIfHmdPresent() {
    if (!this.retryTimeout) return;
    clearTimeout(this.retryTimeout);
    this.retryTimeout = undefined;
  }

  checkIfHmdPresentOrInit = async () => {
    try {
      this.retryTimeout = undefined;
      if (this.isInitialized) {
        this.setAvailable(true);
      } else if (this.isStarted) {
        void this.init();
      } else {
        this.setAvailable(await window.vrFfiBridge.openvrIsAvailable());
      }
    } finally {
      this.scheduleCheckIfHmdPresent();
    }
  };

  override onStart() {
    this.unscheduleCheckIfHmdPresent();
    void this.init();
  }

  async init() {
    try {
      await window.vrFfiBridge.openvrInit();
      this.isInitialized = true;
      this.setAvailable(true);
    } catch (err) {
      this.setAvailable(false);
      this.scheduleCheckIfHmdPresent();
      throw err;
    }
  }

  override async onUpdate() {
    if (!this.inputViewer || !this.isInitialized) return;

    const inputs = await window.vrFfiBridge.openvrGetInputs();

    const wasHeadsetConnected = !!this.inputViewer.headsetProfiles;
    const isHeadsetConnected = !!inputs.hmd;
    if (!wasHeadsetConnected && isHeadsetConnected) {
      // TODO: Use ivrSystem.GetStringTrackedDeviceProperty(Prop_ModelNumber)
      // to get profiles
      this.inputViewer.connectHeadset();
    } else if (wasHeadsetConnected && !isHeadsetConnected) {
      this.inputViewer.disconnectHeadset();
    }
    if (inputs.hmd?.pose)
      this.setTransform(inputs.hmd.pose, this.inputViewer.transforms.hmd);

    for (const handedness of ["left", "right"] as const) {
      const controller = inputs[handedness];
      const wasConnected = !!this.inputViewer.controllers[handedness];
      const isConnected = !!controller;
      if (!wasConnected && isConnected) {
        // TODO: Use ivrSystem.GetStringTrackedDeviceProperty(Prop_ModelNumber)
        // to get profiles
        this.inputViewer.connectController(handedness);
      } else if (wasConnected && !isConnected) {
        this.inputViewer.disconnectController(handedness);
      }
      if (controller?.pose)
        this.setTransform(
          controller.pose,
          this.inputViewer.transforms[handedness],
        );
      if (controller?.state) {
        const gamepad = this.inputViewer.controllers[handedness]?.gamepad;
        if (gamepad) {
          for (const [buttonIdx, i] of BUTTON_MAPPINGS.entries()) {
            const button = gamepad.buttons[buttonIdx];
            if (!button) continue;
            const bit = 1n << i;
            button.touched = (controller.state.buttonTouched & bit) !== 0n;
            button.pressed = (controller.state.buttonPressed & bit) !== 0n;
            button.value = button.pressed ? 1 : 0;
          }
          gamepad.axes[2] = controller.state.axis[0]!.x;
          gamepad.axes[3] = -controller.state.axis[0]!.y;
          gamepad.buttons[0]!.value = controller.state.axis[1]!.x;
          gamepad.buttons[1]!.value = controller.state.axis[2]!.x;
        }
      }
    }
  }

  setTransform(pose: OpenVR.TrackedDevicePose, transform: Transform) {
    const m = pose.deviceToAbsoluteTracking;
    tempMatrix.set(
      m[0][0],
      m[0][1],
      m[0][2],
      m[0][3],
      m[1][0],
      m[1][1],
      m[1][2],
      m[1][3],
      m[2][0],
      m[2][1],
      m[2][2],
      m[2][3],
      0,
      0,
      0,
      1,
    );
    tempMatrix.decompose(
      transform.position,
      transform.rotation,
      new THREE.Vector3(),
    );
  }

  override onStop() {
    this.scheduleCheckIfHmdPresent();
    this.close();
  }

  override onDestroy() {
    this.unscheduleCheckIfHmdPresent();
    this.close();
  }

  close() {
    void window.vrFfiBridge.openvrShutdown();
    this.isInitialized = false;
  }
}

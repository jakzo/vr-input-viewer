import * as THREE from "three";
import {
  VrInputSource,
  type VrInputSourceConfig,
} from "@jakzo/vr-input-viewer-frontend";
import { OpenVR } from "@jakzo/vr-ffi";
import {
  Handedness,
  Transform,
} from "packages/vr-input-viewer/src/utils/utils.js";

export interface OpenvrInputSourceOpts {}

export class OpenvrInputSource extends VrInputSource<OpenvrInputSourceOpts> {
  static config: VrInputSourceConfig<OpenvrInputSourceOpts> = {
    name: "OpenVR",
    opts: {},
  };

  override type = OpenvrInputSource;

  retryDelay = 15_000;
  retryTimeout: number | undefined;
  ivrSystem: OpenVR.IVRSystem | undefined;
  indexHmd: number | undefined;
  indexControllers: Record<Handedness, number | undefined> = {
    left: undefined,
    right: undefined,
  };

  override onOptsChanged(
    _newOpts: OpenvrInputSourceOpts,
    _prevOpts: OpenvrInputSourceOpts | undefined,
  ) {
    this.scheduleCheckIfHmdPresent();
  }

  scheduleCheckIfHmdPresent() {
    if (!this.ivrSystem && !this.retryTimeout)
      this.retryTimeout = window.setTimeout(
        this.checkIfHmdPresent,
        this.retryDelay,
      );
  }

  checkIfHmdPresent = () => {
    this.scheduleCheckIfHmdPresent();
    this.setAvailable(
      !!this.ivrSystem ||
        (OpenVR.VR_IsRuntimeInstalled() && OpenVR.VR_IsHmdPresent()),
    );
  };

  override onStart() {
    this.ivrSystem = OpenVR.VR_Init(OpenVR.EVRApplicationType.Background);
    clearTimeout(this.retryTimeout);
  }

  override onUpdate() {
    if (!this.inputViewer || !this.ivrSystem) return;

    const indexesHmd = this.ivrSystem.GetSortedTrackedDeviceIndicesOfClass(
      OpenVR.ETrackedDeviceClass.HMD,
    );
    if (indexesHmd[0] !== this.indexHmd)
      this.indexHmd = indexesHmd === undefined ? indexesHmd[0] : undefined;

    const indexesController =
      this.ivrSystem.GetSortedTrackedDeviceIndicesOfClass(
        OpenVR.ETrackedDeviceClass.Controller,
      );
    // TODO: Use ivrSystem.GetControllerRoleForTrackedDeviceIndex() for hand
    this.indexControllers.left = indexesController.find((index) => index === 1);
    this.indexControllers.right = indexesController.find(
      (index) => index === 2,
    );

    const poses = this.ivrSystem.GetDeviceToAbsoluteTrackingPose(
      OpenVR.ETrackingUniverseOrigin.Standing,
      0,
    );

    const getPose = (index: number) => {
      const pose = poses?.[index];
      return pose?.bPoseIsValid && pose.bDeviceIsConnected ? pose : undefined;
    };

    const hmd =
      this.indexHmd !== undefined ? getPose(this.indexHmd) : undefined;
    const wasHeadsetConnected = !!this.inputViewer.headsetProfiles;
    const isHeadsetConnected = !!hmd;
    if (!wasHeadsetConnected && isHeadsetConnected) {
      // TODO: Use ivrSystem.GetStringTrackedDeviceProperty(Prop_ModelNumber)
      // to get profiles
      this.inputViewer.connectHeadset();
    } else if (wasHeadsetConnected && !isHeadsetConnected) {
      this.inputViewer.disconnectHeadset();
    }
    if (hmd) this.setTransform(hmd, this.inputViewer.transforms.hmd);

    for (const [handedness, index] of Object.entries(indexesController) as [
      Handedness,
      number | undefined,
    ][]) {
      const pose = index !== undefined ? getPose(index) : undefined;
      const wasConnected = !!this.inputViewer.controllers[handedness];
      const isConnected = !!pose;
      if (!wasConnected && isConnected) {
        // TODO: Use ivrSystem.GetStringTrackedDeviceProperty(Prop_ModelNumber)
        // to get profiles
        this.inputViewer.connectController(handedness);
      } else if (wasConnected && !isConnected) {
        this.inputViewer.disconnectController(handedness);
      }
      if (pose)
        this.setTransform(pose, this.inputViewer.transforms[handedness]);
    }
  }

  setTransform(pose: OpenVR.TrackedDevicePose_t, transform: Transform) {
    const matrix = new THREE.Matrix4().fromArray(
      pose.mDeviceToAbsoluteTracking.flat(),
    );
    matrix.decompose(
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
    clearTimeout(this.retryTimeout);
    this.close();
  }

  close() {
    OpenVR.VR_Shutdown();
    this.ivrSystem = undefined;
  }
}

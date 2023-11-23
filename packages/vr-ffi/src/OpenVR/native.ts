import {
  TrackedControllerRole,
  TrackedDeviceClass,
  TrackedDeviceIndex,
  TrackedDevicePose,
  TrackedDeviceProperty_String,
  TrackingUniverseOrigin,
  VRApplicationType,
  VRControllerState,
} from "./typescript";

declare class IVRSystem {
  /**
   * Get a sorted array of device indices of a given class of tracked devices (e.g. controllers).  Devices are sorted right to left
   * relative to the specified tracked device (default: hmd -- pass in -1 for absolute tracking space).  Returns the number of devices
   * in the list, or the size of the array needed if not large enough.
   */
  GetSortedTrackedDeviceIndicesOfClass(device: TrackedDeviceClass): number[];

  /**
   * Returns the device index associated with a specific role, for example the left hand or the right hand. This function is deprecated in favor of the new IVRInput system.
   *
   * Compare result with {@link TrackedDeviceIndex} for special values like
   * invalid index.
   */
  GetTrackedDeviceIndexForControllerRole(
    deviceType: TrackedControllerRole,
  ): number | TrackedDeviceIndex;

  /** Returns a string property. If the device index is not valid or the property is not a string type this function will
   * throw. */
  GetStringTrackedDeviceProperty(
    deviceIndex: number,
    prop: TrackedDeviceProperty_String,
  ): string;

  /**
   * The pose that the tracker thinks that the HMD will be in at the specified number of seconds into the
   * future. Pass 0 to get the state at the instant the method is called. Most of the time the application should
   * calculate the time until the photons will be emitted from the display and pass that time into the method.
   *
   * This is roughly analogous to the inverse of the view matrix in most applications, though
   * many games will need to do some additional rotation or translation on top of the rotation
   * and translation provided by the head pose.
   *
   * For devices where bPoseIsValid is true the application can use the pose to position the device
   * in question. The provided array can be any size up to k_unMaxTrackedDeviceCount.
   *
   * Seated experiences should call this method with TrackingUniverseSeated and receive poses relative
   * to the seated zero pose. Standing experiences should call this method with TrackingUniverseStanding
   * and receive poses relative to the Chaperone Play Area. TrackingUniverseRawAndUncalibrated should
   * probably not be used unless the application is the Chaperone calibration tool itself, but will provide
   * poses relative to the hardware-specific coordinate system in the driver.
   *
   * NOTE: For efficiency only returns the array up to the last valid item.
   */
  GetDeviceToAbsoluteTrackingPose(
    origin: TrackingUniverseOrigin,
    predictedSecondsToPhotonsFromNow: number,
  ): TrackedDevicePose[];

  /** Fills the supplied struct with the current state of the controller. Returns undefined if the controller index
   * is invalid. This function is deprecated in favor of the new IVRInput system. */
  GetControllerState(
    controllerDeviceIndex: number,
  ): VRControllerState | undefined;
}

export interface OpenvrNative {
  IVRSystem: typeof IVRSystem;

  /** Finds the active installation of vrclient.dll and initializes it */
  Init(type: VRApplicationType): IVRSystem;

  /**
   * unloads vrclient.dll. Any interface pointers from the interface are
   * invalid after this point
   */
  Shutdown(): IVRSystem;

  /** Returns true if there is an HMD attached. This check is as lightweight as possible and
   * can be called outside of VR_Init/VR_Shutdown. It should be used when an application wants
   * to know if initializing VR is a possibility but isn't ready to take that step yet.
   */
  IsHmdPresent(): boolean;

  /** Returns true if the OpenVR runtime is installed. */
  IsRuntimeInstalled(): boolean;
}

/** Please add adequate error description to https://developer.valvesoftware.com/w/index.php?title=Category:SteamVRHelp */
export enum VRInitError {
  None = 0,
  Unknown = 1,
  Init_InstallationNotFound = 100,
  Init_InstallationCorrupt = 101,
  Init_VRClientDLLNotFound = 102,
  Init_FileNotFound = 103,
  Init_FactoryNotFound = 104,
  Init_InterfaceNotFound = 105,
  Init_InvalidInterface = 106,
  Init_UserConfigDirectoryInvalid = 107,
  Init_HmdNotFound = 108,
  Init_NotInitialized = 109,
  Init_PathRegistryNotFound = 110,
  Init_NoConfigPath = 111,
  Init_NoLogPath = 112,
  Init_PathRegistryNotWritable = 113,
  Init_AppInfoInitFailed = 114,
  /** Used internally to cause retries to vrserver */
  Init_Retry = 115,
  /** The calling application should silently exit. The user canceled app startup */
  Init_InitCanceledByUser = 116,
  Init_AnotherAppLaunching = 117,
  Init_SettingsInitFailed = 118,
  Init_ShuttingDown = 119,
  Init_TooManyObjects = 120,
  Init_NoServerForBackgroundApp = 121,
  Init_NotSupportedWithCompositor = 122,
  Init_NotAvailableToUtilityApps = 123,
  Init_Internal = 124,
  Init_HmdDriverIdIsNone = 125,
  Init_HmdNotFoundPresenceFailed = 126,
  Init_VRMonitorNotFound = 127,
  Init_VRMonitorStartupFailed = 128,
  Init_LowPowerWatchdogNotSupported = 129,
  Init_InvalidApplicationType = 130,
  Init_NotAvailableToWatchdogApps = 131,
  Init_WatchdogDisabledInSettings = 132,
  Init_VRDashboardNotFound = 133,
  Init_VRDashboardStartupFailed = 134,

  Driver_Failed = 200,
  Driver_Unknown = 201,
  Driver_HmdUnknown = 202,
  Driver_NotLoaded = 203,
  Driver_RuntimeOutOfDate = 204,
  Driver_HmdInUse = 205,
  Driver_NotCalibrated = 206,
  Driver_CalibrationInvalid = 207,
  Driver_HmdDisplayNotFound = 208,
  Driver_TrackedDeviceInterfaceUnknown = 209,
  Driver_HmdDriverIdOutOfBounds = 211,
  Driver_HmdDisplayMirrored = 212,

  IPC_ServerInitFailed = 300,
  IPC_ConnectFailed = 301,
  IPC_SharedStateInitFailed = 302,
  IPC_CompositorInitFailed = 303,
  IPC_MutexInitFailed = 304,
  IPC_Failed = 305,
  IPC_CompositorConnectFailed = 306,
  IPC_CompositorInvalidConnectResponse = 307,
  IPC_ConnectFailedAfterMultipleAttempts = 308,

  Compositor_Failed = 400,
  Compositor_D3D11HardwareRequired = 401,
  Compositor_FirmwareRequiresUpdate = 402,
  Compositor_OverlayInitFailed = 403,
  Compositor_ScreenshotsInitFailed = 404,

  VendorSpecific_UnableToConnectToOculusRuntime = 1000,

  VendorSpecific_HmdFound_CantOpenDevice = 1101,
  VendorSpecific_HmdFound_UnableToRequestConfigStart = 1102,
  VendorSpecific_HmdFound_NoStoredConfig = 1103,
  VendorSpecific_HmdFound_ConfigTooBig = 1104,
  VendorSpecific_HmdFound_ConfigTooSmall = 1105,
  VendorSpecific_HmdFound_UnableToInitZLib = 1106,
  VendorSpecific_HmdFound_CantReadFirmwareVersion = 1107,
  VendorSpecific_HmdFound_UnableToSendUserDataStart = 1108,
  VendorSpecific_HmdFound_UnableToGetUserDataStart = 1109,
  VendorSpecific_HmdFound_UnableToGetUserDataNext = 1110,
  VendorSpecific_HmdFound_UserDataAddressRange = 1111,
  VendorSpecific_HmdFound_UserDataError = 1112,
  VendorSpecific_HmdFound_ConfigFailedSanityCheck = 1113,

  Steam_SteamInstallationNotFound = 2000,
}

/** enum values to pass in to VR_Init to identify whether the application will
 * draw a 3D scene. */
export enum VRApplicationType {
  /** Some other kind of application that isn't covered by the other entries */
  Other = 0,
  /** Application will submit 3D frames */
  Scene = 1,
  /** Application only interacts with overlays */
  Overlay = 2,
  /**
   * Application should not start SteamVR if it's not already running, and should not
   * keep it running if everything else quits.
   */
  Background = 3,
  /**
   * Init should not try to load any drivers. The application needs access to utility
   * interfaces (like IVRSettings and IVRApplications) but not hardware.
   */
  Utility = 4,
  /** Reserved for vrmonitor */
  VRMonitor = 5,
  /** Reserved for Steam */
  SteamWatchdog = 6,
  /** reserved for vrstartup */
  Bootstrapper = 7,
  /** reserved for vrwebhelper */
  WebHelper = 8,
  /** reserved for openxr (created instance, but not session yet) */
  OpenXRInstance = 9,
  /** reserved for openxr (started session) */
  OpenXRScene = 10,
  /** reserved for openxr (started overlay session) */
  OpenXROverlay = 11,
  /** reserved for the vrprismhost process */
  Prism = 12,
  /** reserved for the RoomView process */
  RoomView = 13,
}

/** Identifies which style of tracking origin the application wants to use
 * for the poses it is requesting */
export enum TrackingUniverseOrigin {
  /** Poses are provided relative to the seated zero pose */
  Seated = 0,
  /** Poses are provided relative to the safe bounds configured by the user */
  Standing = 1,
  /** Poses are provided in the coordinate system defined by the driver.  It has Y up and is unified for devices of the same driver. You usually don't want this one. */
  RawAndUncalibrated = 2,
}

export enum TrackingResult {
  Uninitialized = 1,
  Calibrating_InProgress = 100,
  Calibrating_OutOfRange = 101,
  Running_OK = 200,
  Running_OutOfRange = 201,
}

/** Describes what kind of object is being tracked at a given ID */
export enum TrackedDeviceClass {
  /** the ID was not valid. */
  Invalid = 0,
  /** Head-Mounted Displays */
  HMD = 1,
  /** Tracked controllers */
  Controller = 2,
  /** Generic trackers, similar to controllers */
  GenericTracker = 3,
  /** Camera and base stations that serve as tracking reference points */
  TrackingReference = 4,
  /** Accessories that aren't necessarily tracked themselves, but may redirect video output from other tracked devices */
  DisplayRedirect = 5,
}

export type HmdVector3 = [[number, number, number]];

/**
 * - right-handed system
 * - +y is up
 * - +x is to the right
 * - -z is forward
 * - Distance unit is  meters
 */
export type HmdMatrix34 = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
];

/** describes a single pose for a tracked object */
export interface TrackedDevicePose {
  mDeviceToAbsoluteTracking: HmdMatrix34;
  /** velocity in tracker space in m/s */
  vVelocity: HmdVector3;
  /** angular velocity in radians/s (?) */
  vAngularVelocity: HmdVector3;
  eTrackingResult: TrackingResult;
  bPoseIsValid: boolean;

  /**
   * This indicates that there is a device connected for this spot in the pose array.
   * It could go from true to false if the user unplugs the device.
   */
  bDeviceIsConnected: boolean;
}

export interface VRControllerState {
  /**
   * If packet num matches that on your prior call, then the controller state hasn't been changed since
   * your last call and there is no need to process it
   */
  packetNum: number;

  /** bit flags for each of the buttons. Use ButtonMaskFromId to turn an ID into a mask */
  buttonPressed: number;
  /** bit flags for each of the buttons. Use ButtonMaskFromId to turn an ID into a mask */
  buttonTouched: number;

  /** Axis data for the controller's analog inputs */
  axis: VRControllerAxis[];
}

/** contains information about one axis on the controller */
export interface VRControllerAxis {
  /** Ranges from -1.0 to 1.0 for joysticks and track pads. Ranges from 0.0 to 1.0 for triggers were 0 is fully released. */
  x: number;
  /** Ranges from -1.0 to 1.0 for joysticks and track pads. Is always 0.0 for triggers. */
  y: number;
}

/** Describes what specific role associated with a tracked device */
export enum TrackedControllerRole {
  /** Invalid value for controller type */
  Invalid = 0,
  /** Tracked device associated with the left hand */
  LeftHand = 1,
  /** Tracked device associated with the right hand */
  RightHand = 2,
  /** Tracked device is opting out of left/right hand selection */
  OptOut = 3,
  /** Tracked device is a treadmill or other locomotion device */
  Treadmill = 4,
  /** Tracked device is a stylus */
  Stylus = 5,
}

/** Used to pass device IDs to API calls */
export enum TrackedDeviceIndex {
  Hmd = 0,
  MaxCount = 64,
  Other = 0xfffffffe,
  Invalid = 0xffffffff,
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty {
  Invalid = 0,

  // general properties that apply to all device classes
  TrackingSystemName_String = 1000,
  ModelNumber_String = 1001,
  SerialNumber_String = 1002,
  RenderModelName_String = 1003,
  WillDriftInYaw_Bool = 1004,
  ManufacturerName_String = 1005,
  TrackingFirmwareVersion_String = 1006,
  HardwareRevision_String = 1007,
  AllWirelessDongleDescriptions_String = 1008,
  ConnectedWirelessDongle_String = 1009,
  DeviceIsWireless_Bool = 1010,
  DeviceIsCharging_Bool = 1011,
  /** 0 is empty, 1 is full */
  DeviceBatteryPercentage_Float = 1012,
  StatusDisplayTransform_Matrix34 = 1013,
  Firmware_UpdateAvailable_Bool = 1014,
  Firmware_ManualUpdate_Bool = 1015,
  Firmware_ManualUpdateURL_String = 1016,
  HardwareRevision_Uint64 = 1017,
  FirmwareVersion_Uint64 = 1018,
  FPGAVersion_Uint64 = 1019,
  VRCVersion_Uint64 = 1020,
  RadioVersion_Uint64 = 1021,
  DongleVersion_Uint64 = 1022,
  BlockServerShutdown_Bool = 1023,
  CanUnifyCoordinateSystemWithHmd_Bool = 1024,
  ContainsProximitySensor_Bool = 1025,
  DeviceProvidesBatteryStatus_Bool = 1026,
  DeviceCanPowerOff_Bool = 1027,
  Firmware_ProgrammingTarget_String = 1028,
  DeviceClass_Int32 = 1029,
  HasCamera_Bool = 1030,
  DriverVersion_String = 1031,
  Firmware_ForceUpdateRequired_Bool = 1032,
  ViveSystemButtonFixRequired_Bool = 1033,
  ParentDriver_Uint64 = 1034,
  ResourceRoot_String = 1035,
  RegisteredDeviceType_String = 1036,
  /** input profile to use for this device in the input system. Will default to tracking system name if this isn't provided */
  InputProfilePath_String = 1037,
  /** Used for devices that will never have a valid pose by design */
  NeverTracked_Bool = 1038,
  NumCameras_Int32 = 1039,
  /** EVRTrackedCameraFrameLayout value */
  CameraFrameLayout_Int32 = 1040,
  /** ECameraVideoStreamFormat value */
  CameraStreamFormat_Int32 = 1041,
  /** driver-relative path to additional device and global configuration settings */
  AdditionalDeviceSettingsPath_String = 1042,
  /** Whether device supports being identified from vrmonitor (e.g. blink LED, vibrate haptics, etc) */
  Identifiable_Bool = 1043,
  BootloaderVersion_Uint64 = 1044,
  /** additional string to include in system reports about a tracked device */
  AdditionalSystemReportData_String = 1045,
  /** additional FW components from a device that gets propagated into reports */
  CompositeFirmwareVersion_String = 1046,
  Firmware_RemindUpdate_Bool = 1047,
  PeripheralApplicationVersion_Uint64 = 1048,
  ManufacturerSerialNumber_String = 1049,
  ComputedSerialNumber_String = 1050,
  EstimatedDeviceFirstUseTime_Int32 = 1051,
  DevicePowerUsage_Float = 1052,
  IgnoreMotionForStandby_Bool = 1053,

  // Properties that are unique to TrackedDeviceClass_HMD
  ReportsTimeSinceVSync_Bool = 2000,
  SecondsFromVsyncToPhotons_Float = 2001,
  DisplayFrequency_Float = 2002,
  UserIpdMeters_Float = 2003,
  CurrentUniverseId_Uint64 = 2004,
  PreviousUniverseId_Uint64 = 2005,
  DisplayFirmwareVersion_Uint64 = 2006,
  IsOnDesktop_Bool = 2007,
  DisplayMCType_Int32 = 2008,
  DisplayMCOffset_Float = 2009,
  DisplayMCScale_Float = 2010,
  EdidVendorID_Int32 = 2011,
  DisplayMCImageLeft_String = 2012,
  DisplayMCImageRight_String = 2013,
  DisplayGCBlackClamp_Float = 2014,
  EdidProductID_Int32 = 2015,
  CameraToHeadTransform_Matrix34 = 2016,
  DisplayGCType_Int32 = 2017,
  DisplayGCOffset_Float = 2018,
  DisplayGCScale_Float = 2019,
  DisplayGCPrescale_Float = 2020,
  DisplayGCImage_String = 2021,
  LensCenterLeftU_Float = 2022,
  LensCenterLeftV_Float = 2023,
  LensCenterRightU_Float = 2024,
  LensCenterRightV_Float = 2025,
  UserHeadToEyeDepthMeters_Float = 2026,
  CameraFirmwareVersion_Uint64 = 2027,
  CameraFirmwareDescription_String = 2028,
  DisplayFPGAVersion_Uint64 = 2029,
  DisplayBootloaderVersion_Uint64 = 2030,
  DisplayHardwareVersion_Uint64 = 2031,
  AudioFirmwareVersion_Uint64 = 2032,
  CameraCompatibilityMode_Int32 = 2033,
  ScreenshotHorizontalFieldOfViewDegrees_Float = 2034,
  ScreenshotVerticalFieldOfViewDegrees_Float = 2035,
  DisplaySuppressed_Bool = 2036,
  DisplayAllowNightMode_Bool = 2037,
  DisplayMCImageWidth_Int32 = 2038,
  DisplayMCImageHeight_Int32 = 2039,
  DisplayMCImageNumChannels_Int32 = 2040,
  DisplayMCImageData_Binary = 2041,
  SecondsFromPhotonsToVblank_Float = 2042,
  DriverDirectModeSendsVsyncEvents_Bool = 2043,
  DisplayDebugMode_Bool = 2044,
  GraphicsAdapterLuid_Uint64 = 2045,
  DriverProvidedChaperonePath_String = 2048,
  /** expected number of sensors or basestations to reserve UI space for */
  ExpectedTrackingReferenceCount_Int32 = 2049,
  /** expected number of tracked controllers to reserve UI space for */
  ExpectedControllerCount_Int32 = 2050,
  /** placeholder icon for "left" controller if not yet detected/loaded */
  NamedIconPathControllerLeftDeviceOff_String = 2051,
  /** placeholder icon for "right" controller if not yet detected/loaded */
  NamedIconPathControllerRightDeviceOff_String = 2052,
  /** placeholder icon for sensor/base if not yet detected/loaded */
  NamedIconPathTrackingReferenceDeviceOff_String = 2053,
  /** currently no effect. was used to disable HMD pose prediction on MR, which is now done by MR driver setting velocity=0 */
  DoNotApplyPrediction_Bool = 2054,
  CameraToHeadTransforms_Matrix34_Array = 2055,
  /** custom resolution of compositor calls to IVRSystem::ComputeDistortion */
  DistortionMeshResolution_Int32 = 2056,
  DriverIsDrawingControllers_Bool = 2057,
  DriverRequestsApplicationPause_Bool = 2058,
  DriverRequestsReducedRendering_Bool = 2059,
  MinimumIpdStepMeters_Float = 2060,
  AudioBridgeFirmwareVersion_Uint64 = 2061,
  ImageBridgeFirmwareVersion_Uint64 = 2062,
  ImuToHeadTransform_Matrix34 = 2063,
  ImuFactoryGyroBias_Vector3 = 2064,
  ImuFactoryGyroScale_Vector3 = 2065,
  ImuFactoryAccelerometerBias_Vector3 = 2066,
  ImuFactoryAccelerometerScale_Vector3 = 2067,
  // reserved 2068
  ConfigurationIncludesLighthouse20Features_Bool = 2069,
  AdditionalRadioFeatures_Uint64 = 2070,
  /** NumCameras_Int32-sized array of float[4] RGBG white balance calibration data (max size is vr::k_unMaxCameras) */
  CameraWhiteBalance_Vector4_Array = 2071,
  /** NumCameras_Int32-sized array of vr::EVRDistortionFunctionType values (max size is vr::k_unMaxCameras) */
  CameraDistortionFunction_Int32_Array = 2072,
  /** NumCameras_Int32-sized array of double[vr::k_unMaxDistortionFunctionParameters] (max size is vr::k_unMaxCameras) */
  CameraDistortionCoefficients_Float_Array = 2073,
  ExpectedControllerType_String = 2074,
  /** one of EHmdTrackingStyle */
  HmdTrackingStyle_Int32 = 2075,
  DriverProvidedChaperoneVisibility_Bool = 2076,
  HmdColumnCorrectionSettingPrefix_String = 2077,
  CameraSupportsCompatibilityModes_Bool = 2078,
  SupportsRoomViewDepthProjection_Bool = 2079,
  /** populated by compositor from actual EDID list when available from GPU driver */
  DisplayAvailableFrameRates_Float_Array = 2080,
  /** if this is true but DisplayAvailableFrameRates_Float_Array is empty, explain to user */
  DisplaySupportsMultipleFramerates_Bool = 2081,
  DisplayColorMultLeft_Vector3 = 2082,
  DisplayColorMultRight_Vector3 = 2083,
  DisplaySupportsRuntimeFramerateChange_Bool = 2084,
  DisplaySupportsAnalogGain_Bool = 2085,
  DisplayMinAnalogGain_Float = 2086,
  DisplayMaxAnalogGain_Float = 2087,
  CameraExposureTime_Float = 2088,
  CameraGlobalGain_Float = 2089,
  DashboardScale_Float = 2091,
  PeerButtonInfo_String = 2092,
  Hmd_SupportsHDR10_Bool = 2093,
  Hmd_EnableParallelRenderCameras_Bool = 2094,
  /** higher priority than DriverProvidedChaperonePath_String */
  DriverProvidedChaperoneJson_String = 2095,

  IpdUIRangeMinMeters_Float = 2100,
  IpdUIRangeMaxMeters_Float = 2101,
  Hmd_SupportsHDCP14LegacyCompat_Bool = 2102,
  Hmd_SupportsMicMonitoring_Bool = 2103,
  Hmd_SupportsDisplayPortTrainingMode_Bool = 2104,
  Hmd_SupportsRoomViewDirect_Bool = 2105,
  Hmd_SupportsAppThrottling_Bool = 2106,
  Hmd_SupportsGpuBusMonitoring_Bool = 2107,

  DSCVersion_Int32 = 2110,
  DSCSliceCount_Int32 = 2111,
  DSCBPPx16_Int32 = 2112,

  // Driver requested mura correction properties
  DriverRequestedMuraCorrectionMode_Int32 = 2200,
  DriverRequestedMuraFeather_InnerLeft_Int32 = 2201,
  DriverRequestedMuraFeather_InnerRight_Int32 = 2202,
  DriverRequestedMuraFeather_InnerTop_Int32 = 2203,
  DriverRequestedMuraFeather_InnerBottom_Int32 = 2204,
  DriverRequestedMuraFeather_OuterLeft_Int32 = 2205,
  DriverRequestedMuraFeather_OuterRight_Int32 = 2206,
  DriverRequestedMuraFeather_OuterTop_Int32 = 2207,
  DriverRequestedMuraFeather_OuterBottom_Int32 = 2208,

  Audio_DefaultPlaybackDeviceId_String = 2300,
  Audio_DefaultRecordingDeviceId_String = 2301,
  Audio_DefaultPlaybackDeviceVolume_Float = 2302,
  Audio_SupportsDualSpeakerAndJackOutput_Bool = 2303,

  // Properties that are unique to TrackedDeviceClass_Controller
  AttachedDeviceId_String = 3000,
  SupportedButtons_Uint64 = 3001,
  /** Return value is of type EVRControllerAxisType */
  Axis0Type_Int32 = 3002,
  /** Return value is of type EVRControllerAxisType */
  Axis1Type_Int32 = 3003,
  /** Return value is of type EVRControllerAxisType */
  Axis2Type_Int32 = 3004,
  /** Return value is of type EVRControllerAxisType */
  Axis3Type_Int32 = 3005,
  /** Return value is of type EVRControllerAxisType */
  Axis4Type_Int32 = 3006,
  /** Return value is of type ETrackedControllerRole */
  ControllerRoleHint_Int32 = 3007,

  // Properties that are unique to TrackedDeviceClass_TrackingReference
  FieldOfViewLeftDegrees_Float = 4000,
  FieldOfViewRightDegrees_Float = 4001,
  FieldOfViewTopDegrees_Float = 4002,
  FieldOfViewBottomDegrees_Float = 4003,
  TrackingRangeMinimumMeters_Float = 4004,
  TrackingRangeMaximumMeters_Float = 4005,
  ModeLabel_String = 4006,
  /** volatile, based on radio presence and fw discovery */
  CanWirelessIdentify_Bool = 4007,
  Nonce_Int32 = 4008,

  // Properties that are used for user interface like icons names
  /** DEPRECATED. Value not referenced. Now expected to be part of icon path properties. */
  IconPathName_String = 5000,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceOff_String = 5001,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceSearching_String = 5002,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceSearchingAlert_String = 5003,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceReady_String = 5004,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceReadyAlert_String = 5005,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceNotReady_String = 5006,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceStandby_String = 5007,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceAlertLow_String = 5008,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceStandbyAlert_String = 5009,

  // Properties that are used by helpers, but are opaque to applications
  DisplayHiddenArea_Binary_Start = 5100,
  DisplayHiddenArea_Binary_End = 5150,
  ParentContainer = 5151,
  OverrideContainer_Uint64 = 5152,

  // Properties that are unique to drivers
  UserConfigPath_String = 6000,
  InstallPath_String = 6001,
  HasDisplayComponent_Bool = 6002,
  HasControllerComponent_Bool = 6003,
  HasCameraComponent_Bool = 6004,
  HasDriverDirectModeComponent_Bool = 6005,
  HasVirtualDisplayComponent_Bool = 6006,
  HasSpatialAnchorsSupport_Bool = 6007,

  // Properties that are set internally based on other information provided by drivers
  ControllerType_String = 7000,
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile_String				= 7001,
  /** Allows hand assignments to prefer some controllers over others. High numbers are selected over low numbers */
  ControllerHandSelectionPriority_Int32 = 7002,

  // Vendors are free to expose private debug data in this reserved region
  VendorSpecific_Reserved_Start = 10000,
  VendorSpecific_Reserved_End = 10999,

  TrackedDeviceProperty_Max = 1000000,
}

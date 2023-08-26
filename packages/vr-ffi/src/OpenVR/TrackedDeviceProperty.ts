export type TrackedDeviceProperty =
  | TrackedDeviceProperty_Other
  | TrackedDeviceProperty_Bool
  | TrackedDeviceProperty_Float
  | TrackedDeviceProperty_Int32
  | TrackedDeviceProperty_Uint64
  | TrackedDeviceProperty_Matrix34
  | TrackedDeviceProperty_String;

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Other {
  Invalid = 0,
  ParentContainer = 5151,
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Bool {
  // general properties that apply to all device classes
  WillDriftInYaw = 1004,
  DeviceIsWireless = 1010,
  DeviceIsCharging = 1011,
  BlockServerShutdown = 1023,
  CanUnifyCoordinateSystemWithHmd = 1024,
  ContainsProximitySensor = 1025,
  DeviceProvidesBatteryStatus = 1026,
  DeviceCanPowerOff = 1027,
  HasCamera = 1030,
  ViveSystemButtonFixRequired = 1033,
  /** Used for devices that will never have a valid pose by design */
  NeverTracked = 1038,
  /** Whether device supports being identified from vrmonitor (e.g. blink LED, vibrate haptics, etc) */
  Identifiable = 1043,
  IgnoreMotionForStandby = 1053,

  // Properties that are unique to TrackedDeviceClass_HMD
  ReportsTimeSinceVSync = 2000,
  IsOnDesktop = 2007,
  DisplaySuppressed = 2036,
  DisplayAllowNightMode = 2037,
  DriverDirectModeSendsVsyncEvents = 2043,
  DisplayDebugMode = 2044,
  /** currently no effect. was used to disable HMD pose prediction on MR, which is now done by MR driver setting velocity=0 */
  DoNotApplyPrediction = 2054,
  DriverIsDrawingControllers = 2057,
  DriverRequestsApplicationPause = 2058,
  DriverRequestsReducedRendering = 2059,
  // reserved 2068
  ConfigurationIncludesLighthouse20Features = 2069,
  DriverProvidedChaperoneVisibility = 2076,
  CameraSupportsCompatibilityModes = 2078,
  SupportsRoomViewDepthProjection = 2079,
  /** if this is true but DisplayAvailableFrameRates_Array is empty, explain to user */
  DisplaySupportsMultipleFramerates = 2081,
  DisplaySupportsRuntimeFramerateChange = 2084,
  DisplaySupportsAnalogGain = 2085,

  // Driver requested mura correction properties

  // Properties that are unique to TrackedDeviceClass_Controller

  // Properties that are unique to TrackedDeviceClass_TrackingReference
  /** volatile, based on radio presence and fw discovery */
  CanWirelessIdentify = 4007,

  // Properties that are used for user interface like icons names

  // Properties that are used by helpers, but are opaque to applications

  // Properties that are unique to drivers
  HasDisplayComponent = 6002,
  HasControllerComponent = 6003,
  HasCameraComponent = 6004,
  HasDriverDirectModeComponent = 6005,
  HasVirtualDisplayComponent = 6006,
  HasSpatialAnchorsSupport = 6007,

  // Properties that are set internally based on other information provided by drivers
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,

  // Vendors are free to expose private debug data in this reserved region
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Float {
  // general properties that apply to all device classes
  /** 0 is empty, 1 is full */
  DeviceBatteryPercentage = 1012,
  DevicePowerUsage = 1052,

  // Properties that are unique to TrackedDeviceClass_HMD
  SecondsFromVsyncToPhotons = 2001,
  DisplayFrequency = 2002,
  UserIpdMeters = 2003,
  DisplayMCOffset = 2009,
  DisplayMCScale = 2010,
  DisplayGCBlackClamp = 2014,
  DisplayGCOffset = 2018,
  DisplayGCScale = 2019,
  DisplayGCPrescale = 2020,
  LensCenterLeftU = 2022,
  LensCenterLeftV = 2023,
  LensCenterRightU = 2024,
  LensCenterRightV = 2025,
  UserHeadToEyeDepthMeters = 2026,
  ScreenshotHorizontalFieldOfViewDegrees = 2034,
  ScreenshotVerticalFieldOfViewDegrees = 2035,
  SecondsFromPhotonsToVblank = 2042,
  MinimumIpdStepMeters = 2060,
  // reserved 2068
  DisplayMinAnalogGain = 2086,
  DisplayMaxAnalogGain = 2087,
  CameraExposureTime = 2088,
  CameraGlobalGain = 2089,
  DashboardScale = 2091,

  IpdUIRangeMinMeters = 2100,
  IpdUIRangeMaxMeters = 2101,

  // Driver requested mura correction properties

  // Properties that are unique to TrackedDeviceClass_Controller

  // Properties that are unique to TrackedDeviceClass_TrackingReference
  FieldOfViewLeftDegrees = 4000,
  FieldOfViewRightDegrees = 4001,
  FieldOfViewTopDegrees = 4002,
  FieldOfViewBottomDegrees = 4003,
  TrackingRangeMinimumMeters = 4004,
  TrackingRangeMaximumMeters = 4005,

  // Properties that are used for user interface like icons names

  // Properties that are used by helpers, but are opaque to applications

  // Properties that are unique to drivers

  // Properties that are set internally based on other information provided by drivers
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,

  // Vendors are free to expose private debug data in this reserved region
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Int32 {
  // general properties that apply to all device classes
  DeviceClass = 1029,
  NumCameras = 1039,
  /** EVRTrackedCameraFrameLayout value */
  CameraFrameLayout = 1040,
  /** ECameraVideoStreamFormat value */
  CameraStreamFormat = 1041,
  EstimatedDeviceFirstUseTime = 1051,

  // Properties that are unique to TrackedDeviceClass_HMD
  DisplayMCType = 2008,
  EdidVendorID = 2011,
  EdidProductID = 2015,
  DisplayGCType = 2017,
  CameraCompatibilityMode = 2033,
  DisplayMCImageWidth = 2038,
  DisplayMCImageHeight = 2039,
  DisplayMCImageNumChannels = 2040,
  /** expected number of sensors or basestations to reserve UI space for */
  ExpectedTrackingReferenceCount = 2049,
  /** expected number of tracked controllers to reserve UI space for */
  ExpectedControllerCount = 2050,
  /** custom resolution of compositor calls to IVRSystem::ComputeDistortion */
  DistortionMeshResolution = 2056,
  // reserved 2068
  /** one of EHmdTrackingStyle */
  HmdTrackingStyle = 2075,

  DSCVersion = 2110,
  DSCSliceCount = 2111,
  DSCBPPx16 = 2112,

  // Driver requested mura correction properties
  DriverRequestedMuraCorrectionMode = 2200,

  // Properties that are unique to TrackedDeviceClass_Controller
  /** Return value is of type EVRControllerAxisType */
  Axis0Type = 3002,
  /** Return value is of type EVRControllerAxisType */
  Axis1Type = 3003,
  /** Return value is of type EVRControllerAxisType */
  Axis2Type = 3004,
  /** Return value is of type EVRControllerAxisType */
  Axis3Type = 3005,
  /** Return value is of type EVRControllerAxisType */
  Axis4Type = 3006,
  /** Return value is of type ETrackedControllerRole */
  ControllerRoleHint = 3007,

  // Properties that are unique to TrackedDeviceClass_TrackingReference
  Nonce = 4008,

  // Properties that are used for user interface like icons names

  // Properties that are used by helpers, but are opaque to applications

  // Properties that are unique to drivers

  // Properties that are set internally based on other information provided by drivers
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,
  /** Allows hand assignments to prefer some controllers over others. High numbers are selected over low numbers */
  ControllerHandSelectionPriority = 7002,

  // Vendors are free to expose private debug data in this reserved region
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Uint64 {
  // general properties that apply to all device classes
  HardwareRevision = 1017,
  FirmwareVersion = 1018,
  FPGAVersion = 1019,
  VRCVersion = 1020,
  RadioVersion = 1021,
  DongleVersion = 1022,
  ParentDriver = 1034,
  BootloaderVersion = 1044,
  PeripheralApplicationVersion = 1048,

  // Properties that are unique to TrackedDeviceClass_HMD
  CurrentUniverseId = 2004,
  PreviousUniverseId = 2005,
  DisplayFirmwareVersion = 2006,
  CameraFirmwareVersion = 2027,
  DisplayFPGAVersion = 2029,
  DisplayBootloaderVersion = 2030,
  DisplayHardwareVersion = 2031,
  AudioFirmwareVersion = 2032,
  GraphicsAdapterLuid = 2045,
  AudioBridgeFirmwareVersion = 2061,
  ImageBridgeFirmwareVersion = 2062,
  // reserved 2068
  AdditionalRadioFeatures = 2070,

  // Driver requested mura correction properties

  // Properties that are unique to TrackedDeviceClass_Controller
  SupportedButtons = 3001,

  // Properties that are unique to TrackedDeviceClass_TrackingReference

  // Properties that are used for user interface like icons names

  // Properties that are used by helpers, but are opaque to applications
  OverrideContainer = 5152,

  // Properties that are unique to drivers

  // Properties that are set internally based on other information provided by drivers
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,

  // Vendors are free to expose private debug data in this reserved region
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_Matrix34 {
  // general properties that apply to all device classes
  StatusDisplayTransform = 1013,

  // Properties that are unique to TrackedDeviceClass_HMD
  CameraToHeadTransform = 2016,
  ImuToHeadTransform = 2063,
  // reserved 2068

  // Driver requested mura correction properties

  // Properties that are unique to TrackedDeviceClass_Controller

  // Properties that are unique to TrackedDeviceClass_TrackingReference

  // Properties that are used for user interface like icons names

  // Properties that are used by helpers, but are opaque to applications

  // Properties that are unique to drivers

  // Properties that are set internally based on other information provided by drivers
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,

  // Vendors are free to expose private debug data in this reserved region
}

/** Each entry in this enum represents a property that can be retrieved about a
 * tracked device. Many fields are only valid for one TrackedDeviceClass. */
export enum TrackedDeviceProperty_String {
  // general properties that apply to all device classes
  TrackingSystemName = 1000,
  ModelNumber = 1001,
  SerialNumber = 1002,
  RenderModelName = 1003,
  ManufacturerName = 1005,
  TrackingFirmwareVersion = 1006,
  HardwareRevision = 1007,
  AllWirelessDongleDescriptions = 1008,
  ConnectedWirelessDongle = 1009,
  DriverVersion = 1031,
  ResourceRoot = 1035,
  RegisteredDeviceType = 1036,
  /** input profile to use for this device in the input system. Will default to tracking system name if this isn't provided */
  InputProfilePath = 1037,
  /** driver-relative path to additional device and global configuration settings */
  AdditionalDeviceSettingsPath = 1042,
  /** additional string to include in system reports about a tracked device */
  AdditionalSystemReportData = 1045,
  /** additional FW components from a device that gets propagated into reports */
  CompositeFirmwareVersion = 1046,
  ManufacturerSerialNumber = 1049,
  ComputedSerialNumber = 1050,

  // Properties that are unique to TrackedDeviceClass_HMD
  DisplayMCImageLeft = 2012,
  DisplayMCImageRight = 2013,
  DisplayGCImage = 2021,
  CameraFirmwareDescription = 2028,
  DriverProvidedChaperonePath = 2048,
  /** placeholder icon for "left" controller if not yet detected/loaded */
  NamedIconPathControllerLeftDeviceOff = 2051,
  /** placeholder icon for "right" controller if not yet detected/loaded */
  NamedIconPathControllerRightDeviceOff = 2052,
  /** placeholder icon for sensor/base if not yet detected/loaded */
  NamedIconPathTrackingReferenceDeviceOff = 2053,
  // reserved 2068
  ExpectedControllerType = 2074,
  HmdColumnCorrectionSettingPrefix = 2077,
  PeerButtonInfo = 2092,
  /** higher priority than DriverProvidedChaperonePath */
  DriverProvidedChaperoneJson = 2095,

  // Driver requested mura correction properties

  // Properties that are unique to TrackedDeviceClass_Controller
  AttachedDeviceId = 3000,

  // Properties that are unique to TrackedDeviceClass_TrackingReference
  ModeLabel = 4006,

  // Properties that are used for user interface like icons names
  /** DEPRECATED. Value not referenced. Now expected to be part of icon path properties. */
  IconPathName = 5000,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceOff = 5001,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceSearching = 5002,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceSearchingAlert = 5003,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceReady = 5004,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceReadyAlert = 5005,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceNotReady = 5006,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceStandby = 5007,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceAlertLow = 5008,
  /** {driver}/icons/icon_filename - PNG for static icon, or GIF for animation, 50x32 for headsets and 32x32 for others */
  NamedIconPathDeviceStandbyAlert = 5009,

  // Properties that are used by helpers, but are opaque to applications

  // Properties that are unique to drivers
  UserConfigPath = 6000,
  InstallPath = 6001,

  // Properties that are set internally based on other information provided by drivers
  ControllerType = 7000,
  /** This is no longer used. See "legacy_binding" in the input profile instead. */
  //LegacyInputProfile				= 7001,

  // Vendors are free to expose private debug data in this reserved region
}

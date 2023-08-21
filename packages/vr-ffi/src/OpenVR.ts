import ffi from "ffi-napi";
import ref from "ref-napi";
import ArrayType from "ref-array-napi";

export class OpenVR {
  static VRApplication_Scene = 1;

  static UInt32Array = ArrayType<number>(ref.types.uint32);

  api = ffi.Library("openvr_api", {
    VR_Init: ["pointer", ["pointer", "int32"]],
    VR_Shutdown: ["void", []],
    VR_GetGenericInterface: ["pointer", ["string", "pointer"]],
    VR_IsHmdPresent: ["bool", []],
    VR_GetVRInitErrorAsSymbol: ["string", ["int32"]],
  });

  initialize() {
    const errorRef = ref.alloc(ref.types.int32);
    const vrSystem = this.api.VR_Init(errorRef, OpenVR.VRApplication_Scene);

    if (vrSystem.isNull()) {
      const errorCode = errorRef.deref();
      const errorMsg = this.api.VR_GetVRInitErrorAsSymbol(errorCode);
      throw new Error(
        `Failed to initialize OpenVR. Error ${errorCode}: ${errorMsg}`,
      );
    }

    return vrSystem;
  }
}

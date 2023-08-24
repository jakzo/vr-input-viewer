#include "openvr.h"
#include "ivrsystem.h"

#include <node.h>
#include <openvr.h>
#include <v8.h>

// inline IVRSystem *VR_Init( EVRInitError *peError, EVRApplicationType
// eApplicationType );
NAN_METHOD(Init) {
  if (info.Length() != 1) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument[0] must be a number (EVRApplicationType).");
    return;
  }

  auto applicationType = Nan::To<int32_t>(info[0]).ToChecked();
  constexpr auto applicationTypeMax = vr::VRApplication_Max;
  if (applicationType >= applicationTypeMax) {
    Nan::ThrowTypeError(
        "Argument[0] was out of enum range (EVRApplicationType).");
    return;
  }

  vr::EVRInitError error;
  auto *system =
      vr::VR_Init(&error, static_cast<vr::EVRApplicationType>(applicationType));

  if (system == nullptr) {
    Nan::ThrowError(vr::VR_GetVRInitErrorAsEnglishDescription(error));
    return;
  }

  const auto result = IVRSystem::NewInstance(system);
  info.GetReturnValue().Set(result);
}

// inline IVRSystem *VR_Init( EVRInitError *peError, EVRApplicationType
// eApplicationType );
NAN_METHOD(Shutdown) {
  if (info.Length() != 0) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  vr::VR_Shutdown();
}

/// VR_INTERFACE bool VR_CALLTYPE VR_IsHmdPresent();
NAN_METHOD(IsHmdPresent) {
  if (info.Length() != 0) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  const auto result = vr::VR_IsHmdPresent();
  info.GetReturnValue().Set(Nan::New<v8::Boolean>(result));
}

/// VR_INTERFACE bool VR_CALLTYPE VR_IsRuntimeInstalled();
NAN_METHOD(IsRuntimeInstalled) {
  if (info.Length() != 0) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  const auto result = vr::VR_IsRuntimeInstalled();
  info.GetReturnValue().Set(Nan::New<v8::Boolean>(result));
}

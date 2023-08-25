#include "openvr.h"
#include "ivrsystem.h"

#include <napi.h>
#include <openvr.h>

Napi::Value IsRuntimeInstalled(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const auto result = vr::VR_IsRuntimeInstalled();
  return Napi::Boolean::New(env, result);
}

Napi::Value IsHmdPresent(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const auto result = vr::VR_IsHmdPresent();
  return Napi::Boolean::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() != 1) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env,
                         "Argument[0] must be a number (VRApplicationType)")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const auto applicationType = info[0].As<Napi::Number>().Int32Value();
  constexpr auto applicationTypeMax = vr::VRApplication_Max;
  if (applicationType < 0 || applicationType >= applicationTypeMax) {
    Napi::TypeError::New(
        env, "Argument[0] was out of enum range (VRApplicationType).")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  vr::EVRInitError error;
  auto *system =
      vr::VR_Init(&error, static_cast<vr::EVRApplicationType>(applicationType));

  if (system == nullptr) {
    Napi::Error::New(env, vr::VR_GetVRInitErrorAsEnglishDescription(error))
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return IVRSystem::NewInstance(env, system);
}

Napi::Value Shutdown(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  vr::VR_Shutdown();
  return env.Undefined();
}

Napi::Object Initialize(Napi::Env env, const Napi::Object exports) {
  exports.Set("IsRuntimeInstalled",
              Napi::Function::New(env, IsRuntimeInstalled));
  exports.Set("IsHmdPresent", Napi::Function::New(env, IsHmdPresent));
  exports.Set("Init", Napi::Function::New(env, Init));
  exports.Set("Shutdown", Napi::Function::New(env, Shutdown));
  IVRSystem::Initialize(env, exports);
  return exports;
}

NODE_API_MODULE(openvr, Initialize)

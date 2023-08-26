#include "openvr.h"
#include "guards.h"
#include "ivrsystem.h"

#include <napi.h>
#include <openvr.h>

Napi::Value IsRuntimeInstalled(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 0, 0)

  const auto result = vr::VR_IsRuntimeInstalled();
  return Napi::Boolean::New(env, result);
}

Napi::Value IsHmdPresent(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 0, 0)

  const auto result = vr::VR_IsHmdPresent();
  return Napi::Boolean::New(env, result);
}

Napi::Value Init(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 1, 1)
  ASSERT_ARG_ENUM(info, env, 0, 0, vr::VRApplication_Max, VRApplicationType)

  const auto applicationType = static_cast<vr::EVRApplicationType>(
      info[0].As<Napi::Number>().Uint32Value());

  vr::EVRInitError error;
  auto *system = vr::VR_Init(&error, applicationType);

  if (system == nullptr) {
    Napi::Error::New(env, vr::VR_GetVRInitErrorAsEnglishDescription(error))
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return IVRSystem::NewInstance(env, system);
}

Napi::Value Shutdown(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 0, 0)

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

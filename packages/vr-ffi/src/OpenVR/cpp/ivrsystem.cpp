#include "ivrsystem.h"
#include "util.h"

#include <array>
#include <openvr.h>

using TrackedDeviceIndexArray =
    std::array<vr::TrackedDeviceIndex_t, vr::k_unMaxTrackedDeviceCount>;
using TrackedDevicePoseArray =
    std::array<vr::TrackedDevicePose_t, vr::k_unMaxTrackedDeviceCount>;

Napi::FunctionReference IVRSystem::constructor;

bool IVRSystem::isCppInstantiating = false;

void IVRSystem::Initialize(Napi::Env &env, const Napi::Object &exports) {
  Napi::Function func = DefineClass(
      env, "IVRSystem",
      {
          InstanceMethod("GetSortedTrackedDeviceIndicesOfClass",
                         &IVRSystem::GetSortedTrackedDeviceIndicesOfClass),
          InstanceMethod("GetDeviceToAbsoluteTrackingPose",
                         &IVRSystem::GetDeviceToAbsoluteTrackingPose),
      });

  constructor = Napi::Persistent(func);
  constructor.SuppressDestruct();

  exports.Set("IVRSystem", func);
}

IVRSystem::IVRSystem(const Napi::CallbackInfo &info)
    : Napi::ObjectWrap<IVRSystem>(info) {
  if (!isCppInstantiating) {
    throw Napi::Error::New(info.Env(),
                           "IVRSystem cannot be instantiated from JavaScript");
  }
  isCppInstantiating = false;

  system = reinterpret_cast<vr::IVRSystem *>(
      info[0].As<Napi::External<vr::IVRSystem>>().Data());
}

Napi::Object IVRSystem::NewInstance(Napi::Env env, vr::IVRSystem *system) {
  const auto scope(env);

  isCppInstantiating = true;
  return constructor.New({Napi::External<vr::IVRSystem>::New(env, system)});
}

Napi::Value IVRSystem::GetSortedTrackedDeviceIndicesOfClass(
    const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() < 1 || info.Length() > 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(env,
                         "Argument[0] must be a number (TrackedDeviceClass)")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const auto trackedDeviceClass = info[0].As<Napi::Number>().Uint32Value();
  if (trackedDeviceClass < 0 || trackedDeviceClass >= 6) {
    Napi::TypeError::New(
        env, "Argument[0] was out of enum range (TrackedDeviceClass).")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  vr::TrackedDeviceIndex_t relativeToTrackedDeviceIndex = 0;
  if (!info[1].IsUndefined()) {
    if (!info[1].IsNumber()) {
      Napi::TypeError::New(env, "Argument[1] must be a number")
          .ThrowAsJavaScriptException();
      return env.Undefined();
    }

    relativeToTrackedDeviceIndex = info[1].As<Napi::Number>().Int32Value();
  }

  TrackedDeviceIndexArray trackedDeviceIndexArray;
  uint32_t nDeviceIndices = system->GetSortedTrackedDeviceIndicesOfClass(
      static_cast<vr::ETrackedDeviceClass>(trackedDeviceClass),
      trackedDeviceIndexArray.data(),
      static_cast<uint32_t>(trackedDeviceIndexArray.size()),
      relativeToTrackedDeviceIndex);

  return cppToNode(env, trackedDeviceIndexArray, nDeviceIndices);
}

Napi::Value
IVRSystem::GetDeviceToAbsoluteTrackingPose(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  if (info.Length() != 2) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  if (!info[0].IsNumber()) {
    Napi::TypeError::New(
        env, "Argument[0] must be a number (TrackingUniverseOrigin)")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  const auto origin = info[0].As<Napi::Number>().Uint32Value();
  if (origin < 0 || origin >= 3) {
    Napi::TypeError::New(
        env, "Argument[0] was out of enum range (TrackingUniverseOrigin).")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  if (!info[1].IsNumber()) {
    Napi::TypeError::New(env, "Argument[1] must be a number")
        .ThrowAsJavaScriptException();
    return env.Undefined();
  }

  TrackedDevicePoseArray trackedDevicePoseArray;
  system->GetDeviceToAbsoluteTrackingPose(
      static_cast<vr::ETrackingUniverseOrigin>(origin),
      info[1].As<Napi::Number>().FloatValue(), trackedDevicePoseArray.data(),
      static_cast<uint32_t>(trackedDevicePoseArray.size()));

  return cppToNode(env, trackedDevicePoseArray);
}

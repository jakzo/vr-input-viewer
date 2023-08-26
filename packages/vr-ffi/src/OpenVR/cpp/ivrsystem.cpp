#include "ivrsystem.h"
#include "cpptonode.h"
#include "guards.h"

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
          InstanceMethod("GetTrackedDeviceIndexForControllerRole",
                         &IVRSystem::GetTrackedDeviceIndexForControllerRole),
          InstanceMethod("GetStringTrackedDeviceProperty",
                         &IVRSystem::GetStringTrackedDeviceProperty),
          InstanceMethod("GetControllerState", &IVRSystem::GetControllerState),
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
  isCppInstantiating = true;
  return constructor.New({Napi::External<vr::IVRSystem>::New(env, system)});
}

Napi::Value IVRSystem::GetSortedTrackedDeviceIndicesOfClass(
    const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 1, 2)
  ASSERT_ARG_ENUM(info, env, 0, 0, 6, TrackedDeviceClass)

  const auto trackedDeviceClass = static_cast<vr::ETrackedDeviceClass>(
      info[0].As<Napi::Number>().Uint32Value());

  vr::TrackedDeviceIndex_t relativeToTrackedDeviceIndex = 0;
  if (!info[1].IsUndefined()) {
    ASSERT_ARG_NUMBER(info, env, 1)
    relativeToTrackedDeviceIndex = info[1].As<Napi::Number>().Int32Value();
  }

  TrackedDeviceIndexArray trackedDeviceIndexArray;
  auto numDeviceIndices = system->GetSortedTrackedDeviceIndicesOfClass(
      trackedDeviceClass, trackedDeviceIndexArray.data(),
      static_cast<uint32_t>(trackedDeviceIndexArray.size()),
      relativeToTrackedDeviceIndex);

  return cppToNode(env, trackedDeviceIndexArray, numDeviceIndices);
}

Napi::Value IVRSystem::GetTrackedDeviceIndexForControllerRole(
    const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 1, 1)
  ASSERT_ARG_ENUM(info, env, 0, 0, vr::TrackedControllerRole_Max,
                  TrackedControllerRole)

  const auto trackedControllerRole = static_cast<vr::ETrackedControllerRole>(
      info[0].As<Napi::Number>().Uint32Value());

  const auto result =
      system->GetTrackedDeviceIndexForControllerRole(trackedControllerRole);

  return cppToNode(env, result);
}

Napi::Value
IVRSystem::GetStringTrackedDeviceProperty(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 2, 2)
  ASSERT_ARG_NUMBER(info, env, 0)
  ASSERT_ARG_ENUM(info, env, 1, 0, vr::Prop_TrackedDeviceProperty_Max,
                  TrackedDeviceProperty)

  const auto deviceIndex = info[0].As<Napi::Number>().Uint32Value();
  const auto prop = static_cast<vr::ETrackedDeviceProperty>(
      info[1].As<Napi::Number>().Uint32Value());

  vr::ETrackedPropertyError error;
  char value[vr::k_unMaxPropertyStringSize];
  const auto length = system->GetStringTrackedDeviceProperty(
      deviceIndex, prop, value, sizeof(value), &error);

  if (length == 0) {
    const std::string code = system->GetPropErrorNameFromEnum(error);
    auto error =
        Napi::Error::New(env, "Failed to read property (" + code + ")");
    error.Set("code", Napi::String::New(env, code));
    error.ThrowAsJavaScriptException();
    return env.Undefined();
  }

  return Napi::String::New(env, value, length - 1);
}

Napi::Value IVRSystem::GetControllerState(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 1, 1)
  ASSERT_ARG_NUMBER(info, env, 0)

  const auto controllerDeviceIndex = info[0].As<Napi::Number>().Uint32Value();

  vr::VRControllerState_t controllerState;
  const auto result = system->GetControllerState(
      controllerDeviceIndex, &controllerState, sizeof(controllerState));

  if (!result)
    return env.Undefined();

  return cppToNode(env, controllerState);
}

Napi::Value
IVRSystem::GetDeviceToAbsoluteTrackingPose(const Napi::CallbackInfo &info) {
  auto env = info.Env();

  ASSERT_ARG_COUNT(info, env, 2, 2)
  ASSERT_ARG_ENUM(info, env, 0, 0, 3, TrackingUniverseOrigin)
  ASSERT_ARG_NUMBER(info, env, 1)

  const auto origin = static_cast<vr::ETrackingUniverseOrigin>(
      info[0].As<Napi::Number>().Uint32Value());
  const auto predictedSecondsToPhotonsFromNow =
      info[1].As<Napi::Number>().FloatValue();

  TrackedDevicePoseArray trackedDevicePoseArray;
  system->GetDeviceToAbsoluteTrackingPose(
      origin, predictedSecondsToPhotonsFromNow, trackedDevicePoseArray.data(),
      static_cast<uint32_t>(trackedDevicePoseArray.size()));

  const uint32_t size = trackedDevicePoseArray.size();
  uint32_t validSize = 0;
  for (uint32_t i = 0; i < size; i++) {
    if (trackedDevicePoseArray[i].bPoseIsValid)
      validSize = i + 1;
  }
  auto result = Napi::Array::New(env, validSize);
  for (uint32_t i = 0; i < validSize; i++)
    result.Set(i, cppToNode(env, trackedDevicePoseArray[i]));
  return result;
}

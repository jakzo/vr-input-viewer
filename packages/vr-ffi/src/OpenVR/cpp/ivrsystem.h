#pragma once

#include <napi.h>

namespace vr {
class IVRSystem;
}

class IVRSystem : public Napi::ObjectWrap<IVRSystem> {
public:
  static void Initialize(Napi::Env &env, const Napi::Object &exports);

  static Napi::Object NewInstance(Napi::Env env, vr::IVRSystem *system);

  Napi::Value
  GetSortedTrackedDeviceIndicesOfClass(const Napi::CallbackInfo &info);
  Napi::Value GetDeviceToAbsoluteTrackingPose(const Napi::CallbackInfo &info);

private:
  vr::IVRSystem *system;

  static Napi::FunctionReference constructor;
  static bool isCppInstantiating;

  explicit IVRSystem(const Napi::CallbackInfo &info);

  friend class Napi::ObjectWrap<IVRSystem>;
};

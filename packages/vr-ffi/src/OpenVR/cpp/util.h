#pragma once

#include <algorithm>
#include <limits>
#include <napi.h>
#include <openvr.h>

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value);

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::HmdMatrix34_t &value) {
  auto result = Napi::Array::New(env, 3);
  for (uint32_t i = 0; i < 3; i++) {
    auto row = Napi::Array::New(env, 4);
    for (auto j = 0; j < 4; j++) {
      row.Set(j, Napi::Number::New(env, value.m[i][j]));
    }
    result.Set(i, row);
  }
  return result;
}

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::HmdVector3_t &value) {
  auto result = Napi::Array::New(env, 3);
  for (uint32_t i = 0; i < 3; i++) {
    result.Set(i, Napi::Number::New(env, value.v[i]));
  }
  return result;
}

template <> Napi::Value cppToNode(const Napi::Env &env, const bool &value) {
  return Napi::Boolean::New(env, value);
}

template <>
Napi::Value cppToNode(const Napi::Env &env,
                      const vr::TrackedDeviceIndex_t &value) {
  return Napi::Number::New(env, value);
}

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::ETrackingResult &value) {
  return Napi::Number::New(env, value);
}

template <>
Napi::Value cppToNode(const Napi::Env &env,
                      const vr::TrackedDevicePose_t &value) {
  auto result = Napi::Object::New(env);
  result.Set("deviceToAbsoluteTracking",
             cppToNode(env, value.mDeviceToAbsoluteTracking));
  result.Set("velocity", cppToNode(env, value.vVelocity));
  result.Set("angularVelocity", cppToNode(env, value.vAngularVelocity));
  result.Set("trackingResult", cppToNode(env, value.eTrackingResult));
  result.Set("poseIsValid", cppToNode(env, value.bPoseIsValid));
  result.Set("deviceIsConnected", cppToNode(env, value.bDeviceIsConnected));
  return result;
}

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value,
                      uint32_t nDeviceIndices) {
  const auto size =
      std::min(static_cast<uint32_t>(value.size()), nDeviceIndices);
  auto result = Napi::Array::New(env, size);
  for (uint32_t i = 0; i < size; i++)
    result.Set(i, cppToNode(env, value[i]));
  return result;
}

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value) {
  return cppToNode(env, value, value.size());
}

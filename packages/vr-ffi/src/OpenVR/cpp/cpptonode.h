#pragma once

#include <algorithm>
#include <limits>
#include <napi.h>
#include <openvr.h>

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value);
template <typename T>
Napi::Value cppToNodeArray(const Napi::Env &env, const T &value,
                           const uint32_t &size);

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::HmdMatrix34_t &value) {
  auto result = Napi::Array::New(env, 3);
  for (uint32_t i = 0; i < 3; i++)
    result.Set(i, cppToNodeArray(env, value.m[i], 4));
  return result;
}

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::HmdVector3_t &value) {
  return cppToNodeArray(env, value.v, 3);
}

template <> Napi::Value cppToNode(const Napi::Env &env, const bool &value) {
  return Napi::Boolean::New(env, value);
}

template <>
Napi::Value cppToNode(const Napi::Env &env, const vr::ETrackingResult &value) {
  return Napi::Number::New(env, value);
}
template <> Napi::Value cppToNode(const Napi::Env &env, const uint32_t &value) {
  return Napi::Number::New(env, value);
}
template <> Napi::Value cppToNode(const Napi::Env &env, const float &value) {
  return Napi::Number::New(env, value);
}

template <> Napi::Value cppToNode(const Napi::Env &env, const uint64_t &value) {
  return Napi::BigInt::New(env, value);
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

template <>
Napi::Value cppToNode(const Napi::Env &env,
                      const vr::VRControllerState_t &value) {
  auto result = Napi::Object::New(env);
  result.Set("packetNum", cppToNode(env, value.unPacketNum));
  result.Set("buttonPressed", cppToNode(env, value.ulButtonPressed));
  result.Set("buttonTouched", cppToNode(env, value.ulButtonTouched));
  result.Set("axis", cppToNodeArray(env, value.rAxis,
                                    vr::k_unControllerStateAxisCount));
  return result;
}

template <>
Napi::Value cppToNode(const Napi::Env &env,
                      const vr::VRControllerAxis_t &value) {
  auto result = Napi::Object::New(env);
  result.Set("x", cppToNode(env, value.x));
  result.Set("y", cppToNode(env, value.y));
  return result;
}

template <typename T>
Napi::Value cppToNodeArray(const Napi::Env &env, const T &value,
                           const uint32_t &size) {
  auto result = Napi::Array::New(env, size);
  for (uint32_t i = 0; i < size; i++)
    result.Set(i, cppToNode(env, value[i]));
  return result;
}

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value,
                      const uint32_t &size) {
  return cppToNodeArray(env, value, size);
}

template <typename T>
Napi::Value cppToNode(const Napi::Env &env, const T &value) {
  return cppToNode(env, value, value.size());
}

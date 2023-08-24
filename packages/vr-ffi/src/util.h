#ifndef NODE_UTIL_H
#define NODE_UTIL_H

#include <algorithm>
#include <limits>
#include <nan.h>
#include <openvr.h>

template <typename T> v8::Local<v8::Value> cppToNode(const T &value);

template <typename T>
void setProperty(v8::Local<v8::Object> &obj, const char *propName,
                 const T &value) {
  Nan::Set(obj, Nan::New<v8::String>(propName).ToLocalChecked(), value);
}

template <> v8::Local<v8::Value> cppToNode(const vr::HmdMatrix34_t &value) {
  Nan::EscapableHandleScope scope;
  auto result = Nan::New<v8::Array>();

  for (uint32_t i = 0; i < 3; i++) {
    auto row = Nan::New<v8::Array>();
    for (uint32_t j = 0; j < 4; j++) {
      Nan::Set(row, j, Nan::New<v8::Number>(value.m[i][j]));
    }
    Nan::Set(result, i, row);
  }

  return scope.Escape(result);
}

template <> v8::Local<v8::Value> cppToNode(const vr::HmdVector3_t &value) {
  Nan::EscapableHandleScope scope;
  auto result = Nan::New<v8::Array>();

  for (uint32_t i = 0; i < 3; i++) {
    Nan::Set(result, i, Nan::New<v8::Number>(value.v[i]));
  }

  return scope.Escape(result);
}

template <>
v8::Local<v8::Value> cppToNode(const vr::TrackedDeviceIndex_t &value) {
  return Nan::New<v8::Number>(value);
}

template <>
v8::Local<v8::Value> cppToNode(const vr::TrackedDevicePose_t &value) {
  Nan::EscapableHandleScope scope;
  auto result = Nan::New<v8::Object>();

  setProperty(result, "deviceToAbsoluteTracking",
              cppToNode(value.mDeviceToAbsoluteTracking));
  setProperty(result, "velocity", cppToNode(value.vVelocity));
  setProperty(result, "angularVelocity", cppToNode(value.vAngularVelocity));
  setProperty(
      result, "trackingResult",
      Nan::New<v8::Number>(static_cast<uint32_t>(value.eTrackingResult)));
  setProperty(result, "poseIsValid", Nan::New<v8::Boolean>(value.bPoseIsValid));
  setProperty(result, "deviceIsConnected",
              Nan::New<v8::Boolean>(value.bDeviceIsConnected));

  return scope.Escape(result);
}

template <typename T>
v8::Local<v8::Value> cppToNode(const T &value, uint32_t nDeviceIndices) {
  Nan::EscapableHandleScope scope;
  auto result = Nan::New<v8::Array>();

  const auto numElements =
      std::min(static_cast<uint32_t>(value.size()), nDeviceIndices);
  for (uint32_t i = 0; i < numElements; i++)
    Nan::Set(result, i, cppToNode(value[i]));

  return scope.Escape(result);
}

template <typename T> v8::Local<v8::Value> cppToNode(const T &value) {
  return cppToNode(value, value.size());
}

#endif

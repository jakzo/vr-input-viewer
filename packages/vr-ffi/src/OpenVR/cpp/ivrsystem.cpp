#include "ivrsystem.h"
#include "util.h"

#include <array>
#include <nan.h>
#include <openvr.h>

using namespace v8;

using TrackedDevicePoseArray =
    std::array<vr::TrackedDevicePose_t, vr::k_unMaxTrackedDeviceCount>;
using TrackedDeviceIndexArray =
    std::array<vr::TrackedDeviceIndex_t, vr::k_unMaxTrackedDeviceCount>;

NAN_MODULE_INIT(IVRSystem::Init) {
  Local<FunctionTemplate> tpl = Nan::New<FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("IVRSystem").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "GetDeviceToAbsoluteTrackingPose",
                          GetDeviceToAbsoluteTrackingPose);
  Nan::SetPrototypeMethod(tpl, "GetSortedTrackedDeviceIndicesOfClass",
                          GetSortedTrackedDeviceIndicesOfClass);

  constructor().Reset(Nan::GetFunction(tpl).ToLocalChecked());
}

Local<Object> IVRSystem::NewInstance(vr::IVRSystem *system) {
  Nan::EscapableHandleScope scope;
  Local<Function> cons = Nan::New(constructor());
  Local<Value> argv[1] = {Nan::New<External>(system)};
  return scope.Escape(Nan::NewInstance(cons, 1, argv).ToLocalChecked());
}

IVRSystem::IVRSystem(vr::IVRSystem *self) : self_(self) {}

NAN_METHOD(IVRSystem::New) {
  if (!info.IsConstructCall()) {
    Nan::ThrowError("Use the `new` keyword when creating a new instance.");
    return;
  }

  if (info.Length() != 1 || !info[0]->IsExternal()) {
    Nan::ThrowTypeError("Argument[0] must be an `IVRSystem*`.");
    return;
  }

  auto wrapped_instance =
      static_cast<vr::IVRSystem *>(Local<External>::Cast(info[0])->Value());
  IVRSystem *obj = new IVRSystem(wrapped_instance);
  obj->Wrap(info.This());
  info.GetReturnValue().Set(info.This());
}

/// virtual void GetDeviceToAbsoluteTrackingPose( ETrackingUniverseOrigin
/// eOrigin, float fPredictedSecondsToPhotonsFromNow,
/// VR_ARRAY_COUNT(unTrackedDevicePoseArrayCount) TrackedDevicePose_t
/// *pTrackedDevicePoseArray, uint32_t unTrackedDevicePoseArrayCount ) = 0;
NAN_METHOD(IVRSystem::GetDeviceToAbsoluteTrackingPose) {
  IVRSystem *obj = ObjectWrap::Unwrap<IVRSystem>(info.Holder());

  if (info.Length() != 2) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError(
        "Argument[0] must be a number (ETrackingUniverseOrigin).");
    return;
  }

  uint32_t nOrigin = Nan::To<int32_t>(info[0]).ToChecked();
  if (nOrigin >= 3) {
    Nan::ThrowTypeError(
        "Argument[0] was out of enum range (ETrackingUniverseOrigin).");
    return;
  }

  if (!info[1]->IsNumber()) {
    Nan::ThrowTypeError("Argument[1] must be a number.");
    return;
  }

  vr::ETrackingUniverseOrigin eOrigin =
      static_cast<vr::ETrackingUniverseOrigin>(nOrigin);
  float fPredictedSecondsToPhotonsFromNow =
      static_cast<float>(Nan::To<int32_t>(info[1]).FromJust());
  TrackedDevicePoseArray trackedDevicePoseArray;
  obj->self_->GetDeviceToAbsoluteTrackingPose(
      eOrigin, fPredictedSecondsToPhotonsFromNow, trackedDevicePoseArray.data(),
      static_cast<uint32_t>(trackedDevicePoseArray.size()));

  info.GetReturnValue().Set(cppToNode(trackedDevicePoseArray));
}

/// virtual uint32_t GetSortedTrackedDeviceIndicesOfClass( ETrackedDeviceClass
/// eTrackedDeviceClass, VR_ARRAY_COUNT(unTrackedDeviceIndexArrayCount)
/// vr::TrackedDeviceIndex_t *punTrackedDeviceIndexArray, uint32_t
/// unTrackedDeviceIndexArrayCount, vr::TrackedDeviceIndex_t
/// unRelativeToTrackedDeviceIndex = k_unTrackedDeviceIndex_Hmd ) = 0;
NAN_METHOD(IVRSystem::GetSortedTrackedDeviceIndicesOfClass) {
  IVRSystem *obj = ObjectWrap::Unwrap<IVRSystem>(info.Holder());

  if (info.Length() < 1 || info.Length() > 2) {
    Nan::ThrowError("Wrong number of arguments.");
    return;
  }

  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("Argument[0] must be a number (ETrackedDeviceClass).");
    return;
  }

  uint32_t nTrackedDeviceClass = Nan::To<int32_t>(info[0]).ToChecked();
  if (nTrackedDeviceClass >= 6) {
    Nan::ThrowTypeError(
        "Argument[0] was out of enum range (ETrackedDeviceClass).");
    return;
  }

  vr::TrackedDeviceIndex_t unRelativeToTrackedDeviceIndex = 0;
  if (!info[1]->IsUndefined()) {
    if (!info[1]->IsNumber()) {
      Nan::ThrowTypeError("Argument[1] must be a number.");
      return;
    } else {
      unRelativeToTrackedDeviceIndex = Nan::To<int32_t>(info[1]).ToChecked();
    }
  }

  vr::ETrackedDeviceClass eTrackedDeviceClass =
      static_cast<vr::ETrackedDeviceClass>(nTrackedDeviceClass);
  TrackedDeviceIndexArray trackedDeviceIndexArray;
  uint32_t nDeviceIndices = obj->self_->GetSortedTrackedDeviceIndicesOfClass(
      eTrackedDeviceClass, trackedDeviceIndexArray.data(),
      static_cast<uint32_t>(trackedDeviceIndexArray.size()),
      unRelativeToTrackedDeviceIndex);

  info.GetReturnValue().Set(cppToNode(trackedDeviceIndexArray, nDeviceIndices));
}

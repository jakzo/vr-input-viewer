#ifndef NODE_IVRSYSTEM_H
#define NODE_IVRSYSTEM_H

#include <nan.h>

namespace vr {
class IVRSystem;
}

class IVRSystem : public Nan::ObjectWrap {
public:
  static NAN_MODULE_INIT(Init);

  static v8::Local<v8::Object> NewInstance(vr::IVRSystem *system);

private:
  explicit IVRSystem(vr::IVRSystem *self);
  ~IVRSystem() = default;

  static NAN_METHOD(New);

  static NAN_METHOD(GetSortedTrackedDeviceIndicesOfClass);
  static NAN_METHOD(GetDeviceToAbsoluteTrackingPose);

  static inline Nan::Persistent<v8::Function> &constructor() {
    static Nan::Persistent<v8::Function> the_constructor;
    return the_constructor;
  }

  vr::IVRSystem *const self_;
};

#endif

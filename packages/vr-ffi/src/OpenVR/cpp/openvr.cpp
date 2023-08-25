#include "openvr.h"

#include <napi.h>
#include <openvr.h>

Napi::Value IsRuntimeInstalled(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  if (info.Length() != 0) {
    Napi::TypeError::New(env, "Wrong number of arguments")
        .ThrowAsJavaScriptException();
    return env.Null();
  }

  const auto result = vr::VR_IsRuntimeInstalled();
  return Napi::Boolean::New(env, result);
}

Napi::Object Initialize(Napi::Env env, Napi::Object exports) {
  exports.Set("IsRuntimeInstalled",
              Napi::Function::New(env, IsRuntimeInstalled));
  return exports;
}

NODE_API_MODULE(openvr, Initialize)

#include "ivrsystem.h"
#include "openvr.h"

#include <nan.h>

void Initialize(v8::Local<v8::Object> exports, v8::Local<v8::Value> module,
                v8::Local<v8::Context> context) {
  Nan::Set(
      exports, Nan::New("Init").ToLocalChecked(),
      Nan::GetFunction(Nan::New<v8::FunctionTemplate>(Init)).ToLocalChecked());
  Nan::Set(exports, Nan::New("Shutdown").ToLocalChecked(),
           Nan::GetFunction(Nan::New<v8::FunctionTemplate>(Shutdown))
               .ToLocalChecked());
  Nan::Set(exports, Nan::New("IsHmdPresent").ToLocalChecked(),
           Nan::GetFunction(Nan::New<v8::FunctionTemplate>(IsHmdPresent))
               .ToLocalChecked());
  Nan::Set(exports, Nan::New("IsRuntimeInstalled").ToLocalChecked(),
           Nan::GetFunction(Nan::New<v8::FunctionTemplate>(IsRuntimeInstalled))
               .ToLocalChecked());
  IVRSystem::Init(exports);
}

NODE_MODULE(openvr, Initialize);

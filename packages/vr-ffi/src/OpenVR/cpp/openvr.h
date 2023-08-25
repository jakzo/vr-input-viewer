#pragma once

#include <napi.h>

Napi::Value IsRuntimeInstalled(const Napi::CallbackInfo &);
Napi::Value IsHmdPresent(const Napi::CallbackInfo &);
Napi::Value Init(const Napi::CallbackInfo &);
Napi::Value Shutdown(const Napi::CallbackInfo &);

#pragma once

#include <napi.h>

#define ASSERT_ARG_COUNT(info, env, min, max)                                  \
  if (info.Length() < (min) || info.Length() > (max)) {                        \
    Napi::TypeError::New(env, "Wrong number of arguments")                     \
        .ThrowAsJavaScriptException();                                         \
    return env.Undefined();                                                    \
  }

#define ASSERT_ARG_NUMBER(info, env, index)                                    \
  if (!info[(index)].IsNumber()) {                                             \
    Napi::TypeError::New(env, "Argument[" #index "] must be a number")         \
        .ThrowAsJavaScriptException();                                         \
    return env.Undefined();                                                    \
  }

#define ASSERT_ARG_ENUM(info, env, index, enum_min, enum_limit, type_name)     \
  ASSERT_ARG_NUMBER(info, env, index)                                          \
  const auto _assertArg##index =                                               \
      info[(index)].As<Napi::Number>().Uint32Value();                          \
  if (_assertArg##index < (enum_min) || _assertArg##index >= (enum_limit)) {   \
    Napi::TypeError::New(env, "Argument[" #index                               \
                              "] was out of enum range (" #type_name ")")      \
        .ThrowAsJavaScriptException();                                         \
    return env.Undefined();                                                    \
  }

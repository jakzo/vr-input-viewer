#ifndef NODE_OPENVR_H
#define NODE_OPENVR_H

#include <nan.h>

NAN_METHOD(Init);
NAN_METHOD(Shutdown);
NAN_METHOD(IsHmdPresent);
NAN_METHOD(IsRuntimeInstalled);

#endif

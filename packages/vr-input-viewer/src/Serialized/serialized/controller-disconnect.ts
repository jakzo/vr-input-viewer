// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Handedness } from '../serialized/handedness.js';


export class ControllerDisconnect {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ControllerDisconnect {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsControllerDisconnect(bb:flatbuffers.ByteBuffer, obj?:ControllerDisconnect):ControllerDisconnect {
  return (obj || new ControllerDisconnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsControllerDisconnect(bb:flatbuffers.ByteBuffer, obj?:ControllerDisconnect):ControllerDisconnect {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ControllerDisconnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

handedness():Handedness {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : Handedness.LEFT;
}

static startControllerDisconnect(builder:flatbuffers.Builder) {
  builder.startObject(1);
}

static addHandedness(builder:flatbuffers.Builder, handedness:Handedness) {
  builder.addFieldInt8(0, handedness, Handedness.LEFT);
}

static endControllerDisconnect(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createControllerDisconnect(builder:flatbuffers.Builder, handedness:Handedness):flatbuffers.Offset {
  ControllerDisconnect.startControllerDisconnect(builder);
  ControllerDisconnect.addHandedness(builder, handedness);
  return ControllerDisconnect.endControllerDisconnect(builder);
}
}

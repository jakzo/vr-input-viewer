// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class HeadsetDisconnect {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):HeadsetDisconnect {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsHeadsetDisconnect(bb:flatbuffers.ByteBuffer, obj?:HeadsetDisconnect):HeadsetDisconnect {
  return (obj || new HeadsetDisconnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsHeadsetDisconnect(bb:flatbuffers.ByteBuffer, obj?:HeadsetDisconnect):HeadsetDisconnect {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new HeadsetDisconnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static startHeadsetDisconnect(builder:flatbuffers.Builder) {
  builder.startObject(0);
}

static endHeadsetDisconnect(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createHeadsetDisconnect(builder:flatbuffers.Builder):flatbuffers.Offset {
  HeadsetDisconnect.startHeadsetDisconnect(builder);
  return HeadsetDisconnect.endHeadsetDisconnect(builder);
}
}

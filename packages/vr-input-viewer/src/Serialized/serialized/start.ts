// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

export class Start {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):Start {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsStart(bb:flatbuffers.ByteBuffer, obj?:Start):Start {
  return (obj || new Start()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsStart(bb:flatbuffers.ByteBuffer, obj?:Start):Start {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new Start()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static startStart(builder:flatbuffers.Builder) {
  builder.startObject(0);
}

static endStart(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createStart(builder:flatbuffers.Builder):flatbuffers.Offset {
  Start.startStart(builder);
  return Start.endStart(builder);
}
}

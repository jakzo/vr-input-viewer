// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { Handedness } from '../serialized/handedness.js';


export class ControllerConnect {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):ControllerConnect {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsControllerConnect(bb:flatbuffers.ByteBuffer, obj?:ControllerConnect):ControllerConnect {
  return (obj || new ControllerConnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsControllerConnect(bb:flatbuffers.ByteBuffer, obj?:ControllerConnect):ControllerConnect {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new ControllerConnect()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

handedness():Handedness {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readUint8(this.bb_pos + offset) : Handedness.LEFT;
}

profiles(index: number):string
profiles(index: number,optionalEncoding:flatbuffers.Encoding):string|Uint8Array
profiles(index: number,optionalEncoding?:any):string|Uint8Array|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__string(this.bb!.__vector(this.bb_pos + offset) + index * 4, optionalEncoding) : null;
}

profilesLength():number {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? this.bb!.__vector_len(this.bb_pos + offset) : 0;
}

static startControllerConnect(builder:flatbuffers.Builder) {
  builder.startObject(2);
}

static addHandedness(builder:flatbuffers.Builder, handedness:Handedness) {
  builder.addFieldInt8(0, handedness, Handedness.LEFT);
}

static addProfiles(builder:flatbuffers.Builder, profilesOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, profilesOffset, 0);
}

static createProfilesVector(builder:flatbuffers.Builder, data:flatbuffers.Offset[]):flatbuffers.Offset {
  builder.startVector(4, data.length, 4);
  for (let i = data.length - 1; i >= 0; i--) {
    builder.addOffset(data[i]!);
  }
  return builder.endVector();
}

static startProfilesVector(builder:flatbuffers.Builder, numElems:number) {
  builder.startVector(4, numElems, 4);
}

static endControllerConnect(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

static createControllerConnect(builder:flatbuffers.Builder, handedness:Handedness, profilesOffset:flatbuffers.Offset):flatbuffers.Offset {
  ControllerConnect.startControllerConnect(builder);
  ControllerConnect.addHandedness(builder, handedness);
  ControllerConnect.addProfiles(builder, profilesOffset);
  return ControllerConnect.endControllerConnect(builder);
}
}
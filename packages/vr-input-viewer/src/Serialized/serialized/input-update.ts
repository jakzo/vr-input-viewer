// automatically generated by the FlatBuffers compiler, do not modify

import * as flatbuffers from 'flatbuffers';

import { ControllerInput } from '../serialized/controller-input.js';
import { HeadsetInput } from '../serialized/headset-input.js';


export class InputUpdate {
  bb: flatbuffers.ByteBuffer|null = null;
  bb_pos = 0;
  __init(i:number, bb:flatbuffers.ByteBuffer):InputUpdate {
  this.bb_pos = i;
  this.bb = bb;
  return this;
}

static getRootAsInputUpdate(bb:flatbuffers.ByteBuffer, obj?:InputUpdate):InputUpdate {
  return (obj || new InputUpdate()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

static getSizePrefixedRootAsInputUpdate(bb:flatbuffers.ByteBuffer, obj?:InputUpdate):InputUpdate {
  bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
  return (obj || new InputUpdate()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
}

/**
 * Milliseconds since epoch
 */
timestamp():bigint {
  const offset = this.bb!.__offset(this.bb_pos, 4);
  return offset ? this.bb!.readInt64(this.bb_pos + offset) : BigInt('0');
}

headset(obj?:HeadsetInput):HeadsetInput|null {
  const offset = this.bb!.__offset(this.bb_pos, 6);
  return offset ? (obj || new HeadsetInput()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

leftController(obj?:ControllerInput):ControllerInput|null {
  const offset = this.bb!.__offset(this.bb_pos, 8);
  return offset ? (obj || new ControllerInput()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

rightController(obj?:ControllerInput):ControllerInput|null {
  const offset = this.bb!.__offset(this.bb_pos, 10);
  return offset ? (obj || new ControllerInput()).__init(this.bb!.__indirect(this.bb_pos + offset), this.bb!) : null;
}

static startInputUpdate(builder:flatbuffers.Builder) {
  builder.startObject(4);
}

static addTimestamp(builder:flatbuffers.Builder, timestamp:bigint) {
  builder.addFieldInt64(0, timestamp, BigInt('0'));
}

static addHeadset(builder:flatbuffers.Builder, headsetOffset:flatbuffers.Offset) {
  builder.addFieldOffset(1, headsetOffset, 0);
}

static addLeftController(builder:flatbuffers.Builder, leftControllerOffset:flatbuffers.Offset) {
  builder.addFieldOffset(2, leftControllerOffset, 0);
}

static addRightController(builder:flatbuffers.Builder, rightControllerOffset:flatbuffers.Offset) {
  builder.addFieldOffset(3, rightControllerOffset, 0);
}

static endInputUpdate(builder:flatbuffers.Builder):flatbuffers.Offset {
  const offset = builder.endObject();
  return offset;
}

}

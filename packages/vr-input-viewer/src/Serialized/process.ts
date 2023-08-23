import { ByteBuffer } from "flatbuffers";
import { InputViewer } from "../InputViewer.js";
import {
  Handedness as SerializedHandedness,
  Message,
  Transform as SerializedTransform,
  ControllerInput,
} from "./Serialized.js";
import { Handedness, Transform } from "../utils/types.js";

const MAX_BUTTON_VALUE = (1 << 14) - 1;

export const processSerializedMessage = (
  inputViewer: InputViewer,
  data: ArrayBuffer,
) => {
  const byteBuffer = new ByteBuffer(new Uint8Array(data));
  const message = Message.getRootAsMessage(byteBuffer);

  const headsetConnect = message.headsetConnect();
  if (headsetConnect) {
    const profiles: string[] = [];
    for (let i = 0, len = headsetConnect.profilesLength(); i < len; i++)
      profiles.push(headsetConnect.profiles(i));
    inputViewer.connectHeadset(profiles);
  }

  const headsetDisconnect = message.headsetDisconnect();
  if (headsetDisconnect) inputViewer.disconnectHeadset();

  const controllerConnect = message.controllerConnect();
  if (controllerConnect) {
    const handedness = deserializeHandedness[controllerConnect.handedness()];
    const profiles: string[] = [];
    for (let i = 0, len = controllerConnect.profilesLength(); i < len; i++)
      profiles.push(controllerConnect.profiles(i));
    inputViewer.connectController(handedness, profiles);
  }

  const controllerDisconnect = message.controllerDisconnect();
  if (controllerDisconnect) {
    const handedness = deserializeHandedness[controllerDisconnect.handedness()];
    inputViewer.disconnectController(handedness);
  }

  const inputUpdate = message.inputUpdate();
  if (inputUpdate) {
    const headset = inputUpdate.headset();
    if (headset) setTransform(inputViewer.transforms.hmd, headset.transform());

    const setController = (
      handedness: Handedness,
      serialized: ControllerInput | null,
    ) => {
      if (!serialized) return;
      setTransform(inputViewer.transforms[handedness], serialized.transform());
      const controller = inputViewer.controllers[handedness];
      if (!controller) return;
      const axes = serialized.axesArray();
      if (axes) {
        while (controller.gamepad.axes.length < axes.length)
          controller.gamepad.axes.push(0);
        while (controller.gamepad.axes.length > axes.length)
          controller.gamepad.axes.pop();
        for (const [i, value] of axes.entries())
          controller.gamepad.axes[i] = value;
      }
      const buttons = serialized.buttonsArray();
      if (buttons) {
        while (controller.gamepad.buttons.length < buttons.length)
          controller.gamepad.buttons.push({
            pressed: false,
            touched: false,
            value: 0,
          });
        while (controller.gamepad.buttons.length > buttons.length)
          controller.gamepad.buttons.pop();
        for (const [i, value] of buttons.entries()) {
          const button = controller.gamepad.buttons[i]!;
          button.pressed = (value & 1) === 1;
          button.touched = (value & 2) === 2;
          button.value = (value >> 2) / MAX_BUTTON_VALUE;
        }
      }
    };

    setController("left", inputUpdate.leftController());
    setController("right", inputUpdate.rightController());
  }
};

const deserializeHandedness: Record<SerializedHandedness, Handedness> = {
  [SerializedHandedness.LEFT]: "left",
  [SerializedHandedness.RIGHT]: "right",
};

const setTransform = (
  transform: Transform,
  serialized: SerializedTransform | null,
) => {
  if (!serialized) return;
  const pos = serialized.position();
  if (pos) transform.position.set(pos.x(), pos.y(), pos.z());
  const rot = serialized.rotationQuaternion();
  if (rot) transform.rotation.set(rot.x(), rot.y(), rot.z(), rot.w());
};

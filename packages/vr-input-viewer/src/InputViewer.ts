import { ControllerHud } from "./Controller/ControllerHud.js";
import { PositionViewer } from "./PositionViewer/PositionViewer.js";
import {
  Handedness,
  Transform,
  Transforms,
  VirtualXRInputSource,
} from "./utils/utils.js";

const DEFAULT_HEADSET_PROFILE = "oculus-quest2";
// https://immersive-web.github.io/webxr-input-profiles/packages/viewer/dist/index.html
const DEFAULT_CONTROLLER_PROFILE = "oculus-touch-v3";

export interface InputViewerOpts {
  /**
   * Element to render the input viewer inside. Fills to the width and height
   * of this container (using CSS `width: 100%; height: 100%;`).
   */
  container: HTMLElement;
  /** Hide controller inputs. */
  hideHud?: boolean | undefined;
  /** Hide 3D position view. */
  hidePositions?: boolean | undefined;
  /** Show rendering statistics for the position viewer like FPS. */
  showStats?: boolean | undefined;
  /**
   * URL where the `assets` directory within the vr-input-viewer package is
   * mounted. If not set, assets will be loaded from a CDN.
   */
  assetsBaseUrl?: string | undefined;
  /**
   * URL where the [@webxr-input-profiles/assets](https://cdn.jsdelivr.net/npm/@webxr-input-profiles/assets@1.0/dist/profiles/)
   * package's `dist/profiles` directory is mounted. If not set, controller
   * models will be loaded from a CDN.
   */
  webxrInputProfilesBaseUrl?: string | undefined;
  /** Layout to use for showing inputs. */
  controllerLayout?: string | undefined;
  /** Force it to show a specific headset model. */
  overrideHeadsetName?: string | undefined;
}

export class InputViewer {
  /** Transforms use a right-handed coordinate system. */
  transforms: Transforms = {
    hmd: new Transform(),
    left: new Transform(),
    right: new Transform(),
  };
  headsetProfiles: string[] | undefined;
  controllers: Partial<Record<Handedness, VirtualXRInputSource>> = {};
  huds?: Partial<Record<Handedness, ControllerHud>>;
  positionViewer?: PositionViewer;
  container = document.createElement("div");

  constructor(public opts: InputViewerOpts) {
    this.container.style.width = this.container.style.height = "100%";
    this.container.style.position = "relative";
    opts.container.append(this.container);

    if (!opts.hideHud) this.huds = {};
    if (!opts.hidePositions)
      this.positionViewer = new PositionViewer({
        ...opts,
        assetsBaseUrl: opts.assetsBaseUrl?.replace(/([^/]|^)$/, "$1/"),
        webxrInputProfilesBaseUrl: opts.webxrInputProfilesBaseUrl,
        container: this.container,
        transforms: this.transforms,
      });
  }

  private createController(handedness: Handedness, profiles: string[] = []) {
    const xrInputSource: VirtualXRInputSource = {
      handedness,
      gamepad: {
        index: -1,
        id: "",
        timestamp: 0,
        connected: true,
        hapticActuators: [],
        vibrationActuator: null,
        mapping: "xr-standard",
        axes: [0, 0, 0, 0], // [TouchpadX, TouchpadY, ThumbstickX, ThumbstickY]
        buttons: [
          { pressed: false, touched: false, value: 0 }, // Trigger
          { pressed: false, touched: false, value: 0 }, // Grip
          { pressed: false, touched: false, value: 0 }, // Touchpad
          { pressed: false, touched: false, value: 0 }, // Thumbstick
          { pressed: false, touched: false, value: 0 }, // A
          { pressed: false, touched: false, value: 0 }, // B
          { pressed: false, touched: false, value: 0 }, // Menu
        ],
      },
      profiles: [...profiles, DEFAULT_CONTROLLER_PROFILE],
      targetRayMode: "tracked-pointer",
      targetRaySpace: new EventTarget(),
    };
    return xrInputSource;
  }

  connectHeadset(profiles: string[] = []) {
    this.headsetProfiles = [...profiles, DEFAULT_HEADSET_PROFILE];
  }

  disconnectHeadset() {
    this.headsetProfiles = undefined;
    this.transforms.hmd.position.set(0, 0, 0);
    this.transforms.hmd.rotation.set(0, 0, 0, 0);
  }

  connectController(handedness: Handedness, profiles?: string[]) {
    const xrInputSource = this.createController(handedness, profiles);
    this.controllers[handedness] = xrInputSource;
    if (this.huds)
      this.huds[handedness] = new ControllerHud({
        xrInputSource,
        container: this.container,
        layout: this.opts.controllerLayout,
      });
    this.positionViewer?.onControllerConnected(xrInputSource);
  }

  disconnectController(handedness: Handedness) {
    const controller = this.controllers[handedness];
    if (controller) controller.gamepad.connected = false;
    delete this.controllers[handedness];

    if (this.huds) {
      this.huds[handedness]?.remove();
      delete this.huds[handedness];
    }

    this.positionViewer?.onControllerDisconnected(handedness);
  }

  remove() {
    for (const hud of Object.values(this.huds ?? {})) hud.remove();
    this.positionViewer?.remove();
    this.container.remove();
  }
}

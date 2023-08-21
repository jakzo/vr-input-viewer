import { VrInputSource, type VrInputSourceConfig } from "./VrInputSource.js";

export interface WebxrInputSourceOpts {}

/**
 * NOTE: There does not appear to be a way to track VR device positions/inputs
 * without entering immersive-vr mode which will block the user from their
 * actual VR content so this input source will be unused until a workaround is
 * found.
 */
export class WebxrInputSource extends VrInputSource<WebxrInputSourceOpts> {
  static config: VrInputSourceConfig<WebxrInputSourceOpts> = {
    name: "WebXR",
    opts: {},
  };

  override type = WebxrInputSource;

  // checkIfSupportedPollFrequency = 15_000;
  // checkIfSupportedTimeout: number;
  session: XRSession | undefined;
  referenceSpace: XRReferenceSpace | undefined;
  // lastSessionStartFailed = false;

  override onOptsChanged(
    _newOpts: WebxrInputSourceOpts,
    _prevOpts: WebxrInputSourceOpts | undefined,
  ) {
    // if (!prevOpts) this.checkIfSupported();
  }

  override async onStart() {
    if (!this.session) await this.startSession();
    this.session?.requestAnimationFrame(this.animate);
  }

  override onUpdate() {
    if (!this.session || !this.inputViewer) return;

    for (const xrInputSource of this.session.inputSources) {
      if (xrInputSource.handedness === "none") continue;

      const controller = this.inputViewer.controllers[xrInputSource.handedness];
      if (!controller) continue;

      const axes = xrInputSource.gamepad?.axes;
      if (axes) {
        while (controller.gamepad.axes.length < axes.length)
          controller.gamepad.axes.push(0);
        while (controller.gamepad.axes.length > axes.length)
          controller.gamepad.axes.pop();
        for (const [i, value] of axes.entries())
          controller.gamepad.axes[i] = value;
      }

      const buttons = xrInputSource.gamepad?.buttons;
      if (buttons) {
        while (controller.gamepad.buttons.length < buttons.length)
          controller.gamepad.buttons.push({
            pressed: false,
            touched: false,
            value: 0,
          });
        while (controller.gamepad.buttons.length > buttons.length)
          controller.gamepad.buttons.pop();
        for (const [i, { pressed, touched, value }] of buttons.entries()) {
          const button = controller.gamepad.buttons[i]!;
          button.pressed = pressed;
          button.touched = touched;
          button.value = value;
        }
      }
    }
  }

  override onStop() {
    this.session?.end();
  }

  override onDestroy() {
    // clearTimeout(this.checkIfSupportedTimeout);
  }

  // checkIfSupported = async () => {
  //   try {
  //     this.setAvailable(
  //       !!this.session ||
  //         (!this.lastSessionStartFailed &&
  //           (await navigator.xr?.isSessionSupported("immersive-vr"))),
  //     );
  //   } finally {
  //     this.checkIfSupportedTimeout = window.setTimeout(
  //       this.checkIfSupported,
  //       this.checkIfSupportedPollFrequency,
  //     );
  //   }
  // };

  startSession = async () => {
    if (this.session) return;
    try {
      // this.session = await navigator.xr!.requestSession("immersive-vr");
      this.session = await navigator.xr!.requestSession("inline");
      this.session.addEventListener("end", this.cleanupSession);
      this.addInputSources(this.session.inputSources);
      this.session.addEventListener(
        "inputsourceschange",
        this.onInputSourcesChange,
      );
      this.referenceSpace = await this.session.requestReferenceSpace("local");
      // this.lastSessionStartFailed = false;
      this.setAvailable(true);
      return;
    } catch (err) {
      console.error("Failed to start WebXR session:", err);
      this.session?.end();
      // this.lastSessionStartFailed = true;
    }
    this.setAvailable(false);
  };

  cleanupSession = () => {
    if (!this.session) return;
    this.session.removeEventListener(
      "inputsourceschange",
      this.onInputSourcesChange,
    );
    this.session = undefined;
    this.referenceSpace = undefined;
  };

  onInputSourcesChange = (evt: XRInputSourceChangeEvent) => {
    this.addInputSources(evt.added);

    for (const xrInputSource of evt.removed) {
      if (xrInputSource.handedness === "none") continue;
      this.inputViewer?.disconnectController(xrInputSource.handedness);
    }
  };

  addInputSources(inputSources: readonly XRInputSource[] | XRInputSourceArray) {
    for (const xrInputSource of inputSources) {
      if (xrInputSource.handedness === "none") continue;
      this.inputViewer?.connectController(
        xrInputSource.handedness,
        xrInputSource.profiles,
      );
    }
  }

  animate: XRFrameRequestCallback = (_time, frame) => {
    if (!this.session || !this.referenceSpace || !this.inputViewer) return;
    this.session.requestAnimationFrame(this.animate);

    for (const xrInputSource of this.session.inputSources) {
      if (xrInputSource.handedness === "none" || !xrInputSource.gripSpace)
        continue;

      const controller = this.inputViewer.controllers[xrInputSource.handedness];
      if (!controller) continue;

      const transform = this.inputViewer.transforms[xrInputSource.handedness];
      const pose = frame.getPose(xrInputSource.gripSpace, this.referenceSpace);
      if (!pose) continue;

      const pos = pose.transform.position;
      transform.position.set(pos.x, pos.y, pos.z);
      const rot = pose.transform.orientation;
      transform.rotation.set(rot.x, rot.y, rot.z, rot.w);
    }
  };
}

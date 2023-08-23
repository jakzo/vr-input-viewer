import type { InputViewer } from "@jakzo/vr-input-viewer";
import type { Logger } from "../types.js";

export interface VrInputSourceType<Opts> {
  config: VrInputSourceConfig<Opts>;

  new (
    log: Logger,
    opts: Opts,
    onAvailable: (value: boolean) => void,
  ): VrInputSource<Opts>;
}

export interface VrInputSourceConfig<Opts = unknown> {
  name: string;
  opts: {
    [K in keyof Opts]: VrInputSourceConfigOpt<Opts[K]>;
  };
}
export interface VrInputSourceConfigOpt<T = unknown> {
  type: T extends string ? "string" : never;
  defaultValue: T;
  placeholder?: string;
  tip?: string;
}

/**
 * The constructor may initiate a connection to the input source but should not
 * cause heavy resource usage. Save that for the `start()` call.
 */
export abstract class VrInputSource<Opts> {
  abstract type: VrInputSourceType<Opts>;

  isAvailable: boolean | undefined = undefined;
  isStarted = false;
  inputViewer: InputViewer | undefined = undefined;

  constructor(
    public log: Logger,
    public opts: Opts,
    public onAvailable: (value: boolean) => void,
  ) {}

  /**
   * Call whenever availability of the input source changes. If availability
   * is not known, simply never call this.
   */
  protected setAvailable(value: boolean) {
    this.isAvailable = value;
    this.onAvailable?.(value);
  }

  /**
   * Called after `opts` is updated. Called immediately after constructing with
   * initial opts.
   */
  protected abstract onOptsChanged(
    newOpts: Opts,
    prevOpts: Opts | undefined,
  ): void;

  /** Called when the source should start setting inputs on the viewer. */
  protected abstract onStart(): void;

  /**
   * Called every frame of VR input rendering. Only called if the input source
   * is started.
   */
  protected abstract onUpdate(): void;

  /**
   * Called when the source should stop setting inputs on the viewer and clean
   * up any heavy resources.
   */
  protected abstract onStop(): void;

  /**
   * Called when the source should completely close and clean up all resources.
   */
  protected abstract onDestroy(): void;

  setOpts(opts: Opts) {
    const prevOpts = this.opts;
    this.opts = opts;
    this.onOptsChanged(opts, prevOpts);
  }

  start() {
    this.isStarted = true;
    this.onStart();
  }

  update() {
    this.onUpdate();
  }

  stop() {
    this.isStarted = false;
    this.onStop();
  }

  destroy() {
    this.onDestroy();
  }
}

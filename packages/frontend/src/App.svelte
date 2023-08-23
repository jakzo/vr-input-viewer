<script lang="ts">
  import { onDestroy } from "svelte";
  import { InputViewer } from "@jakzo/vr-input-viewer";

  import Menu from "./components/Menu.svelte";
  import type { Logger, Settings } from "./types.js";
  import Notifications from "./components/Notifications.svelte";
  import ResizeText from "./components/ResizeText.svelte";
  import type {
    VrInputSource,
    VrInputSourceConfigOpt,
    VrInputSourceType,
  } from "./input-sources/VrInputSource.js";

  let log: Logger;

  const LS_SETTINGS_KEY = "vr-input-viewer-settings";
  const DEFAULT_SETTINGS: Settings = {
    controllerLayout: "Generic",
    inputSource: "Websocket",
    inputSourceOpts: {},
    hideHud: false,
    hidePositions: false,
    showStats: false,
  };
  const loadSavedSettings = () => {
    try {
      const savedSettingsStr = localStorage.getItem(LS_SETTINGS_KEY);
      if (!savedSettingsStr) throw new Error("No saved settings");
      const loadedSettings = JSON.parse(savedSettingsStr);
      for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
        if (!(key in loadedSettings)) loadedSettings[key] = value;
      }
      return loadedSettings;
    } catch {
      return DEFAULT_SETTINGS;
    }
  };
  let settings: Settings = loadSavedSettings();
  $: localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));

  export let inputSourceTypes: VrInputSourceType<any>[];
  let inputSources: VrInputSource<any>[] = [];
  let inputSourceAvailability: (boolean | undefined)[];
  const setInputSourceAvailability = () => {
    inputSourceAvailability = inputSources.map((s) => s.isAvailable);
  };
  const getInputSourceOpts = (type: VrInputSourceType<any>) => {
    const { config } = type;
    if (!settings.inputSourceOpts[config.name])
      settings.inputSourceOpts[config.name] = {};
    const values = settings.inputSourceOpts[config.name]!;
    const optEntries = Object.entries(
      config.opts as Record<string, VrInputSourceConfigOpt>
    );
    for (const [key, opt] of optEntries) {
      if (!(key in values)) values[key] = opt.defaultValue;
    }
    const opts = settings.inputSourceOpts[config.name];
    return opts;
  };
  $: if (log) {
    inputSources = inputSourceTypes.map(
      (Type) =>
        inputSources.find((source) => source.constructor === Type) ??
        new Type(log, getInputSourceOpts(Type), setInputSourceAvailability)
    );
    setInputSourceAvailability();
  }
  $: if (settings) {
    for (const inputSource of inputSources)
      inputSource.setOpts(getInputSourceOpts(inputSource.type));
  }
  onDestroy(() => {
    for (const inputSource of inputSources) {
      if (inputSource.isStarted) inputSource.stop();
      inputSource.destroy();
    }
  });

  let activeInputSource: VrInputSource<unknown> | undefined;
  let inputSourceUpdateHandle: number | undefined;
  const inputSourceOnUpdate = () => {
    if (!activeInputSource?.isStarted) {
      inputSourceUpdateHandle = undefined;
      return;
    }
    activeInputSource.update();
    inputSourceUpdateHandle = requestAnimationFrame(inputSourceOnUpdate);
  };
  $: {
    activeInputSource = inputSources.find(
      (s) => s.type.config.name === settings.inputSource
    );
    if (activeInputSource && !activeInputSource.isStarted) {
      activeInputSource.start();
    }
    for (const oldSource of inputSources) {
      if (oldSource === activeInputSource || !oldSource.isStarted) continue;
      oldSource.stop();
    }

    if (activeInputSource && !inputSourceUpdateHandle) {
      inputSourceUpdateHandle = requestAnimationFrame(inputSourceOnUpdate);
    } else if (!activeInputSource && inputSourceUpdateHandle) {
      cancelAnimationFrame(inputSourceUpdateHandle);
      inputSourceUpdateHandle = undefined;
    }
  }

  let inputViewerContainer: HTMLDivElement;
  let inputViewer: InputViewer | undefined = undefined;

  const initInputViewer = () => {
    inputViewer?.remove();
    inputViewer = new InputViewer({
      ...settings,
      container: inputViewerContainer,
      assetsBaseUrl: new URL(
        "vr-input-viewer-assets/",
        window.location.href
      ).toString(),
      webxrInputProfilesBaseUrl: new URL(
        "webxr-input-profiles/",
        window.location.href
      ).toString(),
    });
    // inputViewer.connectController("left");
    // inputViewer.connectController("right");

    for (const inputSource of inputSources) {
      inputSource.inputViewer = inputViewer;
    }
  };

  $: if (inputViewerContainer && settings) initInputViewer();

  onDestroy(() => inputViewer?.remove());

  let onInteraction: () => void;
</script>

<article class="container" on:mousemove={onInteraction}>
  <div class="input-viewer" bind:this={inputViewerContainer} />
  <Menu
    {inputSources}
    {inputSourceAvailability}
    bind:settings
    bind:onInteraction
  />
  <Notifications bind:log />
  <ResizeText />
</article>

<style>
  .container,
  .input-viewer {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

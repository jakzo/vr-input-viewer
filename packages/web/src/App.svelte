<script lang="ts">
  import { onDestroy } from "svelte";
  import { InputViewer } from "@jakzo/vr-input-viewer";

  import Menu from "./lib/Menu.svelte";
  import type { Logger, Settings } from "./types";
  import Notifications from "./lib/Notifications.svelte";
  import ResizeText from "./lib/ResizeText.svelte";
  import { WebsocketInputSource } from "./input-sources/WebsocketInputSource";
  import type {
    VrInputSource,
    VrInputSourceConfigOpt,
  } from "./input-sources/VrInputSource";
  import { WebxrInputSource } from "./input-sources/WebxrInputSource";

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

  let inputSources: VrInputSource[] = [
    new WebsocketInputSource(),
    new WebxrInputSource(),
  ];
  let inputSourceAvailability: boolean[];
  $: for (const inputSource of inputSources) inputSource.log = log;
  $: for (const inputSource of inputSources) {
    const { config } = inputSource.type;
    if (!settings.inputSourceOpts[config.name])
      settings.inputSourceOpts[config.name] = {};
    const values = settings.inputSourceOpts[config.name];
    const optEntries = Object.entries(
      config.opts as Record<string, VrInputSourceConfigOpt>
    );
    for (const [key, opt] of optEntries) {
      if (!(key in values)) values[key] = opt.defaultValue;
    }
    inputSource.setOpts(settings.inputSourceOpts[config.name]);
  }
  $: {
    const setInputSourceAvailability = () => {
      inputSourceAvailability = inputSources.map((s) => s.isAvailable);
    };
    setInputSourceAvailability();
    for (const inputSource of inputSources) {
      inputSource.onAvailable = setInputSourceAvailability;
    }
  }
  onDestroy(() => {
    for (const inputSource of inputSources) {
      if (inputSource.isStarted) inputSource.stop();
      inputSource.destroy();
    }
  });

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
    inputViewer.connectController("left");
    inputViewer.connectController("right");

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

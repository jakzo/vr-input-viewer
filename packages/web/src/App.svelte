<script lang="ts">
  import { InputViewer } from "@jakzo/vr-input-viewer";

  import Menu from "./lib/Menu.svelte";
  import type { Settings } from "./types";
  import { onDestroy } from "svelte";

  const LS_SETTINGS_KEY = "vr-input-viewer-settings";
  const DEFAULT_SETTINGS: Settings = { controllerLayout: "Generic" };

  const loadedSettings = localStorage.getItem(LS_SETTINGS_KEY);
  console.log("=== loadedSettings", loadedSettings);

  let settings: Settings = loadedSettings
    ? JSON.parse(loadedSettings)
    : DEFAULT_SETTINGS;
  let inputViewerContainer: HTMLDivElement;
  let inputViewer: InputViewer | undefined = undefined;

  $: if (inputViewerContainer) {
    inputViewer?.remove();
    inputViewer = new InputViewer({
      ...settings,
      container: inputViewerContainer,
    });
    inputViewer.connectController("left");
    inputViewer.connectController("right");
  }

  onDestroy(() => inputViewer?.remove());

  $: {
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
  }

  let onMouseMove: () => void;
</script>

<main on:mousemove={onMouseMove}>
  <div class="input-viewer" bind:this={inputViewerContainer} />
  <Menu bind:settings bind:onMouseMove />
</main>

<style>
  main,
  .input-viewer {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

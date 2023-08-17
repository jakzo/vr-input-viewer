<script lang="ts">
  import { onDestroy } from "svelte";
  import {
    InputViewer,
    processSerializedMessage,
  } from "@jakzo/vr-input-viewer";

  import Menu from "./lib/Menu.svelte";
  import type { Logger, Settings } from "./types";
  import Notifications from "./lib/Notifications.svelte";

  const LS_SETTINGS_KEY = "vr-input-viewer-settings";
  const DEFAULT_SETTINGS: Settings = {
    controllerLayout: "Generic",
    host: "",
    hideHud: false,
    hidePositions: false,
    showStats: false,
  };

  const WEBSOCKET_RETRY_DELAY = 5_000;

  const loadedSettings = localStorage.getItem(LS_SETTINGS_KEY);

  let log: Logger;
  let settings: Settings = loadedSettings
    ? JSON.parse(loadedSettings)
    : DEFAULT_SETTINGS;
  let inputViewerContainer: HTMLDivElement;
  let inputViewer: InputViewer | undefined = undefined;
  let ws: WebSocket | undefined;
  let wsHost: string;
  let isWsOpen = false;
  let wsRetryTimeout: number;

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
  };

  const connectWebsocket = (host: string, isInitialConnection = false) => {
    closeWebsocket();

    ws = new WebSocket(`ws://${host}:6161/`);
    ws.binaryType = "arraybuffer";
    ws.addEventListener("open", () => {
      log.info("Connected to game");
      isWsOpen = true;
    });
    ws.addEventListener("error", () => {
      if (isWsOpen) log.warn("Connection error");
      else if (isInitialConnection) {
        log.warn(
          `Failed to connect to ${
            host === "127.0.0.1" ? "this device" : host
          }, will retry in background...`
        );
      }
    });
    ws.addEventListener("close", () => {
      if (isWsOpen) log.info("Connection closed");
      ws = undefined;
      wsRetryTimeout = window.setTimeout(
        connectWebsocket,
        WEBSOCKET_RETRY_DELAY,
        host
      );
    });
    ws.addEventListener(
      "message",
      (evt: MessageEvent<ArrayBuffer | string>) => {
        if (typeof evt.data === "string") {
        } else if (inputViewer) {
          processSerializedMessage(inputViewer, evt.data);
        }
      }
    );
  };

  const closeWebsocket = () => {
    clearTimeout(wsRetryTimeout);
    ws?.close();
    ws = undefined;
  };

  $: if (inputViewerContainer && settings) initInputViewer();
  $: localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
  $: {
    const host = settings.host || "127.0.0.1";
    if (host !== wsHost) {
      wsHost = host;
      connectWebsocket(host, true);
    }
  }

  onDestroy(() => {
    inputViewer?.remove();
    closeWebsocket();
  });

  let onInteraction: () => void;
</script>

<main on:mousemove={onInteraction}>
  <div class="input-viewer" bind:this={inputViewerContainer} />
  <Menu bind:settings bind:onInteraction />
  <Notifications bind:log />
</main>

<style>
  main,
  .input-viewer {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
</style>

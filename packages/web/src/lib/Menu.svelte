<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { layouts } from "@jakzo/vr-input-viewer";

  import type { Settings } from "../types";

  export let settings: Settings;
  const changeSetting = <K extends keyof Settings>(
    setting: K,
    value: Settings[K]
  ) => {
    settings = { ...settings, [setting]: value };
  };

  let isOpen = true;
  const openMenu = () => {
    isOpen = true;
  };
  const closeMenu = () => {
    isOpen = false;
    onInteraction();
  };

  const MENU_BUTTON_FADE_DELAY = 3000;
  let menuButtonTimeout: number;
  let cursorIdle = false;
  export const onInteraction = () => {
    cursorIdle = false;
    clearTimeout(menuButtonTimeout);
    menuButtonTimeout = window.setTimeout(
      markCursorIdle,
      MENU_BUTTON_FADE_DELAY
    );
  };
  const markCursorIdle = () => {
    cursorIdle = true;
  };
  onMount(onInteraction);

  const onKeyDown = (evt: KeyboardEvent) => {
    if (!isOpen) return;
    if (evt.key === "Escape") closeMenu();
  };
  onMount(() => {
    document.addEventListener("keydown", onKeyDown);
  });
  onDestroy(() => {
    document.removeEventListener("keydown", onKeyDown);
  });
</script>

{#if !isOpen && !cursorIdle}
  <button class="menu-button" transition:fade on:click={openMenu}>
    ⚙️ Menu
  </button>
{/if}

{#if isOpen}
  <div
    class="blanket"
    role="presentation"
    on:click={closeMenu}
    transition:fade
  />
  <div
    class="dialog"
    role="dialog"
    aria-labelledby="title"
    aria-modal="true"
    transition:fade
    on:submit|preventDefault={closeMenu}
  >
    <div class="form-container">
      <form>
        <h2 class="title">Menu</h2>

        <label for="host">Host (IP address):</label>
        <div class="text-input">
          <input
            id="host"
            type="text"
            value={settings.host}
            on:change={(evt) => changeSetting("host", evt.currentTarget.value)}
            placeholder="127.0.0.1"
            aria-describedby="host-tip"
          />
          <span class="tip" id="host-tip">
            Enter the IP address or hostname of the VR device (leave empty for
            this device).
          </span>
        </div>

        <label for="controller-layout">Controller layout:</label>
        <select
          id="controller-layout"
          on:change={(evt) =>
            changeSetting("controllerLayout", evt.currentTarget.value)}
        >
          {#each layouts as key (key)}
            <option value={key} selected={settings.controllerLayout === key}>
              {key}
            </option>
          {/each}
        </select>

        <label for="hide-hud">Hide controller inputs:</label>
        <div>
          <input
            id="hide-hud"
            type="checkbox"
            checked={settings.hideHud}
            on:change={(evt) =>
              changeSetting("hideHud", evt.currentTarget.checked)}
          />
        </div>

        <label for="hide-positions">Hide positions:</label>
        <div>
          <input
            id="hide-positions"
            type="checkbox"
            checked={settings.hidePositions}
            on:change={(evt) =>
              changeSetting("hidePositions", evt.currentTarget.checked)}
            aria-describedby="hide-positions-tip"
          />
          <span class="tip" id="hide-positions-tip">
            Hides 3D headset/controller position view.
          </span>
        </div>

        <label for="show-stats">Show render stats:</label>
        <div>
          <input
            id="show-stats"
            type="checkbox"
            checked={settings.showStats}
            on:change={(evt) =>
              changeSetting("showStats", evt.currentTarget.checked)}
            aria-describedby="show-stats-tip"
          />
          <span class="tip" id="show-stats-tip">
            Shows rendering statistics like FPS for the 3D position view.
          </span>
        </div>
      </form>
    </div>

    <button class="close-button" aria-label="Close" on:click={closeMenu}>
      🆇
    </button>
  </div>
{/if}

<style>
  .dialog,
  .blanket {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .blanket {
    background: rgba(0, 0, 0, 0.2);
  }

  .menu-button {
    position: absolute;
    top: 16px;
    left: 16px;
    font-size: 1.5rem;
    background: rgba(50, 50, 50, 0.5);
  }

  .dialog {
    position: absolute;
    top: 32px;
    left: 32px;
    right: 32px;
    bottom: 32px;
    background: rgba(50, 50, 50, 0.9);
    border-radius: 3px;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 1.5rem;
    background: transparent;
    padding: 4px 8px;
  }

  .form-container {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 8px;
    padding: 8px;
    overflow: auto;
  }

  .dialog form {
    display: grid;
    gap: 1rem;
    grid-template-columns: 2fr 3fr;
    align-items: center;
  }

  .dialog .title {
    grid-column: 1 / 3;
    margin: 0;
  }

  .text-input {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.2rem;
  }

  .tip {
    grid-column: 1 / 3;
    font-size: 0.8rem;
    color: #dddddd;
  }
</style>

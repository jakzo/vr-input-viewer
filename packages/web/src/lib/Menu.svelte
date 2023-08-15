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
    onMouseMove();
  };

  const MENU_BUTTON_FADE_DELAY = 3000;
  let menuButtonTimeout: number;
  let cursorIdle = false;
  export const onMouseMove = () => {
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
  onMount(onMouseMove);

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
  <form
    class="dialog"
    role="dialog"
    aria-label="Menu"
    aria-modal="true"
    transition:fade
    on:submit|preventDefault={closeMenu}
  >
    <button class="close-button" aria-label="Close" on:click={closeMenu}>
      🆇
    </button>

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
  </form>
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
    font-size: 1.5em;
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
    padding: 16px;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 1.5em;
    background: transparent;
    padding: 4px 8px;
  }
</style>

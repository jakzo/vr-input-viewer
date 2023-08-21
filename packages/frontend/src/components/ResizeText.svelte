<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const SIZE_TEXT_HIDE_DELAY = 3000;

  let width = 0;
  let height = 0;
  let hideTextTimeout: number;
  let showSizeText = false;

  const onResize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    showSizeText = true;
    clearTimeout(hideTextTimeout);
    hideTextTimeout = window.setTimeout(
      () => (showSizeText = false),
      SIZE_TEXT_HIDE_DELAY
    );
  };

  onMount(() => window.addEventListener("resize", onResize));
  onDestroy(() => window.removeEventListener("resize", onResize));
</script>

{#if showSizeText}
  <span class="size-text" transition:fade>{width}x{height}</span>
{/if}

<style>
  .size-text {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 2rem;
    text-shadow: -2px -2px 1px #000000, 2px -2px 1px #000000,
      -2px 2px 1px #000000, 2px 2px 1px #000000;
    pointer-events: none;
  }
</style>

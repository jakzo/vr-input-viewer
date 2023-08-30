<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Logger } from "../types.js";

  interface Notification {
    idx: number;
    type: keyof Logger;
    text: string;
  }

  const NOTIFICATION_DURATION = 10_000;

  let currentIdx = 0;
  let notifications: Notification[] = [];

  const createLogFn =
    (type: keyof Logger) =>
    (...data: unknown[]) => {
      console[type](...data);

      const notification: Notification = {
        idx: currentIdx++,
        type,
        text: data.map(String).join(" "),
      };
      notifications = [...notifications, notification];

      setTimeout(() => {
        notifications = notifications.filter((notif) => notif !== notification);
      }, NOTIFICATION_DURATION);
    };

  export const log: Logger = {
    info: createLogFn("info"),
    warn: createLogFn("warn"),
    error: createLogFn("error"),
  };
</script>

<div class="container">
  {#each notifications as notif (notif.idx)}
    <div class="notification {notif.type}" transition:fade>{notif.text}</div>
  {/each}
</div>

<style>
  .container {
    position: absolute;
    top: 0;
    left: 72px;
    right: 72px;
    pointer-events: none;
  }

  .notification {
    background: #444;
    border-radius: 4px;
    padding: 4px 8px;
    margin: 16px;
    color: white;
    box-shadow: 4px 4px 16px rgba(0, 0, 0, 0.2);
  }

  .notification.info {
    background: #44c;
  }
  .notification.warn {
    background: #773;
  }
  .notification.error {
    background: #933;
  }
</style>

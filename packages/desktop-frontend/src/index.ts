import "@jakzo/vr-input-viewer-frontend/src/app.css";

import DesktopApp from "./DesktopApp.svelte";

export const startApp = () =>
  new DesktopApp({
    target: document.getElementById("app")!,
  });

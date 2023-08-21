// Separate package for frontend since this one's package.json has module type
// set to CommonJS and we need it to be ESM for imports to ESM in Svelte files
import { startApp } from "@jakzo/vr-input-viewer-desktop-frontend";

import { rendererCreateBridge } from "./tipc/renderer.js";
import type { bridge } from "./bridge.js";

startApp();

const api = rendererCreateBridge<typeof bridge>();

setInterval(async () => {
  console.log("=== ping", await api.ping());
}, 5000);

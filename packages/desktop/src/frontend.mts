// Separate package for frontend since this one's package.json has module type
// set to CommonJS and we need it to be ESM for imports to ESM in Svelte files
import { startApp } from "@jakzo/vr-input-viewer-desktop-frontend";

import { rendererCreateBridge } from "./tipc/renderer.js";
import type { vrFfiBridge } from "./vr-ffi-bridge.js";

window.vrFfiBridge = rendererCreateBridge<typeof vrFfiBridge>();

startApp();

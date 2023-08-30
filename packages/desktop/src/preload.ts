import { contextBridge } from "electron";

import { preloadExposeBridge } from "./tipc/preload.js";

preloadExposeBridge();

contextBridge.exposeInMainWorld("platform", {
  getPlatform: () => process.platform,
});

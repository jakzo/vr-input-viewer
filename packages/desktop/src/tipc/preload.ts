import { contextBridge, ipcRenderer } from "electron";

import { DEFAULT_CHANNEL, exposedVarName } from "./utils";

export const preloadExposeBridge = (channel = DEFAULT_CHANNEL) => {
  contextBridge.exposeInMainWorld(
    exposedVarName(channel),
    (...args: unknown[]) => ipcRenderer.invoke(channel, ...args),
  );
};

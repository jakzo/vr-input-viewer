import { ipcMain } from "electron";
import { BridgeApi, DEFAULT_CHANNEL } from "./utils";

export const declareBridgeApi = <Api extends BridgeApi>(api: Api): Api => api;

export const mainListenBridge = <Api extends BridgeApi>(
  api: Api,
  channel = DEFAULT_CHANNEL,
) => {
  ipcMain.handle(channel, (_evt, key, args) => {
    if (!Object.hasOwn(api, key))
      throw new TypeError(`api.${key} is not a function`);
    return api[key]!(...args);
  });
};

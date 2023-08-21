import { ipcMain } from "electron";
import { BridgeApi, Json, DEFAULT_CHANNEL } from "./utils";

export const declareBridgeApi = <Api extends BridgeApi>(
  api: Api & {
    [K in keyof Api]: (
      ...args: Parameters<Api[K]> extends infer Args extends unknown[]
        ? { [I in keyof Args]: Args[I] extends Json ? Args[I] : Json }
        : never
    ) => ReturnType<Api[K]> extends Promise<Json> ? ReturnType<Api[K]> : Json;
  },
): Api => api;

export const mainListenBridge = (api: BridgeApi, channel = DEFAULT_CHANNEL) => {
  ipcMain.handle(channel, (_evt, key, args) => {
    if (!Object.hasOwn(api, key))
      throw new TypeError(`api.${key} is not a function`);
    return api[key]!(...args);
  });
};

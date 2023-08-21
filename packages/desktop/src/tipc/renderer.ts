import { BridgeApi, DEFAULT_CHANNEL, Json, exposedVarName } from "./utils";

export const rendererCreateBridge = <Api extends BridgeApi>(
  channel = DEFAULT_CHANNEL,
): Api =>
  new Proxy({} as Api, {
    get: (target, key: string) =>
      target[key] ??
      Object.assign(target, {
        [key]: (...args: Json[]) =>
          window[exposedVarName(channel) as keyof Window](key, args),
      })[key],
  });

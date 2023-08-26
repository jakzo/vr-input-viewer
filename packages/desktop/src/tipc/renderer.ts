import { BridgeApi, DEFAULT_CHANNEL, exposedVarName } from "./utils";

export const rendererCreateBridge = <Api extends BridgeApi>(
  channel = DEFAULT_CHANNEL,
): Api =>
  new Proxy({} as Api, {
    get: (target, key: string) =>
      target[key] ??
      Object.assign(target, {
        [key]: (...args: unknown[]) =>
          window[exposedVarName(channel) as keyof Window](key, args),
      })[key],
  });

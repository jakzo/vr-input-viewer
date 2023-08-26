export type BridgeApi = Record<
  string,
  (...args: unknown[]) => Promise<unknown>
>;

export const DEFAULT_CHANNEL = "tipc";

export const exposedVarName = (channel: string) => `tipcBridge_${channel}`;

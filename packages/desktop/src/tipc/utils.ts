export type JsonPrimitive = null | boolean | number | string;
export type Json = JsonPrimitive | Json[] | { [key: string]: Json };

export type BridgeApi = Record<string, (...args: any[]) => Promise<any>>;

export const DEFAULT_CHANNEL = "tipc";

export const exposedVarName = (channel: string) => `tipcBridge_${channel}`;

For messing around with API:

```ts
// npx tsx
const {
  default: { OpenVR },
} = await import("./packages/vr-ffi/src/index.ts");
system = OpenVR.Init(OpenVR.VRApplicationType.Background);
```

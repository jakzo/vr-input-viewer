<script lang="ts">
  import { App, WebsocketInputSource } from "@jakzo/vr-input-viewer-frontend";
  import { OpenvrInputSource } from "./input-sources/OpenvrInputSource.js";

  const platform = window.platform.getPlatform();
</script>

<App
  inputSourceTypes={[
    ...(platform !== "darwin" ? [OpenvrInputSource] : []),
    WebsocketInputSource,
  ]}
/>

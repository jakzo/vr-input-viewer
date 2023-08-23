<script lang="ts">
  import { App, WebsocketInputSource } from "@jakzo/vr-input-viewer-frontend";
  import { OpenvrInputSource } from "./input-sources/OpenvrInputSource.js";
</script>

<App inputSourceTypes={[WebsocketInputSource, OpenvrInputSource]} />

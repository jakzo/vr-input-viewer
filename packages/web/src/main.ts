import "@jakzo/vr-input-viewer-frontend/src/app.css";
import WebApp from "./WebApp.svelte";

const app = new WebApp({
  target: document.getElementById("app")!,
});

export default app;

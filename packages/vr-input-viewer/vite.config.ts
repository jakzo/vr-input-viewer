import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      formats: ["es"],
      name: "@jakzo/vr-input-viewer",
    },
    sourcemap: true,
  },
});

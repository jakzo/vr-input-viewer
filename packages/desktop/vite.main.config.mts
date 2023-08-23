import { defineConfig } from "vite";
import { generateMonorepoAliases } from "../config/src/vite.js";

export default defineConfig({
  resolve: {
    browserField: false,
    conditions: ["node"],
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: generateMonorepoAliases(),
  },
  build: {
    rollupOptions: {
      external: ["openvr"],
    },
  },
});

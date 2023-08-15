import path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { getPackagesSync } from "@manypkg/get-packages";

const { packages } = getPackagesSync(path.join(__dirname, "..", ".."));

export default defineConfig({
  resolve: {
    alias: Object.fromEntries(
      packages.map((pkg) => [
        pkg.packageJson.name,
        path.join(pkg.dir, "src", "index.ts"),
      ]),
    ),
  },
  plugins: [svelte()],
});

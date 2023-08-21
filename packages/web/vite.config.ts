import path from "path";
import fs from "fs";
import { defineConfig, normalizePath } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { getPackagesSync } from "@manypkg/get-packages";
import { viteStaticCopy } from "vite-plugin-static-copy";
import nodeModulesPaths from "resolve/lib/node-modules-paths.js";
import { VitePWA } from "vite-plugin-pwa";

const { packages } = getPackagesSync(path.join(__dirname, "..", ".."));

// Built-in require can't do this because the package's main points to a .json file :/
const resolveDep = (name: string, from = __dirname) => {
  for (const nodeModulesDir of nodeModulesPaths(from)) {
    const dir = path.join(nodeModulesDir, name);
    if (fs.existsSync(dir)) return normalizePath(path.relative(from, dir));
  }
  throw new Error(`Node module directory not found for: ${name}`);
};

const regexEscape = (str: string) =>
  str.replace(/([()[\]./\\?$^*+|])/g, "\\$1");

export default defineConfig({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: "../vr-input-viewer/assets/*",
          dest: "vr-input-viewer-assets",
        },
        {
          src: `${resolveDep("@webxr-input-profiles/assets")}/dist/profiles/*`,
          dest: "webxr-input-profiles",
        },
      ],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["**"],
      manifest: {
        background_color: "#000000",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icon.svg",
            sizes: "512x512",
            type: "image/svg",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: packages.map((pkg) => ({
      find: new RegExp(`^${regexEscape(pkg.packageJson.name)}$`),
      replacement: path.join(pkg.dir, "src", "index.ts"),
    })),
  },
});

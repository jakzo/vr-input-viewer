import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { UserConfig, normalizePath } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { getPackagesSync } from "@manypkg/get-packages";
import { viteStaticCopy } from "vite-plugin-static-copy";
import nodeModulesPaths from "resolve/lib/node-modules-paths.js";
import { VitePWA } from "vite-plugin-pwa";

const { packages } = getPackagesSync(
  fileURLToPath(new URL("../../..", import.meta.url)),
);

// Built-in require can't do this because the package's main points to a .json file :/
const resolveDep = (
  name: string,
  from = fileURLToPath(new URL("..", import.meta.url)),
) => {
  for (const nodeModulesDir of nodeModulesPaths(from)) {
    const dir = path.join(nodeModulesDir, name);
    if (fs.existsSync(dir)) return normalizePath(path.relative(from, dir));
  }
  throw new Error(`Node module directory not found for: ${name}`);
};

const regexEscape = (str: string) =>
  str.replace(/([()[\]./\\?$^*+|])/g, "\\$1");

export const generateMonorepoAliases = () =>
  packages.flatMap((pkg) => [
    {
      find: new RegExp(`^${regexEscape(pkg.packageJson.name)}$`),
      replacement: path.join(pkg.dir, "src", "index.ts"),
    },
    {
      find: new RegExp(`^${regexEscape(pkg.packageJson.name)}/dist/(.+)`),
      replacement: path.join(pkg.dir, "src", "$1"),
    },
  ]);

export const createViteConfig = () => {
  const config: UserConfig = {
    plugins: [
      svelte(),
      viteStaticCopy({
        targets: [
          {
            src: "../vr-input-viewer/assets/*",
            dest: "vr-input-viewer-assets",
          },
          {
            src: `${resolveDep(
              "@webxr-input-profiles/assets",
            )}/dist/profiles/*`,
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
      alias: generateMonorepoAliases(),
    },
  };
  return config;
};

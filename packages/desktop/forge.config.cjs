const path = require("path");

/** @type Partial<Record<NodeJS.Platform, string>> */
const iconFilenames = { win32: "icon.ico", darwin: "icon.icns" };

/** @type import("@electron-forge/shared-types").ForgeConfig */
const config = {
  packagerConfig: {
    name: "VrInputViewer",
    icon: path.join(
      __dirname,
      "assets",
      iconFilenames[process.platform] ?? "icon.png",
    ),
    asar: { unpack: "*.{node,dll}" },
    ...(process.env["APP_VERSION"]
      ? { appVersion: process.env["APP_VERSION"] }
      : {}),
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {
        name: "VrInputViewer",
      },
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["win32", "darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
  plugins: [
    {
      name: "@electron-forge/plugin-auto-unpack-natives",
      config: {},
    },
    {
      name: "@electron-forge/plugin-vite",
      config: {
        build: [
          {
            entry: "src/main.ts",
            config: "vite.main.config.mts",
          },
          {
            entry: "src/preload.ts",
            config: "vite.preload.config.mts",
          },
        ],
        renderer: [
          {
            name: "main_window",
            config: "vite.renderer.config.mts",
          },
        ],
      },
    },
  ],
};

module.exports = config;

const path = require("path");

/** @type import("@electron-forge/shared-types").ForgeConfig */
const config = {
  packagerConfig: {
    asar: true,
    name: "VrInputViewer",
    icon: path.join(__dirname, "assets", "icon.png"),
    ...(process.env["APP_VERSION"]
      ? { appVersion: process.env["APP_VERSION"] }
      : {}),
  },
  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-zip",
      platforms: ["darwin"],
      config: {
        icon: path.join(__dirname, "assets", "icon.icns"),
      },
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

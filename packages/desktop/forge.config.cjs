/** @type import("@electron-forge/shared-types").ForgeConfig */
const config = {
  packagerConfig: {
    asar: true,
    extraResource: [],
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

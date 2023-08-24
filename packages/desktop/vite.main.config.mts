import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import { defineConfig } from "vite";
import { generateMonorepoAliases } from "../config/src/vite.js";

const copyFolder = async (src: string, dest: string) => {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

const isDev = true;

export default defineConfig({
  plugins: [
    ...(isDev
      ? [
          {
            name: "Copy vr-ffi native modules",
            async writeBundle() {
              const srcPath = fileURLToPath(
                new URL("../vr-ffi/build/Release", import.meta.url),
              );
              const destPath = fileURLToPath(
                new URL("./build/Release", import.meta.url),
              );
              await copyFolder(srcPath, destPath);
            },
          },
        ]
      : []),
  ],
  resolve: {
    browserField: false,
    conditions: ["node"],
    mainFields: ["module", "jsnext:main", "jsnext"],
    alias: generateMonorepoAliases(),
  },
});

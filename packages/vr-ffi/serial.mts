import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const srcDir = fileURLToPath(new URL("./src/OpenVR/cpp", import.meta.url));
for (const name of await fs.readdir(srcDir)) {
  const contents = await fs.readFile(path.join(srcDir, name), "utf8");
  console.log(`\n// === ${name} ===\n\n${contents}`);
}

import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));
for (const name of await fs.readdir(srcDir)) {
  if (![".cpp", ".h"].some((ext) => name.endsWith(ext))) continue;
  const contents = await fs.readFile(path.join(srcDir, name), "utf8");
  console.log(`\n// === ${name} ===\n\n${contents}`);
}

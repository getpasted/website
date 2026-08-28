import { readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "dist", "index.html");
const serverEntry = path.join(root, ".prerender", "prerender.js");
const { render } = await import(serverEntry);
const html = await readFile(outputPath, "utf8");
const marker = '<div id="root"></div>';

if (!html.includes(marker)) {
  throw new Error(`Missing prerender marker in ${outputPath}`);
}

await writeFile(outputPath, html.replace(marker, `<div id="root">${render()}</div>`));
await rm(path.join(root, ".prerender"), { recursive: true, force: true });

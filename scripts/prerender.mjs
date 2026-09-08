import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
const manifest = JSON.parse(await readFile(path.join(root, "dist", ".vite", "manifest.json"), "utf8"));
const storyStyles = manifest["src/StorySections.tsx"].css;
if (!storyStyles?.length) throw new Error("Missing story stylesheet in build manifest");

// Keep this direct-link archive out of search results and the public sitemap.
const storyHtml = html
  .replace("</head>", `${storyStyles.map(file => `<link rel="stylesheet" href="/${file}" />`).join("\n")}\n</head>`)
  .replace(/<title>[^<]+<\/title>/, '<title>The Pasted Story</title>')
  .replace('content="index, follow"', 'content="noindex, nofollow"')
  .replace(/(<link rel="canonical" href=")[^"]+/, '$1https://getpasted.app/story/')
  .replace(/(<meta property="og:url" content=")[^"]+/, '$1https://getpasted.app/story/')
  .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]+/g, '$1The Pasted Story')
  .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]+/g, '$1The stories and experiments behind Pasted.')
  .replace(/    <script type="application\/ld\+json">[\s\S]*?<\/script>\n/, '');
await mkdir(path.join(root, "dist", "story"), { recursive: true });
await writeFile(path.join(root, "dist", "story", "index.html"), storyHtml.replace(marker, `<div id="root">${render(true)}</div>`));
await rm(path.join(root, ".prerender"), { recursive: true, force: true });

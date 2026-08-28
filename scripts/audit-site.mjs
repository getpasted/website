import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const requiredPages = ["features", "download", "cli", "privacy"];
const index = await readFile(path.join(dist, "index.html"), "utf8");

assert.match(index, /<title>Pasted — Private, Local Clipboard Manager for macOS<\/title>/);
assert.match(index, /<div id="root">[\s\S]{0,200}<div class="site-shell"/);
assert.doesNotMatch(index, /<div id="root"><\/div>/);

const structuredDataMatch = index.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
assert.ok(structuredDataMatch, "Homepage must include JSON-LD structured data");
JSON.parse(structuredDataMatch[1]);

const sitemap = await readFile(path.join(dist, "sitemap.xml"), "utf8");
for (const page of requiredPages) {
  await access(path.join(dist, page, "index.html"));
  assert.match(sitemap, new RegExp(`<loc>https://getpasted\\.app/${page}/</loc>`));
}

const thanks = await readFile(path.join(dist, "thanks", "index.html"), "utf8");
const notFound = await readFile(path.join(dist, "404.html"), "utf8");
assert.match(thanks, /<meta name="robots" content="noindex, nofollow"/);
assert.match(notFound, /<meta name="robots" content="noindex, follow"/);

await assert.rejects(access(path.join(dist, "copycat", "viewer.html")));
await assert.rejects(access(path.join(dist, "copycat", "README.md")));

console.log("Site audit passed: prerendering, metadata, indexable pages, and deploy assets are valid.");

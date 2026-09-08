import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
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

await access(path.join(dist, "favicon-48.png"));
await access(path.join(dist, "apple-touch-icon.png"));
assert.match(index, /<link rel="icon" href="\/favicon-48\.png" type="image\/png" sizes="48x48" \/>/);
assert.match(index, /<link rel="apple-touch-icon" href="\/apple-touch-icon\.png" sizes="180x180" \/>/);

const captureDirectory = path.join(dist, "app-captures");
const captureFiles = await readdir(captureDirectory);
const captureMasters = captureFiles.filter(file => file.endsWith("-4x.png"));
assert.equal(captureMasters.length, 17, "Expected every cinematic capture master");
for (const master of captureMasters) {
  const basename = master.slice(0, -4);
  assert.ok(captureFiles.includes(`${basename}.webp`), `Missing lossless WebP for ${master}`);
  assert.ok(captureFiles.includes(`${basename}-1600w.webp`), `Missing responsive WebP for ${master}`);
}
assert.equal(captureFiles.filter(file => file.endsWith(".jpg")).length, 0, "Retired gallery captures must not ship");
assert.doesNotMatch(index, /factorio/i);

const thanks = await readFile(path.join(dist, "thanks", "index.html"), "utf8");
const notFound = await readFile(path.join(dist, "404.html"), "utf8");
assert.match(thanks, /<meta name="robots" content="noindex, nofollow"/);
assert.match(notFound, /<meta name="robots" content="noindex, follow"/);

await assert.rejects(access(path.join(dist, "copycat", "viewer.html")));
await assert.rejects(access(path.join(dist, "copycat", "README.md")));

console.log("Site audit passed: prerendering, metadata, indexable pages, and deploy assets are valid.");

const story = await readFile(path.join(dist, "story", "index.html"), "utf8");
assert.match(story, /<title>The Pasted Story<\/title>/);
assert.match(story, /<meta name="robots" content="noindex, nofollow"/);
assert.match(story, /<link rel="canonical" href="https:\/\/getpasted\.app\/story\/"/);
assert.doesNotMatch(story, /<div id="root"><\/div>/);
assert.doesNotMatch(sitemap, /\/story\//);
assert.doesNotMatch(index, /href="\/story(?:\/|#|")/);
for (const section of ["enemy-section", "clipboard-lab", "guide-section", "story-section", "journey-section", "feature-section", "split-section", "cli-section", "prior-art-section", "resolution-section"]) {
  assert.ok(story.includes(`class="${section}"`), `Story must retain ${section}`);
  assert.ok(!index.includes(`class="${section}"`), `${section} must leave the homepage`);
}
for (const section of ["hero", "cinematic-app-sequence", "covenant-section", "release-section", "feedback-section", "final-cta"]) {
  assert.ok(index.includes(`class="${section}"`), `Homepage must retain ${section}`);
  assert.ok(!story.includes(`class="${section}"`), `${section} must remain on the homepage only`);
}
assert.match(index, /<div class="chapter-mark"><p>The Copycat Covenant<\/p>/);
console.log("Story archive passed: sections preserved, homepage scoped, and archive unlisted.");

assert.doesNotMatch(index, /class="memory-trail"/);
assert.match(story, /class="memory-trail"/);

const manifest = JSON.parse(await readFile(path.join(dist, ".vite", "manifest.json"), "utf8"));
const homeEntry = manifest["index.html"];
const storyEntry = manifest["src/StorySections.tsx"];
assert.ok(storyEntry.isDynamicEntry, "Story must load separately from the homepage");
for (const file of storyEntry.css) {
  assert.ok(story.includes(`href="/${file}"`), "Story styles must work before hydration");
  assert.ok(!index.includes(`href="/${file}"`), "Homepage must not load story styles");
}
const homeScript = await readFile(path.join(dist, homeEntry.file), "utf8");
assert.doesNotMatch(homeScript, /CLIPBOARD TRAIL|The enemy has no memory|Scratch the record/);
for (const file of homeEntry.css) {
  const css = await readFile(path.join(dist, file), "utf8");
  assert.doesNotMatch(css, /\.memory-trail|\.enemy-section|\.clipboard-lab|\.cli-section/);
}
console.log("Homepage asset isolation passed.");

// Validate destinations, not merely the presence of links in the footer.
for (const page of ["", ...requiredPages, "story"]) {
  const content = await readFile(path.join(dist, page, "index.html"), "utf8");
  const footer = content.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
  assert.ok(footer, `Missing footer on /${page}`);
  for (const [, href] of footer.matchAll(/href="([^"]*)"/g)) {
    assert.ok(href && href !== "#", "Footer links need a destination");
    const destination = new URL(href, `https://getpasted.app/${page ? `${page}/` : ""}`);
    if (destination.origin !== "https://getpasted.app") {
      assert.equal(destination.protocol, "https:");
      continue;
    }
    const target = path.join(dist, destination.pathname, "index.html");
    const targetHtml = await readFile(target, "utf8");
    if (destination.hash) assert.ok(targetHtml.includes(`id="${destination.hash.slice(1)}"`), `Missing footer anchor ${href}`);
  }
}
console.log("Footer destinations passed: every local page and anchor exists.");

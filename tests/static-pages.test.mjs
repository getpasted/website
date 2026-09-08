import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { createServer } from "vite";
import { staticPages } from "../scripts/static-pages.ts";

test("preview directory links serve their own pages instead of the SPA homepage", async () => {
  const cacheDir = await mkdtemp(path.join(tmpdir(), "pasted-preview-test-"));
  const server = await createServer({
    cacheDir,
    configFile: false,
    plugins: [staticPages()],
    server: { host: "127.0.0.1", port: 0 },
  });
  try {
    await server.listen();
    const base = `http://127.0.0.1:${server.httpServer.address().port}`;
    for (const [page, title] of [
      ["features", "Pasted Features"], ["download", "Download Pasted"],
      ["cli", "Pasted CLI"], ["privacy", "Pasted Privacy"], ["thanks", "You backed Pasted"],
    ]) {
      for (const suffix of ["/", "?test=directory-link"]) {
        const response = await fetch(`${base}/${page}${suffix}`);
        assert.equal(response.status, 200);
        assert.ok((await response.text()).includes(`<title>${title}`), `${page}${suffix} must serve its own content`);
      }
    }
  } finally {
    await server.close();
    await rm(cacheDir, { recursive: true, force: true });
  }
});

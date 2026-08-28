import assert from "node:assert/strict";
import test from "node:test";
import { selectPublicRelease } from "../src/releases.ts";

const asset = name => ({ name, browser_download_url: `https://example.test/${name}` });
const versionedRelease = {
  name: "Pasted 1.0.0 RC7",
  tag_name: "v1.0.0-rc.7",
  html_url: "https://example.test/releases/rc7",
  prerelease: true,
  draft: false,
  assets: [
    asset("Pasted_1.0.0-rc.7_universal.dmg"),
    asset("Pasted_1.0.0-rc.7_amd64.AppImage"),
  ],
};

test("ignores mutable updater channel releases", () => {
  const updaterChannel = {
    ...versionedRelease,
    name: "Pasted updater channel",
    tag_name: "updater-prerelease",
    html_url: "https://example.test/releases/updater-prerelease",
    assets: [asset("latest.json")],
  };

  assert.equal(selectPublicRelease([updaterChannel, versionedRelease]), versionedRelease);
});

test("requires both primary public installers", () => {
  const incompleteRelease = {
    ...versionedRelease,
    tag_name: "v1.0.0",
    prerelease: false,
    assets: [asset("Pasted_1.0.0_universal.dmg")],
  };

  assert.equal(selectPublicRelease([incompleteRelease]), undefined);
});

test("accepts a complete stable release", () => {
  const stableRelease = {
    ...versionedRelease,
    name: "Pasted 1.0.0",
    tag_name: "v1.0.0",
    prerelease: false,
  };

  assert.equal(selectPublicRelease([stableRelease]), stableRelease);
});

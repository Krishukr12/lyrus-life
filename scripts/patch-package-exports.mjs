#!/usr/bin/env node
/**
 * Point workspace package exports at compiled dist/ output for production runtime.
 * Dev keeps src/ exports in package.json; Docker runs this after tsc.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packages = [
  "auth",
  "db",
  "shared",
  "mom-pdf",
  "nlu",
  "notifications",
  "transcription",
];

for (const name of packages) {
  const pkgPath = resolve("packages", name, "package.json");
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
  pkg.exports = { ".": "./dist/index.js" };
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`patched exports -> dist: @lyrus/${name}`);
}

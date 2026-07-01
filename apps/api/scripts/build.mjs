import { globSync } from "node:fs";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const apiRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = resolve(apiRoot, "src");
const entryPoints = globSync("**/*.ts", { cwd: srcRoot }).map((file) => resolve(srcRoot, file));

mkdirSync(resolve(apiRoot, "dist"), { recursive: true });

await esbuild.build({
  entryPoints,
  outdir: resolve(apiRoot, "dist"),
  outbase: srcRoot,
  platform: "node",
  format: "esm",
  target: "node22",
  packages: "external",
  logLevel: "info",
});

console.log(`api package transpiled ${entryPoints.length} files to dist/`);

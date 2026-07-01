import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const pkgRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const entryPoints = ["src/index.ts", "src/load-env.ts", "src/pg-config.ts"];

execSync("prisma generate", { cwd: pkgRoot, stdio: "inherit" });

mkdirSync(resolve(pkgRoot, "dist"), { recursive: true });

for (const entry of entryPoints) {
  const outfile = resolve(pkgRoot, entry.replace(/^src\//, "dist/").replace(/\.ts$/, ".js"));
  await esbuild.build({
    entryPoints: [resolve(pkgRoot, entry)],
    outfile,
    platform: "node",
    format: "esm",
    target: "node22",
    packages: "external",
    logLevel: "info",
  });
}

console.log("db package transpiled to dist/");

#!/usr/bin/env node
/**
 * Prisma 7 requires Node 20.19+, 22.12+, or 24.0+ (Node 23 is unsupported).
 */
const major = Number(process.versions.node.split(".")[0]);
const minor = Number(process.versions.node.split(".")[1] ?? 0);

const ok =
  (major === 20 && minor >= 19) ||
  (major === 22 && minor >= 12) ||
  major >= 24;

if (!ok) {
  console.error(
    [
      "",
      "Unsupported Node.js version:",
      `  ${process.version}`,
      "",
      "Prisma 7 needs Node 20.19+, 22.12+, or 24.0+.",
      "Node 23 is not supported.",
      "",
      "Fix (pick one):",
      "  nvm install && nvm use",
      '  brew install node@22 && export PATH="/opt/homebrew/opt/node@22/bin:$PATH"',
      "",
    ].join("\n"),
  );
  process.exit(1);
}

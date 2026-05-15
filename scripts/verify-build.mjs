// Verifies the static build output exists before `cap sync` runs.
// Capacitor needs `dist/client/index.html` — if it's missing, fail loud
// with a helpful message instead of letting `cap sync` produce a cryptic
// "Could not find the web assets directory" error.
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const WEB_DIR = resolve(process.cwd(), "dist/client");
const INDEX = resolve(WEB_DIR, "index.html");
const SHELL = resolve(WEB_DIR, "_shell.html");

function fail(msg) {
  console.error("\n✗ verify-build failed:");
  console.error("  " + msg.replace(/\n/g, "\n  "));
  console.error(
    "\n  Try running `npm run build` first. If the problem persists,",
  );
  console.error("  delete `dist/` and rebuild from a clean state.\n");
  process.exit(1);
}

if (!existsSync(WEB_DIR) || !statSync(WEB_DIR).isDirectory()) {
  fail(`Expected build folder not found: ${WEB_DIR}`);
}

if (!existsSync(INDEX)) {
  if (existsSync(SHELL)) {
    fail(
      `Found _shell.html but no index.html in ${WEB_DIR}.\n` +
        "The `postbuild` script that copies _shell.html → index.html did not run.",
    );
  }
  fail(`No index.html in ${WEB_DIR}.`);
}

const size = statSync(INDEX).size;
if (size < 200) {
  fail(`index.html exists but looks empty (${size} bytes).`);
}

console.log(`✓ verify-build: dist/client/index.html ready (${size} bytes)`);

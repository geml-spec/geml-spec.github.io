#!/usr/bin/env node
// Bundle the playground: the parser's pure core + the viewer's renderer +
// KaTeX + Mermaid into one browser IIFE, public/playground/playground.js, with
// KaTeX's woff2 fonts beside it. This is the viewer package's own
// playground.build.mjs with its paths pointed at a geml checkout, so the site
// owns the step now that entry.js lives here.
//
//   GEML_SRC=../geml node scripts/build-playground.mjs
//
// Needs: <GEML_SRC>/geml-parser built (npm run build) and
//        <GEML_SRC>/integrations/geml-viewer installed (npm ci).
import { existsSync, mkdirSync, readdirSync, copyFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.env.GEML_SRC ?? join(site, "..", "geml"));
const viewer = join(src, "integrations", "geml-viewer");
const parserDist = join(src, "geml-parser", "dist");
const pg = join(site, "public", "playground");

for (const [what, p] of [["the parser build", join(parserDist, "geml.js")], ["the viewer's node_modules", join(viewer, "node_modules", "esbuild")]]) {
  if (!existsSync(p)) { console.error(`playground: ${what} is missing at ${p}`); process.exit(1); }
}

const esbuild = await import(pathToFileURL(join(viewer, "node_modules", "esbuild", "lib", "main.js")).href);
const stub = join(viewer, "src", "node-stub.js");

await esbuild.build({
  entryPoints: [join(pg, "entry.js")],
  bundle: true,
  format: "iife",
  platform: "browser",
  target: "chrome110",
  outfile: join(pg, "playground.js"),
  loader: { ".css": "text" },
  define: { "process.argv": "[]", "import.meta.url": "\"\"" },
  alias: {
    // entry.js imports these bare names; the checkout supplies them.
    "geml-parser-dist": parserDist,
    "geml-viewer-src": join(viewer, "src"),
    "node:fs": stub, "node:path": stub, "node:crypto": stub, "node:url": stub, "node:child_process": stub, "node:os": stub,
  },
  nodePaths: [join(viewer, "node_modules")],   // katex, mermaid
  logLevel: "info",
});

const fontsSrc = join(viewer, "node_modules", "katex", "dist", "fonts");
const fontsDst = join(pg, "fonts");
mkdirSync(fontsDst, { recursive: true });
let n = 0;
for (const f of readdirSync(fontsSrc)) if (f.endsWith(".woff2")) { copyFileSync(join(fontsSrc, f), join(fontsDst, f)); n++; }
console.log(`playground: built playground.js and copied ${n} KaTeX fonts`);

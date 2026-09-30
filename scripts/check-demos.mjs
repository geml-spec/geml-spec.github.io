#!/usr/bin/env node
// `geml check` on every demo document the site ships, with the parser the
// site is built from. The codemap is generated and verified by its own build;
// everything else under public/playground is authored and must be clean.
//
//   GEML_SRC=../geml node scripts/check-demos.mjs
import { readdirSync, existsSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.env.GEML_SRC ?? join(site, "..", "geml"));
const geml = join(src, "geml-parser", "dist", "geml.js");
// The root is public/, not public/playground: the style demo embeds
// ../../docs/PUBLISHING.geml, which the sync places at public/docs/.
const root = join(site, "public");
const demos = join(root, "playground");
if (!existsSync(geml)) { console.error(`check: the parser is not built at ${geml}`); process.exit(1); }

const files = [];
(function walk(dir) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name);
    if (d.isDirectory()) { if (!["codemap", "node_modules", "fonts", "_build"].includes(d.name)) walk(p); }
    else if (d.name.endsWith(".geml")) files.push(p);
  }
})(demos);

let failed = 0;
for (const f of files) {
  const r = spawnSync(process.execPath, [geml, "check", f, "--root", root], { encoding: "utf8" });
  if (r.status !== 0) { failed++; process.stdout.write(`✗ ${relative(site, f)}\n${r.stdout}${r.stderr}`); }
}
console.log(`check: ${files.length - failed} of ${files.length} demo documents clean`);
process.exit(failed ? 1 : 0);

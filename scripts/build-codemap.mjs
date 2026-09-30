#!/usr/bin/env node
// The parser's own call graph, as the playground's codemap demo: index the
// parser and the viewer with scip-typescript, build one merged graph with
// `geml codemap build`, verify it, render it. Output: public/playground/codemap.
//
//   GEML_SRC=../geml node scripts/build-codemap.mjs
//
// Needs both packages installed (npm ci) and the parser built.
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.env.GEML_SRC ?? join(site, "..", "geml"));
const geml = join(src, "geml-parser", "dist", "geml.js");
const out = join(site, "public", "playground", "codemap");
const build = join(site, ".vitepress", "cache", "codemap-build");

if (!existsSync(geml)) { console.error(`codemap: the parser is not built at ${geml}`); process.exit(1); }
rmSync(out, { recursive: true, force: true });
mkdirSync(build, { recursive: true });

function run(argv, cwd = site) {
  const r = spawnSync(argv[0], argv.slice(1), { cwd, stdio: "inherit", shell: process.platform === "win32" });
  if (r.status !== 0) { console.error(`codemap: ${argv.join(" ")} exited ${r.status}`); process.exit(r.status ?? 1); }
}

run(["npx", "--yes", "@sourcegraph/scip-typescript", "index", "--output", join(build, "parser.scip")], join(src, "geml-parser"));
run(["npx", "--yes", "@sourcegraph/scip-typescript", "index", "--output", join(build, "viewer.scip")], join(src, "integrations", "geml-viewer"));
run([process.execPath, geml, "codemap", "build",
  "--adapter", "scip", "--raw", join(build, "parser.scip"),
  "--adapter", "scip", "--raw", join(build, "viewer.scip"),
  "--root", src, "--out", out, "--container", "file", "--build", build]);
run([process.execPath, geml, "codemap", "verify", out]);
run([process.execPath, geml, "codemap", "render", out]);
console.log(`codemap: built ${out}`);

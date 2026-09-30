#!/usr/bin/env node
// Pull the pages this site does not author — the specification, the profiles,
// the GEPs, the guides, the changelog, the illustrated syntax pages — out of a
// geml-spec/geml checkout, so the site can never drift from them.
//
//   GEML_SRC=../geml node scripts/sync-geml.mjs      (GEML_SRC defaults to ../geml)
//
// Each Markdown file is copied to its route under reference/ or guide/ with:
//   - a front matter title (the first H1),
//   - a one-line provenance note linking the exact commit,
//   - relative links rewritten: to a synced page's route when the target is
//     synced, to the file on GitHub otherwise; images to raw.githubusercontent,
//   - `{{`, `}}` and `<tag` escaped OUTSIDE code, which Vue would otherwise
//     read as interpolation and elements (VitePress renders through Vue).
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, copyFileSync } from "node:fs";
import { dirname, join, resolve, posix } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const site = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = resolve(process.env.GEML_SRC ?? join(site, "..", "geml"));
if (!existsSync(join(src, "spec", "GEML-spec.md"))) {
  console.error(`sync: no geml checkout at ${src} (set GEML_SRC)`);
  process.exit(1);
}
let sha = "main";
try { sha = execFileSync("git", ["-C", src, "rev-parse", "HEAD"], { encoding: "utf8" }).trim(); } catch {}
const blob = (p) => `https://github.com/geml-spec/geml/blob/${sha}/${p}`;
const raw = (p) => `https://raw.githubusercontent.com/geml-spec/geml/${sha}/${p}`;

// repo path → site route (no extension; an index route ends in /)
const routes = new Map([
  ["spec/GEML-spec.md", "reference/spec"],
  ["spec/GEML-spec_CN.md", "reference/spec-cn"],
  ["spec/profiles/README.md", "reference/profiles/"],
  ["spec/proposals/README.md", "reference/geps/"],
  ["docs/mcp-guide.md", "guide/mcp"],
  ["docs/mcp-guide_CN.md", "guide/mcp-cn"],
  ["docs/WRITING-A-PARSER.md", "guide/writing-a-parser"],
  ["docs/WRITING-A-PARSER_CN.md", "guide/writing-a-parser-cn"],
  ["docs/MANIFESTO.md", "guide/manifesto"],
  ["docs/MANIFESTO_CN.md", "guide/manifesto-cn"],
  ["docs/comparisons/COMPARISON.md", "guide/comparison"],
  ["docs/comparisons/COMPARISON_CN.md", "guide/comparison-cn"],
  ["docs/comparisons/GEML-vs-CommonMark.md", "guide/geml-vs-commonmark"],
  ["docs/comparisons/GEML-vs-CommonMark_CN.md", "guide/geml-vs-commonmark-cn"],
  ["docs/comparisons/GEML-vs-XML-and-JSON.md", "guide/geml-vs-xml-and-json"],
  ["docs/comparisons/GEML-vs-XML-and-JSON_CN.md", "guide/geml-vs-xml-and-json-cn"],
  ["CHANGELOG.md", "reference/changelog"],
]);
for (const d of readdirSync(join(src, "spec", "profiles"), { withFileTypes: true })) {
  if (!d.isDirectory()) continue;
  routes.set(`spec/profiles/${d.name}/${d.name}-profile.md`, `reference/profiles/${d.name}`);
  routes.set(`spec/profiles/${d.name}/${d.name}-profile_CN.md`, `reference/profiles/${d.name}-cn`);
}
for (const f of readdirSync(join(src, "spec", "proposals"))) {
  const m = /^(\d{4}-[a-z0-9-]+)\.md$/.exec(f);
  if (m && m[1] !== "0000-template") routes.set(`spec/proposals/${f}`, `reference/geps/${m[1]}`);
}

const outFile = (route) => join(site, route.endsWith("/") ? `${route}index.md` : `${route}.md`);
const href = (route) => "/" + route;

// Rewrite one link target found in `file` (a repo path).
function rewrite(target, file) {
  if (/^(?:[a-z]+:|#|\/)/i.test(target)) return target;   // absolute, fragment, site-absolute
  const [path, frag = ""] = target.split("#");
  const resolved = posix.normalize(posix.join(posix.dirname(file), path));
  const hash = frag ? `#${frag}` : "";
  if (routes.has(resolved)) return href(routes.get(resolved)) + hash;
  if (routes.has(resolved + ".md")) return href(routes.get(resolved + ".md")) + hash;   // a link written without .md
  if (resolved.endsWith("/") && routes.has(resolved + "README.md")) return href(routes.get(resolved + "README.md")) + hash;
  if (resolved.startsWith("..")) return target;              // above the repo: leave it
  return blob(resolved) + hash;
}

// Escape outside code: fenced blocks (``` / ~~~) and inline spans (`…`).
function escapeForVue(text) {
  const out = [];
  let fence = null;
  for (const line of text.split("\n")) {
    const open = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
    if (fence) { out.push(line); if (open && open[1][0] === fence[0] && open[1].length >= fence.length) fence = null; continue; }
    if (open) { fence = open[1]; out.push(line); continue; }
    out.push(line.replace(/(`+)([\s\S]*?)\1|([^`]+)/g, (m, ticks, code, plain) => {
      if (plain !== undefined) {
        return plain.replace(/\{\{/g, "&#123;&#123;").replace(/\}\}/g, "&#125;&#125;").replace(/<(?=[A-Za-z\/!?])/g, "&lt;");
      }
      // Inline code: markdown-it escapes entities inside backticks, so the
      // only way to keep `{{…}}` literal is a raw <code v-pre> element.
      if (!/\{\{|\}\}/.test(code)) return m;
      const html = code.trim().replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<code v-pre>${html}</code>`;
    }));
  }
  return out.join("\n");
}

function convert(file) {
  let text = readFileSync(join(src, file), "utf8");
  const h1 = /^#\s+(.+?)\s*(?:\{#[^}]*\})?\s*$/m.exec(text);
  const title = h1 ? h1[1].replace(/[*_`]/g, "") : posix.basename(file, ".md");
  // links and images
  text = text.replace(/(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (m, bang, label, target, t) => {
    if (bang) return `![${label}](${/^(?:[a-z]+:|\/)/i.test(target) ? target : raw(posix.normalize(posix.join(posix.dirname(file), target)))}${t})`;
    return `[${label}](${rewrite(target, file)}${t})`;
  });
  // reference-style definitions: [label]: path
  text = text.replace(/^(\s{0,3}\[[^\]]+\]:\s*)(\S+)/gm, (m, head, target) => head + rewrite(target, file));
  text = escapeForVue(text);
  const note = `> Synced from [\`geml-spec/geml\`](${blob(file)}) at \`${sha.slice(0, 7)}\` — edit it there.\n\n`;
  return `---\ntitle: "${title.replace(/"/g, '\\"')}"\noutline: [2, 3]\n---\n\n${note}${text}`;
}

for (const dir of ["reference", "guide"]) rmSync(join(site, dir), { recursive: true, force: true });
let n = 0;
for (const [file, route] of routes) {
  if (!existsSync(join(src, file))) { console.warn(`sync: missing ${file}`); continue; }
  const out = outFile(route);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, convert(file));
  n++;
}

// The style demo replicates a GitHub blob page OF docs/PUBLISHING.geml and
// embeds it by relative path (../../docs/PUBLISHING.geml from
// public/playground/style-demo), so that document and the ones it links to
// travel with the site, under public/docs/.
const pubOut = join(site, "public", "docs");
rmSync(pubOut, { recursive: true, force: true });
mkdirSync(pubOut, { recursive: true });
for (const f of ["PUBLISHING.geml", "PUBLISHING_CN.geml", "PUBLISHING.md", "PUBLISHING_CN.md"]) {
  if (existsSync(join(src, "docs", f))) copyFileSync(join(src, "docs", f), join(pubOut, f));
}

// The illustrated syntax pages are self-contained HTML: served as-is.
const ill = join(src, "docs", "illustrated");
const illOut = join(site, "public", "illustrated");
rmSync(illOut, { recursive: true, force: true });
mkdirSync(illOut, { recursive: true });
let h = 0;
for (const f of readdirSync(ill)) if (f.endsWith(".html")) { copyFileSync(join(ill, f), join(illOut, f)); h++; }

console.log(`sync: ${n} pages and ${h} illustrated pages from geml-spec/geml@${sha.slice(0, 7)}`);

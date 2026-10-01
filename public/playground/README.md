# GEML playground

A zero-dependency, static web playground: edit GEML on the left, see it rendered
on the right, and watch the validity pill flip to red the moment a reference
breaks. It's the project's pitch in one link — the thing to put above the fold in
the README and at the top of a Show HN.

`index.html` + `playground.js` + the chapter files + `fonts/` are fully
self-contained (no CDN, no network). Everything renders for real: derived views,
`geml-chart` (inline SVG), **math via bundled KaTeX**, and **diagrams via
bundled Mermaid**. Bundling both makes `playground.js` a few MB — the price of a
self-contained, offline showcase.

## The seven chapters

The tour is seven real `.geml` files sitting in this folder. The chapter bar
loads one into the editor; `#ch=<slug>` in the URL selects one directly.

| slug | file | what it shows |
|---|---|---|
| `basics` | `ch01-basics.geml` | meta interpolation, flow prose, `note`, lists, footnotes, `[[#id]]` |
| `relation` | `ch02-relation.geml` | `table` holds facts · `view` derives: `where` `order` `limit` `select` `by` `aggregate` `compute` `summary`, and a view reading a view |
| `coordinates` | `ch03-coordinates.geml` | `#id[2]["Q1"]`, `#id["Q1"]`, `#id[summary][…]`, a `data` value tree, `#meta["key"]` |
| `data` | `ch04-data.geml` | `format=json` / `jsonl` / `yaml`, and a chart bound to the jsonl by reference |
| `visual` | `ch05-visual.geml` | charts by reference, KaTeX, Mermaid, and the repository's own codemap |
| `reuse` | `ch06-reuse.geml` | `![[#id]]` inline projection, block embeds, a cross-file chain, `part=head` |
| `projection` | `ch07-projection.geml` | GEP-0010 language projection of `ch07-source.geml`, four axes side by side |

`sample.geml` is the **eighth** entry and writes none of that content: it is an
index that transcludes the seven, so the same files serve the chapter editor and
the single-page tour that the READMEs link to as a raw file. Changing a chapter
changes the tour — there is no second copy to update.

Every one of them is `geml check`-clean; CI would catch it if one were not.

This folder holds only what the playground loads. The demos that are watched
rather than edited — the page-layout demo, the media cuts, the showcase — are in
[`../examples/`](../examples/README.md).

## Where `playground.js`, `fonts/` and `codemap/` come from

They are made from the parser and pushed here by
[geml-spec/geml](https://github.com/geml-spec/geml): its `website` workflow runs
`integrations/website/update.mjs` on every change to its `main`.

- `playground.js` bundles the reference parser, the viewer's renderer, KaTeX and
  Mermaid into one file (`integrations/geml-viewer/playground.build.mjs`, entry
  `playground-entry.js`); `fonts/` holds KaTeX's fonts beside it.
- `codemap/` is the parser's and the viewer's **own** call graph — one GEML
  document per source file plus a module index, and the CLI-rendered `.html`
  next to each — which the `geml-code-graph` section of `ch05-visual.geml` draws.

Edit them in geml, not here: the next push overwrites them.

## Host it

All of it is committed, so any static host serves this folder as it is.
Locally: `python -m http.server` in this folder, open `localhost:8000`.

---
title: Demos
outline: [2, 3]
---

# Demos

Everything on this page is built from real documents in this site's `public/playground/` folder, with the parser version the site was built from.

## Playground

<a href="/playground/" target="_blank">Open the playground</a> — edit on the left, rendered on the right, and the verdict flips red the moment a reference breaks. Seven chapters, each a real `.geml` file:

| Chapter | What it shows |
|---|---|
| basics | meta interpolation, prose, `note`, lists, footnotes, `[[#id]]` |
| relation | a `table` holds facts, a `view` derives: `where` `order` `limit` `select` `by` `aggregate` `compute` `summary` |
| coordinates | `#id[2]["Q1"]`, `#id["Q1"]`, `#id[summary][…]`, a `data` value tree, `#meta["key"]` |
| data | `format=json` / `jsonl` / `yaml`, and a chart bound to the jsonl by reference |
| visual | charts by reference, KaTeX, Mermaid, and this repository's own code graph |
| reuse | `![[#id]]` inline projection, block embeds, a cross-file chain, `part=head` |
| projection | a language projection of `ch07-source.geml`, four axes side by side |

## The parser's own code graph

<a href="/playground/codemap/" target="_blank">Browse the call graph</a> of `@geml/geml` and the viewer, laid out as GEML documents by `geml codemap build`: every method a block with an id, `#calls` / `#called-by` edges both ways. It is rebuilt from the parser's source on every deploy, and every document in it passes `geml check`.

## A page laid out from a document — `geml-style`

[`playground/style-demo/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/playground/style-demo) is a 1:1 replica of a GitHub blob page: `page.geml` holds every string, `github.style.geml` holds every colour and length, and the viewer knows about neither. It needs the [Chrome extension](https://chromewebstore.google.com/detail/opmhfphgoidpnipphfgkhhjhmnmaenie) and a local server; the folder's README says why.

## A cut built from one document — `geml-media`

<a href="/playground/geml-media-demo/play.html" target="_blank">Play the 10-second sample</a>: one cut document, one command (`geml media build ep01-cut.geml --out ep01.mp4 --burn-subs`), and ffmpeg does the rest. Assets are synthetic (ffmpeg's test source), so the repository ships no media it does not own.

## An episode made end to end — `geml-media`

`geml-media-explainer/episode/` is a 36-second motion-comic episode produced from a four-line synopsis by a loop that only asks `geml media todo` what is missing, makes it, and logs it. Shots are composed from layers — three scene plates and seven character stands generated once — so every shot has the same face and the same room by construction, and changing one word (a coat's colour) makes `geml check` name exactly the 26 items that are now stale.

- <a href="/playground/geml-media-explainer/episode/out/ep01.mp4" target="_blank">Watch the episode</a> (720×1280, 36 s, bilingual subtitles)
- [How it was made](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/playground/geml-media-explainer) — every image, voice and cut is a logged generation; the whole pipeline runs on one laptop with open-weight models and no accounts.

## Illustrated syntax

Eleven short pages, one construct each, rendered side by side with its source: <a href="/illustrated/01-simple-blocks.html" target="_blank">blocks</a>, <a href="/illustrated/02-code-data.html" target="_blank">code and data</a>, <a href="/illustrated/03-table-view.html" target="_blank">table and view</a>, <a href="/illustrated/04-diagram.html" target="_blank">diagrams</a>, <a href="/illustrated/05-embed.html" target="_blank">embeds</a>, <a href="/illustrated/06-form.html" target="_blank">forms</a>, <a href="/illustrated/07-cli.html" target="_blank">the CLI</a>, and the <a href="/illustrated/08-profile-history.html" target="_blank">history</a>, <a href="/illustrated/09-profile-codemap.html" target="_blank">codemap</a>, <a href="/illustrated/10-profile-style.html" target="_blank">style</a> and <a href="/illustrated/11-profile-translator.html" target="_blank">translator</a> profiles.

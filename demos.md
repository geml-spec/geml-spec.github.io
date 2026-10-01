---
title: Demos
outline: [2, 3]
---

# Demos

The demos below are built from real documents in this site's `public/examples/` folder (the code graph is the playground's own, in `public/playground/codemap/`), with the parser version the site was built from. The illustrated pages at the end are static (`public/illustrated/`): every output on them was recorded from a real run of the parser when the page was written.

## The parser's own code graph

<a href="/playground/codemap/" target="_blank">Browse the call graph</a> of `@geml/geml` and the viewer, laid out as GEML documents by `geml codemap build`: every method a block with an id, `#calls` / `#called-by` edges both ways. It is rebuilt from the parser's source on every deploy, and every document in it passes `geml check`.

## A page laid out from a document — `geml-style`

[`examples/style-demo/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/examples/style-demo) is a 1:1 replica of a GitHub blob page: `page.geml` holds every string, `github.style.geml` holds every colour and length, and the viewer knows about neither. It needs the [Chrome extension](https://chromewebstore.google.com/detail/opmhfphgoidpnipphfgkhhjhmnmaenie) and a local server; the folder's README says why.

## A cut built from one document — `geml-media`

<a href="/examples/geml-media-demo/play.html" target="_blank">Play the 10-second sample</a>: one cut document, one command (`geml media build ep01-cut.geml --out ep01.mp4 --burn-subs`), and ffmpeg does the rest. Assets are synthetic (ffmpeg's test source), so the repository ships no media it does not own.

## An episode made end to end — `geml-media`

`geml-media-explainer/episode/` is a 36-second motion-comic episode produced from a four-line synopsis by a loop that only asks `geml media todo` what is missing, makes it, and logs it. Shots are composed from layers — three scene plates and seven character stands generated once — so every shot has the same face and the same room by construction, and changing one word (a coat's colour) makes `geml check` name exactly the 26 items that are now stale.

- <a href="/examples/geml-media-explainer/episode/out/ep01.mp4" target="_blank">Watch the episode</a> (720×1280, 36 s, bilingual subtitles)
- [How it was made](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/examples/geml-media-explainer) — every image, voice and cut is a logged generation; the whole pipeline runs on one laptop with open-weight models and no accounts.

## Illustrated syntax

Eleven short pages, one construct each, rendered side by side with its source: <a href="/illustrated/01-simple-blocks.html" target="_blank">blocks</a>, <a href="/illustrated/02-code-data.html" target="_blank">code and data</a>, <a href="/illustrated/03-table-view.html" target="_blank">table and view</a>, <a href="/illustrated/04-diagram.html" target="_blank">diagrams</a>, <a href="/illustrated/05-embed.html" target="_blank">embeds</a>, <a href="/illustrated/06-form.html" target="_blank">forms</a>, <a href="/illustrated/07-cli.html" target="_blank">the CLI</a>, and the <a href="/illustrated/08-profile-history.html" target="_blank">history</a>, <a href="/illustrated/09-profile-codemap.html" target="_blank">codemap</a>, <a href="/illustrated/10-profile-style.html" target="_blank">style</a> and <a href="/illustrated/11-profile-translator.html" target="_blank">translator</a> profiles.
Each page opens with a decision board — one row per rule: the rule, where it is written, its status — then one plate per case, GEML on the left and the processor's real output on the right, and ends with the evidence. Every page has a Chinese twin: swap `.html` for `_CN.html`.

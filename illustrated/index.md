---
title: "Illustrated syntax: every GEML block, verb and profile"
description: "One page per GEML construct: the rules on a decision board with where each is written, then GEML on the left and the processor's real output on the right."
---

# Illustrated syntax

One page per construct. Each opens with a decision board — one row per rule: the
rule, where it is written, its status — then one plate per case, GEML on the left
and the processor's real output on the right, and ends with the evidence. Every
output was recorded from a real run of the parser when the page was written.

## Block types

| Page | 中文 | What it shows |
|---|---|---|
| <a href="/illustrated/01-simple-blocks.html" target="_self">The simple four: meta, math, note, text</a> | <a href="/illustrated/01-simple-blocks_CN.html" target="_self">中文</a> | GEML's four smallest block types, meta, math, note and text, and the fence, id and attribute rules every block shares, each shown with real geml check output. |
| <a href="/illustrated/02-code-data.html" target="_self">code and data</a> | <a href="/illustrated/02-code-data_CN.html" target="_self">中文</a> | GEML's code and data blocks: code holds text the processor never interprets, data a value that must parse, one src= route syntax for both, all measured. |
| <a href="/illustrated/03-table-view.html" target="_self">table and view</a> | <a href="/illustrated/03-table-view_CN.html" target="_self">中文</a> | GEML's table block, every rule measured: two bodies, one model, a closed arithmetic, a summary row; then the view draft from GEP-0012, spec and draft marked. |
| <a href="/illustrated/04-diagram.html" target="_self">diagram</a> | <a href="/illustrated/04-diagram_CN.html" target="_self">中文</a> | GEML's diagram block two ways: an external DSL passed through verbatim, and the built-in geml-chart bound to a table, where a wrong column fails the build. |
| <a href="/illustrated/05-embed.html" target="_self">embed</a> | <a href="/illustrated/05-embed_CN.html" target="_self">中文</a> | GEML's embed block: src= brings in a section, a block or a run of prose from another document; part=, scheme and cycle rules and inline ![[#id]], all measured. |
| <a href="/illustrated/06-form.html" target="_self">form (proposal)</a> | <a href="/illustrated/06-form_CN.html" target="_self">中文</a> | The GEML form proposal (GEP-0008, draft) and the geml-form/v1 profile: fifteen design decisions, each drawn as GEML beside the control a host would render. |

## The CLI

| Page | 中文 | What it shows |
|---|---|---|
| <a href="/illustrated/07-cli.html" target="_self">The geml CLI</a> | <a href="/illustrated/07-cli_CN.html" target="_self">中文</a> | Every geml CLI verb run on one small document: convert between json, html, md and geml, read and write by block, validate; each address form and exit code. |

## Profiles

| Page | 中文 | What it shows |
|---|---|---|
| <a href="/illustrated/08-profile-history.html" target="_self">geml-history</a> | <a href="/illustrated/08-profile-history_CN.html" target="_self">中文</a> | geml-history/v1: a .gemlhistory sidecar of reverse patches and snapshots beside each .geml rebuilds any old version without git or a network. Four verbs run. |
| <a href="/illustrated/09-profile-codemap.html" target="_self">geml-codemap</a> | <a href="/illustrated/09-profile-codemap_CN.html" target="_self">中文</a> | geml-codemap/v1: a codebase's call graph as GEML documents, one per container, methods as code blocks, edges as CSV tables, shown on the parser's own code map. |
| <a href="/illustrated/10-profile-style.html" target="_self">geml-style</a> | <a href="/illustrated/10-profile-style_CN.html" target="_self">中文</a> | geml-style/v1: a stylesheet is an ordinary .geml that selects into a document without touching it. No scripts, ambiguity fails the build; 13 diagnostics run. |
| <a href="/illustrated/11-profile-translator.html" target="_self">geml-translator</a> | <a href="/illustrated/11-profile-translator_CN.html" target="_self">中文</a> | geml-translator/v1: a translation is an embed-only projection of its source, translate-to= on each block, so it cannot drift from the source it translates. |

## Comparisons

| Page | 中文 | What it shows |
|---|---|---|
| <a href="/illustrated/geml-style-vs-css.html" target="_self">geml-style against CSS</a> | <a href="/illustrated/geml-style-vs-css_CN.html" target="_self">中文</a> | geml-style against CSS on ten dimensions: on eight a restricted subset of CSS; on two, where content goes and ambiguity as an error, different on purpose. |
| <a href="/illustrated/geml-vs-markdown-variants.html" target="_self">The Markdown Variants Map</a> | <a href="/illustrated/geml-vs-markdown-variants_CN.html" target="_self">中文</a> | The projects on the awesome-markdown list that patch or replace Markdown, one by one: what each does, where it meets GEML and where it goes another way. |
| <a href="/illustrated/geml-vs-carve.html" target="_self">GEML and Carve</a> | <a href="/illustrated/geml-vs-carve_CN.html" target="_self">中文</a> | GEML and Carve side by side: 82 constructs and every capability, the same inputs through both official parsers, and where each design came from. One is built for typesetting, one for agents. |

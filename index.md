---
layout: home
footer: false
title: GEML
titleTemplate: A lightweight markup language with uniform, addressable blocks and standard verbs
head:
  - - script
    - type: application/ld+json
    - '{"@context":"https://schema.org","@type":"WebSite","name":"GEML","alternateName":"General Expressive Markup Language","url":"https://geml-spec.github.io/"}'

hero:
  name: GEML
  text: A lightweight markup language with uniform, addressable blocks and standard verbs.
  tagline: Easy for humans to read, safe for agents to mutate.
  # Under the tagline, smaller (theme/index.ts, HeroLede).
  lede: Plain text people read. Blocks with names that agents get, set, add and delete, each with its own history to revert — and a write that would break the document is refused. Works on the Markdown you already have.
  image:
    light: /logo/geml-logo-light.svg
    dark: /logo/geml-logo-dark.svg
    alt: GEML
  actions:
    - theme: brand
      text: Open Playground
      link: /playground/
      target: _blank
    - theme: alt
      text: Install
      link: /get-started
    - theme: alt
      text: Cheat sheet
      link: /cheat-sheet

features:
  - title: Specified
    details: A 1.0 specification, a conformance suite of 429 cases, and CI that checks the specification — itself a GEML document — on every push.
    link: https://github.com/geml-spec/geml/blob/main/spec/GEML-spec.md
    linkText: Read the spec
  - title: Verbs, not rewrites
    details: list, find, get, set, add, delete, revert. The same names as MCP tools, so a terminal and an agent speak one vocabulary.
    link: /get-started
    linkText: Get started
  - title: Extensible by vocabulary
    details: One block shape, frozen. New domains — history, code graphs, styling, media — are profiles, each with its own conformance file.
    link: https://github.com/geml-spec/geml/tree/main/spec/profiles
    linkText: See the profiles
---

## Syntax at a glance

In GEML — the General Expressive Markup Language — every kind of content is one block shape: `=== type {attributes}`, a body, `===`. Headings are blocks too, and every block has a name.

```
=== meta
title = "Budget plan"
===

# Budget plan {#top}

Prose with *emphasis*, a [[#fy25]] reference and a footnote[^addr].

=== table {#fy25 format=csv header=1}
Segment,  Q1, Q2, Q3, Q4
Cloud,     8, 10, 12, 14
Platform,  5,  6,  7,  9
===

=== view {#fy25-total src=#fy25 compute="FY = Q1 + Q2 + Q3 + Q4"}
===

=== diagram {#rev format=geml-chart data=#fy25-total type=bar x=Segment y=FY}
===

=== embed {src=#fy25}
===

=== note {#addr}
Every block above has an address.
===
```

| Construct | Syntax |
|---|---|
| Typed block | `=== type {#id key=value}` … `===` |
| Heading with an id | `## Title {#id}` — derived from the text when omitted |
| Reference | `[[#id]]` · across documents `[[doc.geml#id]]` |
| Link | `[text](https://example.com)` |
| Embed (a projection, not a copy) | `=== embed {src=doc.geml#id}` |
| Inline projection | `![[doc.geml#id]]` |
| Table | pipes, or `=== table {format=csv header=1}` |
| Derived view | `=== view {src=#table compute="…" summary="…"}` |
| One cell, one leaf | `#fy25[2]["Q1"]` · `#intake["fields"][1]["name"]` |
| Data | `=== data {format=json}` (also `jsonl`, `yaml`, `edn`) |
| Chart bound to data | `=== diagram {format=geml-chart data=#id type=bar x=… y=…}` |
| Meta value in prose | `{{title}}` |
| Footnote | `[^note]` … `=== note {#note}` — any block with that id |
| Hidden block · author note | `{hidden}` · a line starting with `%%` |
| Prose as a block | `=== text {#id}` … `===` |
| Vocabulary | `profile = "geml-media/v1"` in `=== meta` |

The [cheat sheet](/cheat-sheet) lists every construct with an example. The [playground](/playground/) has seven chapters, each a real `.geml` file you can edit.

## Verbs on your Markdown

Nothing is converted. `plan.md` stays `plan.md`; every heading is an address.

```console
$ geml list plan.md
#data-warehouse-migration  heading  h1    L1-39   Data warehouse migration
#summary                   heading  h2    L3-8    Summary
#migration-plan            heading  h2    L9-17   Migration plan
#capacity-and-cost         heading  h2    L18-27  Capacity and cost
#risks                     heading  h2    L28-33  Risks
#open-questions            heading  h2    L34-39  Open questions

$ geml set plan.md '#migration-plan' --in new-plan.md
wrote plan.md
$ git diff --stat
 plan.md | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)

$ geml set plan.md '#risks' --in bad.md
error: replacement would break the document: unresolved reference `#checksum-job` (line 30); not written
exit=1

$ geml revert plan.md '#summary' --rev changed
reverted #summary to 20260929T133449Z-6b606e52
```

`get` reads one section. `set` replaces one section and leaves every other byte alone. A write whose result would be broken is refused before it reaches disk. `revert` rolls one section back and keeps the edits made elsewhere in the meantime.

Headings are as fine as Markdown goes. When a section is too coarse — a table, one cell, a chart that must agree with its table — the `.geml` format gives every block a name and every cell a coordinate.

## Install

```sh
npm i -g @geml/geml                    # the geml command (Node 22+)
npx -y @geml/geml skill install        # Claude Code: authoring skill + CLI + MCP server, user-global
claude mcp add --scope user geml -- npx -y @geml/geml mcp --root .   # or any MCP client
```

Read `.geml` in the browser with the [Chrome extension](https://chromewebstore.google.com/detail/opmhfphgoidpnipphfgkhhjhmnmaenie); editor and agent integrations are listed under [Get Started](/get-started).

## Why GEML

- **A name for every block.** Pointing at a place costs one word, not a quoted paragraph.
- **A write that is checked before it lands.** A broken reference is refused with a diagnostic and a non-zero exit — a gate an agent loop can stand behind.
- **A reference is a lookup, not a copy.** An embed, a chart bound to a table, a view over data: the value exists once, so copies cannot drift.
- **History at the grain of the mistake.** A `.gemlhistory` sidecar rolls one block back and leaves concurrent edits alone.
- **One grammar, many vocabularies.** Code graphs, styling, media production and revision history are profiles of the same block shape, each checked by `geml check`.

## Scope

- **Not a Markdown dialect.** The verbs run on your `.md` unchanged; `.geml` is a separate language with one normative specification and a conformance suite, and it projects back to Markdown or HTML with `--to md|html` — block ids and live charts are reported as lost, not hidden.
- **On Markdown, addressing stops at headings.** Cells, views and bound charts need `.geml`.
- **Validation stops broken structure, not bad prose.** A mangled paragraph with valid links passes `check`; that is what `revert` is for.
- **Not a database.** No index, no transactions. It borrows a database's operations, not its runtime.
- **Young.** Spec 1.0 is stable and self-hosted. Besides the reference parser there is one independent implementation, [geml-parser-rs](https://github.com/geml-spec/geml/tree/main/geml-parser-rs) (Rust + WebAssembly), written from the specification and its conformance suite alone; it passes all 429 cases.

## Influences

- **Markdown** — plain text that reads clean is the ground everything stands on; GEML reads it as input.
- **REST** — one naming scheme and one set of verbs, so no client needs to know each server.
- **XInclude and Sphinx cross-references** — an embed evaluates; a reference is checked.
- **Make** — every artifact records its inputs, so a change names what is stale.
- **djot** — a grammar that parses in linear time with no ambiguity is kinder to people, tools and models alike.

## Reference

- [Specification](https://github.com/geml-spec/geml/blob/main/spec/GEML-spec.md) · [中文](https://github.com/geml-spec/geml/blob/main/spec/GEML-spec_CN.md) — normative, with Appendix A's diagnostic catalogue
- [Profiles](https://github.com/geml-spec/geml/tree/main/spec/profiles) — how GEML is extended, the six vocabularies so far, and a one-page usage guide for each
- [Proposals (GEPs)](https://github.com/geml-spec/geml/tree/main/spec/proposals) — the change process, and every accepted proposal
- [Writing a parser](https://github.com/geml-spec/geml/blob/main/docs/WRITING-A-PARSER.md) — the conformance suite a second implementation must reproduce
- [Claude Code & MCP](https://github.com/geml-spec/geml/blob/main/docs/mcp-guide.md) — the eleven tools and one-line setup
- [Comparisons](/compare/matrix) — against Markdown, CommonMark, XML and JSON
- [Benchmarks](/benchmarks/) — what addressing by block saves, measured
- [Manifesto](/manifesto) — Doc-as-a-Base: four laws and their boundaries
- [Source](https://github.com/geml-spec/geml) — spec, parser, integrations; issues and critique welcome

The parser is `@geml/geml` on npm. Spec 1.0 is stable: rules already in it will not shift under you; a breaking change bumps the spec version and ships with updated conformance cases.

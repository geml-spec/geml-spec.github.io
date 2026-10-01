---
title: "Syntax cheat sheet: blocks, references, CLI verbs"
description: "Every GEML construct on one page: blocks, ids and references, tables, views and coordinates, data and charts, embeds, meta, CLI selectors, verbs, MCP tools."
outline: [2, 3]
---

# Cheat sheet

One page of the language and the tools. The [specification](https://github.com/geml-spec/geml/blob/main/spec/GEML-spec.md) is normative; where this page and the spec disagree, the spec wins.

## The block

```
=== type {#id .class key=value flag}
body
===
```

- `type` decides how the body is read: **raw** (verbatim — `code`, `diagram`, `math`, `table`), **flow** (parsed prose — `note`, `text`), or **data** (one `key = value` per line — `meta`).
- An unknown type is a warning, never an error, and its body is preserved verbatim. Name your own types with a hyphen (`acme-invoice`).
- A fence is three or more `=`; use a longer fence when the body contains one. A line that would open a fence but is prose is written `\===`.
- A long attribute object continues across lines with a trailing `\`.
- `%%` at the start of a line is an author note: part of the file, never rendered, never in the model.

## Names and references

| | |
|---|---|
| Explicit id | `{#budget}` on any block or heading |
| Derived id | `## Cost model` → `#cost-model` (normative rule in §4; repeated Markdown headings get GitHub's `-1`, `-2`) |
| Reference | `[[#budget]]` — checked at build time; a missing target is an error |
| Cross-document | `[[plan.geml#budget]]` |
| Link | `[text](https://…)`, `[text](#budget)` |
| Footnote | `[^src]` in prose, `[^src]: …` anywhere |
| Rename with its references | `geml rename doc.geml '#old' '#new'` |

## Prose and headings

```
# Title {#top}

Prose with *emphasis*, **strong**, `code`, $x^2$ and a [[#top]] reference.

=== text {#lede}
A run of prose that needs an address of its own.
===

=== note {.intro}
A callout. The body is parsed prose.
===
```

## Tables, views, coordinates

```
=== table {#fy25 caption="FY25 by segment"}
| Segment | Q1 | Q2 |
|---------|---:|---:|
| Cloud   |  8 | 10 |
===

=== table {#fy26 format=csv header=1}
Segment, Q1, Q2
Cloud,    9, 11
===

=== view {#fy25-report src=#fy25 \
          compute="H1 = Q1 + Q2" \
          summary="Segment = 'Total'; H1 = sum(H1)" \
          where="Q1 > 5" order="H1 desc" limit=10}
===
```

- A **table holds facts**; a **view derives**: `compute` (per-row arithmetic, `[%.1f]` display formats), `summary` (a foot row from `sum` / `avg` / `min` / `max` / `count`), `where`, `order`, `limit`, `select`, `by` + `aggregate`. A view may read a view.
- **Coordinates** address one value: `#fy25[2]["Q1"]` (row 2, column Q1; rows start at 1, the header is not a row), `#fy25["Q1"]` (a column), `#fy25-report[summary]["H1"]`, `#meta["title"]`, and into data: `#intake["fields"][1]["name"]`. `get` reads it, `set … --in -` writes it.

## Data and charts

```
=== data {#log format=jsonl}
{"ts":"09:00","p95":41}
{"ts":"09:10","p95":58}
===

=== data {#latency format=jsonl src=ops/latency.jsonl#L900-999}
===

=== diagram {#p95 format=geml-chart data=#log type=line x=ts y=p95}
===

=== diagram {format=mermaid}
graph LR; A --> B
===
```

- `data` formats: `json` (default), `jsonl`, `yaml` (a declared subset), `edn`. The body is *read*, not displayed: a missing comma fails the build, `geml get --json` returns the value.
- A chart binds by reference (`data=#id`); column names are checked at build time. Chart types: `bar`, `line`, and the others the spec lists.
- A `code` block can show a slice of a file: `=== code {src=src/app.ts#L10-40 lang=ts}`.

## Projection — a reference, not a copy

```
=== embed {src=#fy25}
===

=== embed {src=spec.geml#grammar part=head}
===

Inline: ![[plan.geml#budget]] projects the block's body here.
```

An embed evaluates at render time; change the source once and every projection follows. A missing target fails the build. `--to md` / `--to html` resolve projections into the delivered file.

## Meta

```
=== meta
title   = "Budget plan"
profile = "geml-media/v1"
===

The title is {{title}}.
```

`{{key}}` interpolates a meta value in prose. `profile` declares a vocabulary (see [Profiles](https://github.com/geml-spec/geml/tree/main/spec/profiles)); its block types, attributes and checks then apply.

## Selectors and addresses (CLI)

| Selector | Matches |
|---|---|
| `'#id'` | one block |
| `'## Heading text'` | the heading with that text (paste the line) |
| `'=== type'` | every block of that type (`get` prints all; `set` refuses more than one) |
| `'@1a2b3c4d'` | a block by content hash (prose runs without an id have these) |
| `'#id[2]["Q1"]'` | one cell / one leaf |

## The verbs

```sh
geml list    doc.md|doc.geml                 # every block: address, kind, lines
geml find    'text' doc|dir [--case] [--head] # content search → file<TAB>address; -- before a pattern that starts with -
geml get     doc '#id' [--head|--body|--intro] [--json]
geml set     doc '#id' --in file|-  [--head|--body|--intro]   # re-checked; refused if the result breaks
geml replace doc 'old' 'new' [--within '#id']
geml add     doc --before|--after '#id' --in file | --append
geml delete  doc '#id'
geml rename  doc '#old' '#new'                # updates every reference
geml check   doc [--root dir] [--json] [--severity error] [--only code]   # exit 1 on any error
geml history save doc -m "msg" | get | restore | verify
geml revert  doc '#id' --rev changed          # this block's previous distinct version
geml doc.geml --to md|html|geml [-o out] [--root dir]   # project; losses are reported
```

`.md` and `.geml` alike: a named file is read whatever its extension. On Markdown the addresses are headings (plus the prose before the first one); tables, cells and charts need `.geml`.

## Agents

```sh
npx -y @geml/geml skill install                    # Claude Code: skill + CLI + MCP, user-global
claude mcp add --scope user geml -- npx -y @geml/geml mcp --root .
```

MCP tools: `geml_list` `geml_find` `geml_get` `geml_check` `geml_history` `geml_to` `geml_set` `geml_add` `geml_delete` `geml_rename` `geml_revert`. A refused write returns `{ ok: false, diagnostics: [...] }` and the file is unchanged; every write first saves a `.gemlhistory` revision, so `geml_revert` always has somewhere to go.

## Code graphs and media

```sh
geml codemap build|verify|render|serve|refresh    # a codebase's call graph as GEML documents
geml media todo|report|export|build|lay|log|import|compose   # geml-media/v1: a production ledger
```

## Diagnostics

`check` reports `error` and `warning` lines with a stable code each (Appendix A of the spec): `unresolved-reference`, `duplicate-id`, `unresolvable-document`, `compute-not-a-number`, … `--json` returns them as data. Errors block writes; warnings do not.

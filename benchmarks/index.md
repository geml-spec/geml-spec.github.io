---
title: "Benchmarks: what block addressing saves an AI agent"
description: "Two reproducible benchmarks of agent document editing: the cost of saying where one edit goes, and a real day of edits replayed with GEML's verbs."
---

# Benchmarks

Two reproducible benchmarks of what an AI agent spends editing documents, both
measured at geml `31fb510b` (2026-10-05). The
[addressing benchmark](./addressing-cost): on the same document and the same 11
edits, saying where an edit goes costs 790 bytes in Markdown and 240 in GEML,
3.29× less — a figure that swings with the corpus (14.49× one documentation
commit earlier), as the page explains. The
[mixed-toolchain benchmark](./mixed-toolchain): giving each of a real day's 8
replayable edits to the GEML verb built for it cut the reading by 3.36× and the
bytes spent saying where by 12.38×.

| script | what it measures |
|---|---|
| `addressing-cost.mjs` | One edit's cost, on a controlled corpus: the documents the geml repository keeps as both Markdown and GEML (today, the English specification), ~12 blocks sampled from each, both arms executed for real. |
| `real-session-replay.mjs` | A full day of real editing, with each edit done the way that suits it — mechanical bulk replacement left on the original commands, edits that need an address moved to GEML. |

Run them from this site's repository root, with `GEML_SRC` pointing at a built
geml checkout (`git clone https://github.com/geml-spec/geml && (cd geml/geml-parser && npm install && npm run build)`):

```sh
GEML_SRC=../geml node benchmarks/addressing-cost.mjs
GEML_SRC=../geml node benchmarks/real-session-replay.mjs
```

Both take `--json` for the per-edit rows.

`real-session-edits.json` is the frozen baseline for the replay: 33 edits one
agent made to `README_CN.md` over a single day, recovered from its session log,
each carrying what it actually cost. The log itself is not published — that file
is everything derived from it, and it can be audited row by row. The GEML side
is executed on every run, so the numbers move when the CLI does.

Design decisions for both — corpus, sampling, what is counted, and the two
choices that deliberately favour the Markdown side — are stated in each script's
header comment, and were fixed before the first run.

---
title: "Addressing benchmark: what one edit costs an agent"
description: "Same document, same 11 edits: pointing at the place costs 790 bytes in Markdown and 240 in GEML, 3.29× less, at geml 31fb510b. The figure moves with the corpus; the page says how much and why."
---

# What one edit costs: the addressing benchmark

> **Measured at geml `31fb510b` (2026-10-05): saying WHERE a change goes costs
> 3.29× more in Markdown.**
>
> Same document, same 11 edits. Pointing at a place in Markdown means quoting
> the text back — 790 bytes. In GEML it means writing an address — 240 bytes.
> The replacement content is identical in both and is excluded from that figure,
> so the whole ratio is what the format charges to say where.

**This figure moves with the corpus, and by a lot.** The corpus is the live
specification, sampled every Nth block, so an edit to the specification changes
which blocks are sampled. One documentation commit apart, `187efa3c` gave
**14.49×** — 3,929 of its 4,347 Markdown bytes were one sampled 4 KB table that
had to be quoted back — and `31fb510b` gives **3.29×**, with that table no
longer in the sample. GEML comes out ahead on every run; how far ahead depends
on whether a large block lands in the sample. Quote the figure with its commit.

## Why measure this

Most of a document's life is spent being changed, and every change has two
parts: **finding the place**, then **saying that this is the place**. A person
does the first with their eyes and a scrollbar, and it costs nothing anyone
counts. When the editor is a program — an editor plugin, a CI script, a language
model agent — both parts are paid for: what it reads costs, what it writes
costs, and what it writes costs more.

Markdown has no stable name for a part of a document. To point at a paragraph
you quote it, and you keep quoting until the quote is unique in the file. In
GEML every block has an address, and pointing at one means writing that address.

This benchmark measures that difference.

## Method

**The design was fixed before the first run**; the script's header comment is
the original.

| | |
|---|---|
| **Corpus** | Documents the geml repository keeps in **both formats**, so arm A edits the Markdown and arm B the GEML and neither arm gets the easier document. Today that is one: the English specification (`GEML-spec.md` / `GEML-spec.geml`). The Chinese `.geml` is now a translation projection whose blocks are not literally in the Chinese Markdown (its 13 sampled blocks are skipped), and the history specification became a profile with no `.geml` rendering |
| **Sampling** | Mechanical: every Nth addressable block, about twelve per document, **nothing hand-picked**. The only exclusion is the document-level H1 — its "block" is the whole file, and nobody edits a document as a single operation |
| **The job** | "Replace the content of block B." The editor knows **what** to change, not **where** it is, so both arms must find it first. The search phrase comes from one rule — B's first line of twelve characters or more — and **both arms search for the same phrase** |
| **Arm A (Markdown)** | `grep -n` to locate → `sed -n '<hit>,+45p'` for a 46-line window → (a second read when the block does not fit) → write a unique `old_string`, then the new content |
| **Arm B (GEML)** | `geml find` to locate and get back an address → `geml get <address>` to read exactly that block → write the address, then the new content |

The new content is identical in both arms, so it is **left out** of the "saying
where" figure. What remains is each format's charge for pointing at a place.

**Two choices deliberately favour arm A**, so the result is a floor rather than
a flattering case:

- the window is 46 lines — the **median** window an agent was measured using on
  real work, not a large safe one;
- `old_string` is the **shortest unique leading slice** of the block, which is
  the cheapest exact-string edit that still applies correctly.

## Results

11 edits on `GEML-spec.md`, at two commits one documentation change apart:

| | Markdown | GEML | ratio at `31fb510b` | ratio at `187efa3c` |
|---|---:|---:|---:|---:|
| **Saying where (bytes written)** | **790** | **240** | **3.29×** | 14.49× (4,347 / 300) |
| Bytes read | 58,838 | 32,336 | 1.82× | 1.53× |
| Median read per edit | 3,379 | 2,140 | 1.58× | 2.40× |
| Round trips | 25 | 22 | 1.14× | 1.18× |

(The Markdown and GEML columns are the `31fb510b` run.)

- **GEML costs more on 1 of 11 edits at `31fb510b`** — by 0.3% (per-edit ratio
  0.997×); on 0 of 11 at `187efa3c`.
- **The 46-line window did not contain the block on 3 of 11** (4 of 11 at
  `187efa3c`). Markdown then needs a second read — and how big to make the
  window was a guess in the first place: too small misses content, too large
  reads it for nothing.
- Per-edit read ratio at `31fb510b`: min 1.00× · median 1.97× · max 6.98×. The
  median is the steadiest number here: 1.98× at `187efa3c`.

## What this does **not** show

- **Round trips barely move** (1.14×). `find` + `get` is two calls; `grep` +
  `sed` is two calls. GEML saves what each call carries, not how many there are.
- **Smaller blocks widen the gap.** The specification's blocks are large.
  Documents with smaller blocks read better than this; a few very large blocks
  read worse. The median per-edit ratio (1.97×) describes a typical edit better
  than the total.
- **It does not measure writing.** Writing a paragraph well means understanding
  its surroundings, and that cost is the same in both formats. This measures
  finding the paragraph and pointing at it.
- **One document, 11 edits**, from the geml repository. That is a small sample,
  which is exactly why "saying where" swings with one large block. More corpus
  would make it firmer; the script takes a different corpus without
  modification.

## Why the gap is widest on "saying where"

Because that is where the two formats do genuinely different things.

Markdown offers no alternative: for a replacement to land in the right place,
the quoted text must be long enough to be unique — a short quote collides with
the same wording elsewhere and the edit lands in the wrong paragraph. The longer
the document and the more its phrasing repeats, the longer the quote must be —
and a table has to be quoted far enough to be unique, which is how one table
carried most of the `187efa3c` figure.

In GEML that step is an address: `#3-blocks`, or `=== table@412f8f61`. An
address does not grow with the content, or with the document.

And this is the part paid in bytes **written** — which, for anything billed by
token, is the expensive direction.

## Reproducing it

The script lives in this site's repository and reads a built geml checkout:

```sh
git clone https://github.com/geml-spec/geml
(cd geml/geml-parser && npm install && npm run build)
git clone https://github.com/geml-spec/geml-spec.github.io && cd geml-spec.github.io
GEML_SRC=../geml node benchmarks/addressing-cost.mjs
GEML_SRC=../geml node benchmarks/addressing-cost.mjs --json > result.json   # per-edit rows
```

To reproduce the figures above, check geml out at the commit first
(`git -C ../geml checkout 31fb510b`, then rebuild). On any other commit the
numbers will differ — by how much is the point of the section at the top.

The script, the corpus and the sampling rule are all in the repository. To run
it against your own documents, change `PAIRS` at the top: it needs the same
content as both Markdown and GEML, and `geml <file.md> --from md --to geml`
produces the second.

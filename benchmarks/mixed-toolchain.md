---
title: "Mixed-toolchain benchmark: a real day of agent edits"
description: "8 replayable edits from one real day, each given to the GEML verb built for it: 3.36× less reading and 12.38× fewer bytes spent saying where, at geml 31fb510b. None had to leave GEML."
---

# A real day of editing: the mixed-toolchain benchmark

> **Measured at geml `31fb510b` (2026-10-05): giving each of the day's 8
> replayable edits to the GEML verb built for it cut the reading by 3.36× and the
> bytes spent saying WHERE by 12.38×.**
>
> The 3 that had to be understood before they could be made went to `find` +
> `get`, and they accounted for 81% of the day's reading. The 5 whose old text
> was already known went to `replace`, which reads nothing at all. **Not one of
> them had to leave GEML.**

This benchmark complements the [addressing benchmark](./addressing-cost.md): that
one measures a single edit's ceiling on a controlled corpus, this one asks what
**a full day of real work** looks like once each edit is done with the tool that
suits it.

To reproduce, see [Reproducing it](#reproducing-it) — the script lives in this
site's repository and reads a built geml checkout.

## The premise: an agent is not confined to GEML

An agent has many tools, and **picking the one that fits is simply correct**.
For a mechanical swap where the exact old text is already known, `sed` and a
one-off script are fast and cheap. GEML earns its place on the edits that need
to see the content and address it.

So the question here is not "can GEML replace sed". It is: **use GEML only where
it belongs, and what does a day cost then?**

## The baseline is not a model

`real-session-edits.json` is the recovered record of one agent (Claude) editing
this repository's `README_CN.md` for a day: **33 edits**, each carrying what it
actually cost at the time — bytes read to locate the place, how many calls that
took, and bytes written to say where the change goes. The session log itself is
not published; that file is everything derived from it, and it can be inspected
line by line.

Those 33 edits were made with two tools:

| tool | count | how |
|---|---:|---|
| `Edit` (one at a time) | 12 | read first, then replace a unique piece of text |
| node script (batched) | 19 | several `s.replace('old','new')` in one script — **blind, no reading** |
| `Write` | 2 | whole-file write |

**8 are replayable** at `31fb510b`. Of the other 25, 22 put text into the
document that is no longer there — it was itself rewritten later, so **neither
tool could locate it** — and 3 have no phrase to search for. That is the ceiling
of replaying history, not a thumb on the scale, and it shrinks as `README_CN.md`
keeps changing: `187efa3c` replays 9.

## The split, fixed before running

**Nothing here picks whichever tool turned out cheaper.** The division is the
agent's own choice, recorded at the time:

- the 3 replayable edits it made **one at a time, after reading** →
  `geml find` + `geml get`: locate by content, read exactly that block.
- the 5 replayable edits it made as **batched replacements** → `geml replace`,
  which needs no read at all.

**The second route is new**, and it is why these figures differ from earlier
runs. The rule used to leave batched edits on the original commands because GEML
had no verb for "the old text is already known"; `geml replace` is that verb, so
the exception it was written for is gone.

It also punctures an assumption the old rule carried. "Blind replacement reads
nothing" is not what the recorded day shows: of the nineteen batched edits,
exactly one read nothing. The rest read a window first — the same window several
times over, amortised across the swaps in one script — and that amortised read
is precisely what `replace` removes.

The GEML side runs live: the script converts `README_CN.md` to GEML, then for
each edit searches for the text that edit landed and reads the block it lands in
— `geml find` then `geml get`, both really executed and charged in full.

## Results

| | all Markdown (what happened) | mixed | ratio |
|---|---:|---:|---:|
| Bytes read | 10,681 | 3,178 | **3.36×** |
| **Saying where (bytes written)** | **2,537** | **205** | **12.38×** |

(geml `31fb510b`. At `187efa3c`, with 9 edits replayable: 3.23× and 11.60×.)

Where it comes from:

| | n | read | saying where |
|---|---:|---|---|
| batched replacement (via `replace`) | 5 | **2,070 → 1,265** | the old text is written either way |
| **needs an address (`find` + `get`)** | **3** | **8,611 → 1,913** | **2,386 → 54** |

**That is the point: those 3 edits are 3 of the 8, and 81% of everything the
day read.** The edits that must be understood before they can be made are few
and expensive, and that is where GEML's saving lands.

### For contrast: what this looked like before `replace`

The same edits come to **2.68×** if GEML has no `replace`, because the batched
five have to leave it and the 2,070 bytes they read on the original commands
count in full.

**The distance from 2.68× to 3.36× is what one verb was worth.** It did not make
GEML better at swapping strings — `sed` was always good at that. It meant those
ten edits no longer had to leave, and leaving costs more than bytes: a write made
outside is not re-parsed, not reported, not in the history, and nothing catches
it when it breaks something.

## The one-time cost

Moving a Markdown document to GEML is not free, and the script pays it in the
open: **12 raw `<a id="…"></a>` anchors are folded into heading ids**. The
Chinese README names its sections with HTML tags today because Markdown offers
no other way; in GEML a heading carries its own id. The step is automatic, but
it is real conversion work.

## What this does **not** show

- **Not "GEML is cheaper at everything."** What it saves is READING. `replace`
  says where with the old text exactly as the script did, so that column costs
  the same on both sides — the 12.38× comes entirely from the other 3 edits.
- **One document, 8 replayable edits.** That is the sample replaying real
  history can yield, and it is small enough that one edit moves the ratios; for
  a controlled sample see the [addressing benchmark](./addressing-cost.md).
- **It does not measure writing.** Writing a paragraph well means understanding
  its surroundings, and that costs the same either way.
- **The figures move with the corpus.** This reads the real `README_CN.md` in
  the geml repository, so editing it changes them; quote a figure with its
  commit.

## Reproducing it

The script lives in this site's repository and reads a built geml checkout:

```sh
git clone https://github.com/geml-spec/geml
(cd geml/geml-parser && npm install && npm run build)
git clone https://github.com/geml-spec/geml-spec.github.io && cd geml-spec.github.io
GEML_SRC=../geml node benchmarks/real-session-replay.mjs
GEML_SRC=../geml node benchmarks/real-session-replay.mjs --json > result.json   # per-edit rows
```

To reproduce the figures above, check geml out at `31fb510b` first and rebuild.

`benchmarks/real-session-edits.json` is the frozen baseline dataset and can
be audited row by row. The GEML side is executed on every run, so the numbers
move when the CLI does.

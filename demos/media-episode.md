---
title: "geml-media demo: an episode from a four-line synopsis"
description: "A motion-comic episode made by a loop that asks geml media todo what is missing. Change one word and geml check names the 26 items now stale."
pageClass: demo-page
aside: false
---

# An episode made end to end

::: info Runs in any browser
Nothing to install.
:::

A 36-second motion-comic episode, in Chinese with bilingual subtitles, made from a four-line synopsis by a loop that only asks `geml media todo` what is missing, makes it, and logs it. Shots are composed from layers — three scene plates and seven character stands, each generated once — so every shot has the same face and the same room by construction. Change one word (a coat's colour) and `geml check` names exactly the 26 items that are now stale.

## The result

<video class="demo-video" src="/examples/geml-media-explainer/episode/out/ep01.mp4" controls preload="metadata" playsinline></video>

## How it is made

`story.md` is the only input. `characters.geml` holds each character's look (embedded into every prompt that draws them) and voice; `script.geml` the shot board, each shot's prompt and layers, the lines and their English; `library.geml` every asset and the generation that made it; `cut.geml` the timeline, derived from the board and the voices' lengths.

[`tools/produce-episode.mjs`](https://github.com/geml-spec/geml-spec.github.io/blob/main/public/examples/geml-media-explainer/tools/produce-episode.mjs) is the loop. Run in `episode/`, it asks, makes what is missing, logs it, and asks again — images, cut-outs, compositing, camera moves, voices, music, the cut, the render — on one laptop with open-weight models and no accounts:

```sh
geml media todo . --root . --json                                         # what is missing or stale
geml media compose 'script.geml#s03-comp' --out assets/s03-key.png --log library.geml --as '#s03-key' --root .
geml media build cut.geml --out out/ep01-raw.mp4 --root .
```

::: code-group
<<< @/public/examples/geml-media-explainer/episode/story.md [story.md]
<<< @/public/examples/geml-media-explainer/episode/characters.geml [characters.geml]
<<< @/public/examples/geml-media-explainer/episode/script.geml [script.geml]
<<< @/public/examples/geml-media-explainer/episode/library.geml [library.geml]
<<< @/public/examples/geml-media-explainer/episode/cut.geml [cut.geml]
:::

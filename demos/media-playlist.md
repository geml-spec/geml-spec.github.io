---
title: "geml-media demo: a playlist whose order is a document"
description: "Four tracks played one after another, with shuffle and repeat, from one GEML timeline and a one-rule stylesheet."
pageClass: demo-page
aside: false
---

# A playlist built from one document

::: info Runs in any browser
Nothing to install.
:::

Four tracks played one after another — next, previous, shuffle and repeat included — from one GEML document (`geml-media/v1`) and a stylesheet with one rule. The music is synthetic (ffmpeg's expression synthesizer), so the repository ships no audio it does not own.

## The result

<iframe class="demo-frame demo-frame-short" src="/examples/geml-media-playlist/play.html" title="The playlist, playing" loading="lazy"></iframe>

<a href="/examples/geml-media-playlist/play.html" target="_blank">Open it on its own page</a>

## How it is made

`playlist.geml` is a timeline with one audio track and four cuts, and the order of the cuts is the play order. `library.geml` holds each file with its hash; an asset's first body line is the title the list shows. Nothing writes a length: an audio file has its own, and a playlist only plays its cuts in order.

What makes the timeline a playlist is the stylesheet's one rule, `component=playlist`. Shuffle and repeat are how you listen, not what the document says, so they are the panel's buttons — or the rule's defaults, as in `component=playlist shuffle=on repeat=all`.

```sh
node integrations/chrome-geml-viewer/tools/media-page.mjs . playlist.geml playlist.style.geml play.html
```

That is geml's [`media-page.mjs`](https://github.com/geml-spec/geml/blob/main/integrations/chrome-geml-viewer/tools/media-page.mjs), run in this folder: the viewer's own playlist code, written out as one static page.

::: code-group
<<< @/public/examples/geml-media-playlist/playlist.geml [playlist.geml]
<<< @/public/examples/geml-media-playlist/playlist.style.geml [playlist.style.geml]
<<< @/public/examples/geml-media-playlist/library.geml [library.geml]
:::

The folder, with the music: [`public/examples/geml-media-playlist/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/examples/geml-media-playlist).

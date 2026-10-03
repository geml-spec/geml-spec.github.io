---
title: "geml-media demo: a video whose timeline is a document"
description: "A 10-second cut, two shots, a voice line and its subtitle, whose timeline is one GEML document. The browser player and ffmpeg read the same timeline."
pageClass: demo-page
aside: false
---

# A cut built from one document

::: info Runs in any browser
Nothing to install.
:::

A 10-second cut — two shots, one line of voice and its subtitle — whose timeline is one GEML document (`geml-media/v1`). The player below and the encoded video read the same timeline, so what you watch here is what ffmpeg writes. The footage is synthetic (ffmpeg's test patterns), so the repository ships no media it does not own.

## The result

<iframe class="demo-frame" src="/examples/geml-media-demo/play.html" title="The cut, playing" loading="lazy"></iframe>

<a href="/examples/geml-media-demo/play.html" target="_blank">Open it on its own page</a>

## How it is made

`ep01-cut.geml` is the timeline: four clips on three tracks. `ep01-script.geml` holds the shots' prompts and the line — who says it, to whom; `ep01-library.geml` every asset with its hash and the generation that made it. One command encodes the video:

```sh
geml media build ep01/ep01-cut.geml --out ep01.mp4 --root . --burn-subs
```

The player above reads the same timeline without encoding anything; geml's [`media-page.mjs`](https://github.com/geml-spec/geml/blob/main/integrations/chrome-geml-viewer/tools/media-page.mjs) wrote it, and `geml media export ep01/ep01-cut.geml --to player` writes a plainer one.

::: code-group
<<< @/public/examples/geml-media-demo/ep01/ep01-cut.geml [ep01-cut.geml]
<<< @/public/examples/geml-media-demo/ep01/ep01-script.geml [ep01-script.geml]
<<< @/public/examples/geml-media-demo/ep01/ep01-library.geml [ep01-library.geml]
:::

The folder, with the assets: [`public/examples/geml-media-demo/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/examples/geml-media-demo).

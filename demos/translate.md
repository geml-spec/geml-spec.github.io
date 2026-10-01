---
title: "Translation without translated text: geml-translator"
description: "translated.geml embeds its source block by block and the browser translates on open, so the translation never falls behind. Needs desktop Chrome."
pageClass: demo-page
aside: false
---

# One source, four treatments

::: warning Needs Chrome on a desktop
The translation runs on your machine with Chrome's built-in translator. In another browser the page says it cannot translate and shows the original.
:::

A translation that holds no translated text. `translated.geml` embeds `source.geml` block by block (`geml-translator/v1`): Chinese by default, the command kept as written, one line in Japanese, one in French. The browser translates it when it opens, so the translation can never fall behind its source.

## The result

<iframe class="demo-frame" src="/examples/render.html?doc=/examples/translate-demo/translated.geml" title="The translation, rendered" loading="lazy"></iframe>

<a href="/examples/render.html?doc=/examples/translate-demo/translated.geml" target="_blank">Open it on its own page</a>

## How it is made

`source.geml` is an ordinary English document. `translated.geml` is a list of embeds of its blocks: its `meta` asks for Chinese, and three embeds say otherwise — `translate-to=none`, `ja` and `fr`.

::: code-group
<<< @/public/examples/translate-demo/translated.geml [translated.geml]
<<< @/public/examples/translate-demo/source.geml [source.geml]
:::

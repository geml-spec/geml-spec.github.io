---
title: "Tables, charts, Mermaid and math in one file"
description: "One .geml file: a table, a sortable computed view, four charts drawn from it by id, a Mermaid flow and math. No number is copied into a chart."
pageClass: demo-page
aside: false
---

# One document, charts and all

::: info Runs in any browser
Nothing to install.
:::

One `.geml` file with a table, a computed view of it you can sort and filter, four charts drawn from the view, a Mermaid flow and math. No number is copied into a chart: each one names the view by its id (`data=#fy25`).

## The result

<iframe class="demo-frame" src="/examples/render.html?doc=/examples/showcase.geml" title="The showcase, rendered" loading="lazy"></iframe>

<a href="/examples/render.html?doc=/examples/showcase.geml" target="_blank">Open it on its own page</a>

## How it is made

The file below is all there is. The same file also exports to one self-contained HTML page:

```sh
geml showcase.geml --to html -o showcase.html
```

<<< @/public/examples/showcase.geml

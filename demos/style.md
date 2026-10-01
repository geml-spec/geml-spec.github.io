---
title: "geml-style demo: a web page laid out from a document"
description: "A GitHub file page rebuilt from one GEML document and one stylesheet: every string comes from the document, every colour and length from geml-style/v1."
pageClass: demo-page
aside: false
---

# A page laid out from a document

::: info Runs in any browser
Nothing to install: the page below is drawn in your browser by the viewer extension's own code.
:::

A 1:1 replica of a GitHub file page — top bar, repository nav, file tree, breadcrumb, commit row, Preview / Code / Blame — showing a short note on pour-over coffee as the file being viewed. Every string on it comes from a GEML document, every colour and length from a GEML stylesheet (`geml-style/v1`), and the renderer knows about neither.

## The result

<iframe class="demo-frame" src="/examples/render.html?doc=/examples/style-demo/page.geml" title="The style demo, rendered" loading="lazy"></iframe>

<a href="/examples/render.html?doc=/examples/style-demo/page.geml" target="_blank">Open it on its own page</a>

## How it is made

`page.geml` is the whole page in 13 lines: one `embed` for the template, one for the document being read. `template.geml` holds the page's content and nothing else — the bars, nav and file tree as lists of links. `article.geml` is an ordinary document that knows nothing about the page around it. `_index/index.geml` names the stylesheet, and `github.style.geml` holds only layout: frames, slots, built-in words, three states, not one word of GitHub's text. Pointing the page at another document is one `src=`.

Both checks pass in the demo's folder, with no errors; `style check` also notes the 99 slots this stylesheet declares that the template leaves empty, which render as nothing:

```sh
geml check page.geml
geml style check _index/github.style.geml page.geml --components=tree,segments,code-graph
```

::: code-group
<<< @/public/examples/style-demo/page.geml [page.geml]
<<< @/public/examples/style-demo/article.geml [article.geml]
<<< @/public/examples/style-demo/template.geml [template.geml]
<<< @/public/examples/style-demo/_index/index.geml [_index/index.geml]
<<< @/public/examples/style-demo/_index/github.style.geml [_index/github.style.geml]
:::

The folder, with its 41 icons: [`public/examples/style-demo/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/examples/style-demo).

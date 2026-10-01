---
title: "geml-codemap demo: a call graph as documents"
description: "The call graph of the @geml/geml parser and viewer as GEML documents: one per source file, every function a block with an id, every call kept both ways."
pageClass: demo-page
aside: false
---

# The parser's own code graph

::: info Runs in any browser
Nothing to install.
:::

The call graph of `@geml/geml` and its viewer, laid out as GEML documents by `geml codemap build`: one document per source file, every function a block with an id, and every call an edge kept both ways — `#calls` in the caller's document, `#called-by` in the callee's. `geml codemap verify` runs `geml check` and the profile's reference checks over the whole folder.

## The result

<iframe class="demo-frame" src="/playground/codemap/index.html" title="The code graph" loading="lazy"></iframe>

<a href="/playground/codemap/index.html" target="_blank">Open it on its own page</a>

## How it is made

A SCIP index of each package goes in; a folder of `.geml` documents and the pages above come out. It is rebuilt from the parser's source whenever geml's `main` changes, and every document in it passes `geml check`:

```sh
npx @sourcegraph/scip-typescript index --output parser.scip   # in geml-parser/, and again in the viewer
geml codemap build --adapter scip --raw parser.scip --adapter scip --raw viewer.scip --root . --out codemap --container file
geml codemap verify codemap
geml codemap render codemap
```

`index.geml` lists every module; each module has a document like `geml-parser--attrs.ts.geml` below — a `code` block per function, pointing at its lines in the source, then the edges.

::: code-group
<<< @/public/playground/codemap/index.geml [index.geml]
<<< @/public/playground/codemap/geml-parser--attrs.ts.geml [geml-parser--attrs.ts.geml]
:::

All of them: [`public/playground/codemap/`](https://github.com/geml-spec/geml-spec.github.io/tree/main/public/playground/codemap).

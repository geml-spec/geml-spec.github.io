# GEML examples

The demos the [demos page](https://geml-spec.github.io/demos) shows, each on a page of
its own: the result, then the GEML that made it. They are watched, not edited — the
editable tour is the [playground](../playground/).

| folder | what it is |
|---|---|
| `style-demo/` | a whole page laid out from a document by `geml-style/v1` — see below |
| `geml-media-demo/` | a 10-second cut built from one document by `geml media build`; its README walks through it |
| `geml-media-explainer/` | a 36-second episode made end to end with `geml-media`; its README tells how |
| `translate-demo/` | a translation with `geml-translator/v1`: `translated.geml` holds no translated text — it embeds `source.geml` block by block (Chinese by default, the command kept as written, one line in Japanese, one in French) and the viewer translates it on open |
| `showcase.geml` | one document with a computed table, four charts, a Mermaid flow and math |
| `render.html` | draws one of these documents with the viewer's own code, as the extension would: `render.html?doc=/examples/showcase.geml`. The demo pages frame it, so nothing needs installing |

Every document here is `geml check`-clean: geml-spec/geml checks them with its own parser before each update it pushes here.

## The page-layout demo (`style-demo/`)

The playground's seven chapters show what a GEML *document* is. `style-demo/`
shows what the **layout layer** (`geml-style/v1`) can do with one: it is a 1:1
replica of a GitHub blob page — top bar, repository nav, file tree, breadcrumb,
commit row, Preview/Code/Blame, four dropdown menus — showing its own
`article.geml`, a short note on pour-over coffee, as the file being viewed.

**See it** on the [demos page](https://geml-spec.github.io/demos/style), drawn by
`render.html`. **Or open `style-demo/page.geml` itself** with
[`geml-viewer`](https://github.com/geml-spec/geml/tree/main/integrations/chrome-geml-viewer)
installed: the opening note tells you what you are looking at, then fades.

There is still no `index.html` here. What is being demonstrated is that a
`.geml` file *is* the page: `render.html` is one host shared by every example,
not a page written for this one, and it runs the extension's own code. Without
either, a browser shows the source, which is the right default: the file is
text, and nothing has claimed otherwise.

| file | what it holds |
|---|---|
| `style-demo/page.geml` | 13 lines: **an assembly sheet** — one `embed` for the template, one for the document being read |
| `style-demo/article.geml` | **the document being read**: an ordinary GEML document that knows nothing about the page around it |
| `style-demo/template.geml` | **the page template**, and only content: top bar, repository nav, file tree, breadcrumb, commit row and toolbars, written as lists of inline links, plus the search and branch fields |
| `style-demo/_index/index.geml` | the style entry (profile §1.1) — names the stylesheet beside it |
| `style-demo/_index/github.style.geml` | **only layout**: frames, slots, built-in words, three states. Not one word of GitHub's text |
| `style-demo/icons/*.svg` | 41 octicons, referenced from the content by path |

The split is the point. Every string you can read on the page comes from
`template.geml` or the document it reads; every colour and length comes from
`github.style.geml`; the viewer knows about neither.

`page.geml` is that short because `template.geml` is a **template**, and saying
so took no new mechanism: an `embed` brings a document into the corpus, and the
stylesheet's `slots=` can already reach a block in any document there. So the
27 frames pick the template's blocks out of it one by one, and pointing the page
at a different document is one `src=`:

```geml
=== embed {#template src="template.geml"}
===
=== embed {#doc src="article.geml"}
===
```

Writing those blocks straight into `page.geml` still works — that is what this
demo did until it was split — so "write the page directly" and "use a template"
are the same mechanism seen from two ends, not two features.

`check` is clean. `style check` reports **0 errors and 99 `style-unmatched-rule`
warnings** — one per slot this stylesheet declares that the template does not
fill. Warnings rather than errors because an unfilled slot renders as nothing.
In this folder:

```sh
geml check page.geml
geml style check _index/github.style.geml page.geml --components=tree,segments,code-graph
```

Everything the page reads sits inside `style-demo/`, so it opens from disk too:
the viewer confines a `file://` document's fetches to its own folder, and that
folder is enough. Turn on **Allow access to file URLs** for the extension and open
`page.geml`, or serve `public/` (`python -m http.server`) and open
`localhost:8000/examples/style-demo/page.geml`. GitHub Pages serves `.geml` as a
download, so the extension cannot open it there; the demos page is the way in.

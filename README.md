# geml-spec.github.io

The GEML website: <https://geml-spec.github.io/>. Built with [VitePress](https://vitepress.dev).

Everything the site serves is committed here, and this repository builds nothing
from another one. The site **authors** the home page, Get Started, the cheat
sheet, the demos page, the blog, the comparisons (`compare/`), the benchmarks
(`benchmarks/`), the manifesto, the illustrated pages (`public/illustrated/`),
the playground's page and chapters (`public/playground/`), and the demos
(`public/examples/`).

The specification, the profiles and their guides, the GEPs and the changelog
are not copied here: the site links to them in
[`geml-spec/geml`](https://github.com/geml-spec/geml), where they are maintained.

A few files are made from the parser, and
[`geml-spec/geml`](https://github.com/geml-spec/geml) pushes them in — its
`website` workflow runs `integrations/website/update.mjs` on every change to its
`main` and commits the result here:

| file | made from |
|---|---|
| `public/playground/playground.js`, `fonts/` | the parser and the viewer's renderer, bundled |
| `public/playground/codemap/` | the parser's and the viewer's own call graph |
| `public/logo/` | `docs/assets/logo/` |

Edit those in geml, not here; the next push overwrites them. Before pushing, the
same script runs `geml check` over every demo document in `public/playground/`
and `public/examples/`.

## Develop

```sh
npm ci
npm run dev              # http://localhost:5173
```

Deploys run `.github/workflows/deploy.yml` on every push to `main`.

## Redirects

The site used to live at `geml-spec.github.io/geml/`; that repository's Pages now redirects every old path here.

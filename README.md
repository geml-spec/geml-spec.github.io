# geml-spec.github.io

The GEML website: <https://geml-spec.github.io/>. Built with [VitePress](https://vitepress.dev).

What lives here is only what the site **authors**: the home page, Get Started, the cheat sheet, the demos page, the blog, and the playground's static sources (`public/playground/`). Everything else is pulled from [`geml-spec/geml`](https://github.com/geml-spec/geml) at build time, so it can never drift from the spec and parser:

| built into | from `geml-spec/geml` | by |
|---|---|---|
| `reference/`, `guide/`, `public/illustrated/` | `spec/`, `docs/`, `CHANGELOG.md` | `npm run sync` |
| `public/playground/playground.js`, `fonts/` | `geml-parser/dist` + `integrations/geml-viewer/src` | `npm run playground` |
| `public/playground/codemap/` | the parser's own call graph | `npm run codemap` |

The commit built from is `geml-source.json` (`ref`: a branch tracks its tip, a SHA pins a release).

## Develop

```sh
git clone https://github.com/geml-spec/geml ../geml      # or point GEML_SRC at a checkout
(cd ../geml/geml-parser && npm ci && npm run build)
(cd ../geml/integrations/geml-viewer && npm ci)
npm ci
npm run prepare:all      # sync + playground bundle + codemap
npm run check            # geml check on every demo document
npm run dev              # http://localhost:5173
```

`GEML_SRC` defaults to `../geml`. Deploys run the same steps in `.github/workflows/deploy.yml` on every push to `main`.

## Redirects

The site used to live at `geml-spec.github.io/geml/`; that repository's Pages now redirects every old path here.

import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

// The specification, profiles, guides, GEPs and changelog live in geml-spec/geml
// and are read there; the site links to them instead of keeping copies.
const GH = 'https://github.com/geml-spec/geml/blob/main'
const GH_TREE = 'https://github.com/geml-spec/geml/tree/main'
const profiles = ['codemap', 'history', 'style', 'form', 'media', 'translator']
const profileGuides = profiles.map((p) => ({ text: `geml-${p}`, link: `${GH}/spec/profiles/geml-${p}/geml-${p}-guide.md` }))

// Google Analytics 4 — disclosed in privacy.md; change the two together.
const GA_ID = 'G-JFH1WQFE5T'
const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
const gaInit = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`

// Static pages under public/ (illustrated, examples, playground) bypass the
// VitePress head; give every built HTML file that lacks the tag the same one.
function tagStaticPages(dir: string) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name)
    if (d.isDirectory()) { tagStaticPages(p); continue }
    if (!d.name.endsWith('.html')) continue
    const html = readFileSync(p, 'utf8')
    if (html.includes(gaSrc)) continue
    // after <head>, or — for a page that leaves <head> implicit — after the doctype
    const at = /<head[^>]*>/i.exec(html) ?? /<!doctype html>/i.exec(html)
    if (!at) continue
    const end = at.index + at[0].length
    writeFileSync(p, `${html.slice(0, end)}\n<script async src="${gaSrc}"></script>\n<script>${gaInit}</script>${html.slice(end)}`)
  }
}

const siteSidebar = [
  {
    text: 'Comparisons',
    items: [
      { text: 'Capability matrix', link: '/compare/matrix' },
      { text: 'GEML vs CommonMark', link: '/compare/commonmark' },
      { text: 'GEML vs XML and JSON', link: '/compare/xml-and-json' },
      { text: 'Markdown 变体与工具（中文）', link: '/illustrated/geml-vs-markdown-variants_CN.html', target: '_blank' },
    ],
  },
  {
    text: 'Benchmarks',
    items: [
      { text: 'Overview', link: '/benchmarks/' },
      { text: 'Addressing cost', link: '/benchmarks/addressing-cost' },
      { text: 'Mixed toolchain', link: '/benchmarks/mixed-toolchain' },
    ],
  },
  {
    text: 'Ideas',
    items: [
      { text: 'Manifesto: Doc-as-a-Base', link: '/manifesto' },
      { text: '宣言（中文）', link: '/manifesto-cn' },
    ],
  },
  { text: 'Profile guides', collapsed: true, items: profileGuides },
]

export default defineConfig({
  title: 'GEML',
  titleTemplate: ':title · GEML',
  description: 'A lightweight, Agent-Native markup language: plain text people read, blocks agents get, set, add and delete — and a write that would break the document is refused. Works on the Markdown you already have.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: false,
  srcExclude: ['README.md', '**/node_modules/**', 'public/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo/geml-favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#E00A1E' }],
    ['meta', { property: 'og:title', content: 'GEML — a lightweight, Agent-Native markup language' }],
    ['meta', { property: 'og:image', content: 'https://geml-spec.github.io/logo/geml-mark.svg' }],
    ['script', { async: '', src: gaSrc }],
    ['script', {}, gaInit],
  ],
  buildEnd: (siteConfig) => tagStaticPages(siteConfig.outDir),
  markdown: {
    config: (md) => { md.use(footnote) },
  },
  themeConfig: {
    logo: '/logo/geml-mark.svg',
    siteTitle: 'GEML',
    nav: [
      { text: 'Get Started', link: '/get-started' },
      { text: 'Playground', link: '/playground/', target: '_blank' },
      {
        text: 'Reference',
        items: [
          { text: 'Cheat sheet', link: '/cheat-sheet' },
          { text: 'Specification', link: `${GH}/spec/GEML-spec.md` },
          { text: '规范（中文）', link: `${GH}/spec/GEML-spec_CN.md` },
          { text: 'Profiles', link: `${GH_TREE}/spec/profiles` },
          { text: 'Proposals (GEPs)', link: `${GH_TREE}/spec/proposals` },
          { text: 'Changelog', link: `${GH}/CHANGELOG.md` },
        ],
      },
      {
        text: 'Guide',
        items: [
          { text: 'Claude Code & MCP', link: `${GH}/docs/mcp-guide.md` },
          { text: 'Writing a parser', link: `${GH}/docs/WRITING-A-PARSER.md` },
          { text: 'Profile guides', items: profileGuides },
          {
            text: 'On this site',
            items: [
              { text: 'Comparisons', link: '/compare/matrix' },
              { text: 'Benchmarks', link: '/benchmarks/' },
              { text: 'Manifesto', link: '/manifesto' },
            ],
          },
        ],
      },
      { text: 'Demos', link: '/demos' },
      { text: 'Blog', link: '/blog/' },
    ],
    sidebar: {
      '/compare/': siteSidebar,
      '/benchmarks/': siteSidebar,
      '/manifesto': siteSidebar,
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/geml-spec/geml' },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@geml/geml' },
    ],
    search: { provider: 'local' },
    outline: [2, 3],
    footer: {
      message: 'Code MIT · Specification CC BY 4.0',
      copyright: 'GEML — a lightweight, Agent-Native markup language',
    },
  },
})

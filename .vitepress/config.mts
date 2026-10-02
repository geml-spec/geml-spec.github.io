import { defineConfig, type HeadConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { isZh } from './lang'

const SITE = 'https://geml-spec.github.io'
// The card a shared link shows; outside public/logo/, which geml's update.mjs rewrites.
const OG_IMAGE = `${SITE}/og/geml-card.png`

// The specification, profiles, guides, GEPs and changelog live in geml-spec/geml
// and are read there; the site links to them instead of keeping copies.
const GH = 'https://github.com/geml-spec/geml/blob/main'
const GH_TREE = 'https://github.com/geml-spec/geml/tree/main'
const profiles = ['codemap', 'history', 'style', 'form', 'media', 'translator']
const profileGuides = profiles.map((p) => ({ text: `geml-${p}`, link: `${GH}/spec/profiles/geml-${p}/geml-${p}-guide.md` }))

// Google Analytics 4 — disclosed in privacy.md; change the two together.
const GA_ID = 'G-JFH1WQFE5T'
const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
// gtag() queues from the first moment; the tag itself is fetched once the page has
// loaded and gone idle, so it no longer holds up the main thread while the page is
// being read for the first time. Nothing queued before then is lost.
const gaInit = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');
(function () {
  var load = function () { var s = document.createElement('script'); s.async = true; s.src = '${gaSrc}'; document.head.appendChild(s); };
  var idle = function () { 'requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 3000 }) : setTimeout(load, 1500); };
  document.readyState === 'complete' ? idle() : addEventListener('load', idle);
})();`

// Pages under public/ that only make sense inside another page — a demo's iframe,
// the explainer's render stage — are not search results of their own. The code
// map pages are geml's generated output, so this is decided here, not in them.
const embedOnly = /[\\/](playground[\\/]codemap[\\/]|examples[\\/]render\.html$|examples[\\/]geml-media-demo[\\/]play\.html$|examples[\\/]geml-media-explainer[\\/]scenes[\\/])/

// Static pages under public/ (illustrated, examples, playground) bypass the
// VitePress head; give every built HTML file that lacks the tag the same one, an
// icon if it names none (else the browser asks for /favicon.ico), and an
// embed-only page its noindex.
function tagStaticPages(dir: string) {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name)
    if (d.isDirectory()) { tagStaticPages(p); continue }
    if (!d.name.endsWith('.html')) continue
    const html = readFileSync(p, 'utf8')
    const add: string[] = []
    if (!html.includes(gaSrc)) add.push(`<script>${gaInit}</script>`)
    if (!/<link[^>]+rel="(shortcut )?icon"/i.test(html)) add.push('<link rel="icon" type="image/svg+xml" href="/logo/geml-favicon.svg">')
    if (embedOnly.test(p) && !html.includes('name="robots"')) add.push('<meta name="robots" content="noindex, indexifembedded">')
    if (add.length === 0) continue
    // after <head> (not <header>), or — for a page that leaves <head> implicit — after the doctype
    const at = /<head(\s[^>]*)?>/i.exec(html) ?? /<!doctype html>/i.exec(html)
    if (!at) continue
    const end = at.index + at[0].length
    writeFileSync(p, `${html.slice(0, end)}\n${add.join('\n')}${html.slice(end)}`)
  }
}

// A public/ page's last commit, for the sitemap's <lastmod> (VitePress dates only its own pages).
const siteRoot = fileURLToPath(new URL('..', import.meta.url))
function lastCommit(path: string) {
  try { return execFileSync('git', ['log', '-1', '--format=%cI', '--', path], { cwd: siteRoot, encoding: 'utf8' }).trim() || undefined }
  catch { return undefined }
}

// The URL a page is served at (cleanUrls): index.md is its folder, x.md is /x.
const pageUrl = (rel: string) => `${SITE}/${rel.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
// A page's other-language twin, when the site has one: x.md ⇄ x-cn.md (x_cn.md on the blog).
function twinOf(rel: string, pages: string[]) {
  const candidates = isZh(rel) ? [rel.replace(/[-_]cn\.md$/i, '.md')] : [rel.replace(/\.md$/, '-cn.md'), rel.replace(/\.md$/, '_cn.md')]
  return candidates.find((p) => pages.includes(p))
}

const siteSidebar = [
  {
    text: 'Comparisons',
    items: [
      { text: 'Capability matrix', link: '/compare/matrix' },
      { text: 'GEML vs CommonMark', link: '/compare/commonmark' },
      { text: 'GEML vs XML and JSON', link: '/compare/xml-and-json' },
      { text: 'Markdown variants and tools', link: '/illustrated/geml-vs-markdown-variants.html', target: '_blank' },
    ],
  },
  {
    text: 'Benchmarks',
    items: [
      { text: 'Overview', link: '/benchmarks/' },
      { text: 'Addressing cost', link: '/benchmarks/addressing-cost' },
      { text: 'Mixed toolchain', link: '/benchmarks/mixed-toolchain' },
      { text: '一次实测：改文档花了多少（中文）', link: '/benchmarks/agent-editing-log-cn' },
      { text: 'LLM 改文档时做了什么（中文）', link: '/benchmarks/what-llm-did-when-editing-cn' },
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
  // A page without its own `description:` falls back to this one.
  description: 'Plain text people read and AI agents edit by block: geml get/set #id, and writes that would break the file are refused. Works on Markdown. CLI + MCP server.',
  lang: 'en',
  cleanUrls: true,
  // Each page's last commit date: shown under the page, and the sitemap's <lastmod>
  // (deploy.yml checks out the full history for it).
  lastUpdated: true,
  srcExclude: ['README.md', '**/node_modules/**', 'public/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo/geml-favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#E00A1E' }],
    // Google Search Console ownership of https://geml-spec.github.io/
    ['meta', { name: 'google-site-verification', content: '5kETBu5-C836u2-2CK-QSAIxcbCeyX8YQ2-kdiZEnpM' }],
    ['script', {}, gaInit],
  ],
  sitemap: {
    hostname: SITE,
    // public/ pages bypass VitePress; the ones that stand on their own go in by hand.
    transformItems: (items) => [
      ...items,
      { url: 'playground/', lastmod: lastCommit('public/playground/index.html') },
      ...readdirSync(fileURLToPath(new URL('../public/illustrated', import.meta.url)))
        .filter((f) => f.endsWith('.html'))
        .map((f) => ({ url: `illustrated/${f}`, lastmod: lastCommit(`public/illustrated/${f}`) })),
    ],
  },
  // Every page names its own URL, title and description for search and for a
  // shared link, and its other-language twin when there is one.
  transformHead: ({ pageData, siteConfig, title, description }) => {
    if (pageData.isNotFound) return
    const rel = pageData.relativePath
    const url = pageUrl(rel)
    const head: HeadConfig[] = [
      ['link', { rel: 'canonical', href: url }],
      ['meta', { property: 'og:type', content: rel.startsWith('blog/20') ? 'article' : 'website' }],
      ['meta', { property: 'og:site_name', content: 'GEML' }],
      ['meta', { property: 'og:locale', content: isZh(rel) ? 'zh_CN' : 'en_US' }],
      ['meta', { property: 'og:title', content: title }],
      ['meta', { property: 'og:description', content: description }],
      ['meta', { property: 'og:url', content: url }],
      ['meta', { property: 'og:image', content: OG_IMAGE }],
      ['meta', { property: 'og:image:width', content: '1200' }],
      ['meta', { property: 'og:image:height', content: '630' }],
      ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ]
    const twin = twinOf(rel, siteConfig.pages)
    if (twin) {
      const [en, zh] = isZh(rel) ? [twin, rel] : [rel, twin]
      head.push(
        ['link', { rel: 'alternate', hreflang: 'en', href: pageUrl(en) }],
        ['link', { rel: 'alternate', hreflang: 'zh-Hans', href: pageUrl(zh) }],
      )
    }
    return head
  },
  // The site's lang is en; a Chinese twin says so in the HTML it ships.
  transformHtml: (code, _id, { pageData }) =>
    isZh(pageData.relativePath) ? code.replace('<html lang="en"', '<html lang="zh-Hans"') : code,
  buildEnd: (siteConfig) => tagStaticPages(siteConfig.outDir),
  markdown: {
    config: (md) => {
      md.use(footnote)
      // Vue reads {{ }} in a page as an interpolation, inline code included: the
      // cheat sheet's `{{title}}` rendered as an empty <code>. v-pre keeps it text.
      const codeInline = md.renderer.rules.code_inline!
      md.renderer.rules.code_inline = (...args) => codeInline(...args).replace('<code', '<code v-pre')
    },
  },
  themeConfig: {
    // The wordmark is the logo: its red G is the first letter, so no title beside it.
    logo: { light: '/logo/geml-logo-light.svg', dark: '/logo/geml-logo-dark.svg', alt: 'GEML' },
    siteTitle: false,
    nav: [
      { text: 'Get Started', link: '/get-started' },
      { text: 'Playground', link: '/playground/', target: '_blank' },
      {
        text: 'Reference',
        items: [
          { text: 'Cheat sheet', link: '/cheat-sheet' },
          { text: 'Illustrated syntax', link: '/illustrated/' },
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

import { defineConfig } from 'vitepress'
import footnote from 'markdown-it-footnote'

const geps = [
  ['0001', 'Drop aside'], ['0002', 'Code graph representation'], ['0003', 'geml-code-graph format'],
  ['0004', 'text block'], ['0005', 'data block'], ['0006', 'Declared projections'],
  ['0007', 'Emphasis across atoms'], ['0008', 'form block'], ['0009', 'Application-layer profiles'],
  ['0010', 'Language projections'], ['0011', 'Inner-unit coordinates'], ['0012', 'view block'],
  ['0013', 'Prose body for vocabularies'],
]
const gepSlugs: Record<string, string> = {
  '0001': '0001-drop-aside', '0002': '0002-code-graph-representation', '0003': '0003-geml-code-graph-format',
  '0004': '0004-text-block', '0005': '0005-data-block', '0006': '0006-declared-projections',
  '0007': '0007-emphasis-across-atoms', '0008': '0008-form-block', '0009': '0009-application-layer-profiles',
  '0010': '0010-language-projections', '0011': '0011-inner-unit-coordinates', '0012': '0012-view-block',
  '0013': '0013-prose-body-for-vocabularies',
}
const profiles = ['history', 'codemap', 'style', 'media', 'form', 'translator']
const GA_ID = 'G-JFH1WQFE5T'

export default defineConfig({
  title: 'GEML',
  titleTemplate: ':title · GEML',
  description: 'A lightweight, Agent-Native markup language: plain text people read, blocks agents get, set, add and delete — and a write that would break the document is refused. Works on the Markdown you already have.',
  lang: 'en',
  cleanUrls: true,
  lastUpdated: false,
  // geml-src/ is where the deploy workflow checks out geml-spec/geml; its
  // Markdown is synced into reference/ and guide/, never served as pages itself.
  srcExclude: ['README.md', '**/node_modules/**', 'public/**', 'scripts/**', 'geml-src/**'],
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo/geml-favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#E00A1E' }],
    ['meta', { property: 'og:title', content: 'GEML — a lightweight, Agent-Native markup language' }],
    ['meta', { property: 'og:image', content: 'https://geml-spec.github.io/logo/geml-mark.svg' }],
    // Google Analytics 4 — disclosed in privacy.md; change the two together.
    ['script', { async: '', src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}` }],
    ['script', {}, `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`],
  ],
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
          { text: 'Specification', link: '/reference/spec' },
          { text: '规范（中文）', link: '/reference/spec-cn' },
          { text: 'Profiles', link: '/reference/profiles/' },
          { text: 'Proposals (GEPs)', link: '/reference/geps/' },
          { text: 'Changelog', link: '/reference/changelog' },
        ],
      },
      {
        text: 'Guide',
        items: [
          { text: 'Claude Code & MCP', link: '/guide/mcp' },
          { text: 'Writing a parser', link: '/guide/writing-a-parser' },
          { text: 'Comparisons', link: '/guide/comparison' },
          { text: 'Manifesto', link: '/guide/manifesto' },
        ],
      },
      { text: 'Demos', link: '/demos' },
      { text: 'Blog', link: '/blog/' },
    ],
    sidebar: {
      '/reference/': [
        {
          text: 'Language',
          items: [
            { text: 'Cheat sheet', link: '/cheat-sheet' },
            { text: 'Specification', link: '/reference/spec' },
            { text: '规范（中文）', link: '/reference/spec-cn' },
            { text: 'Changelog', link: '/reference/changelog' },
          ],
        },
        {
          text: 'Profiles',
          items: [
            { text: 'About profiles', link: '/reference/profiles/' },
            ...profiles.map((p) => ({ text: `geml-${p}`, link: `/reference/profiles/geml-${p}` })),
          ],
        },
        {
          text: 'Proposals (GEPs)',
          collapsed: true,
          items: [
            { text: 'Process', link: '/reference/geps/' },
            ...geps.map(([n, t]) => ({ text: `${n} ${t}`, link: `/reference/geps/${gepSlugs[n]}` })),
          ],
        },
      ],
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Get Started', link: '/get-started' },
            { text: 'Claude Code & MCP', link: '/guide/mcp' },
            { text: 'Claude Code 与 MCP（中文）', link: '/guide/mcp-cn' },
            { text: 'Writing a parser', link: '/guide/writing-a-parser' },
            { text: 'Demos', link: '/demos' },
          ],
        },
        {
          text: 'Comparisons',
          items: [
            { text: 'Capability matrix', link: '/guide/comparison' },
            { text: 'GEML vs CommonMark', link: '/guide/geml-vs-commonmark' },
            { text: 'GEML vs XML and JSON', link: '/guide/geml-vs-xml-and-json' },
          ],
        },
        {
          text: 'Ideas',
          items: [
            { text: 'Manifesto: Doc-as-a-Base', link: '/guide/manifesto' },
            { text: '宣言（中文）', link: '/guide/manifesto-cn' },
          ],
        },
      ],
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

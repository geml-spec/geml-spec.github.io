import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { h } from 'vue'
import { htmlLang } from '../lang'
import './custom.css'

// The badges README.md opens with, under the home page's buttons, less Glama's: its
// first grade reads as a red F, not a thing to lead with. The images load
// from the listings themselves so the rank stays current (privacy.md says
// so); no-referrer keeps the page's address out of those requests.
const BADGES = [
  { alt: 'MCP Toplist', src: 'https://mcptoplist.com/badge/io.github.geml-spec%2Fgeml.svg', href: 'https://mcptoplist.com/server/io.github.geml-spec%2Fgeml' },
  { alt: 'Mentioned in Awesome AI Plugins', src: 'https://awesome.re/mentioned-badge.svg', href: 'https://github.com/hashgraph-online/awesome-ai-plugins#development--workflow' },
  { alt: 'Mentioned in Awesome Markdown', src: 'https://awesome.re/mentioned-badge.svg', href: 'https://github.com/mundimark/awesome-markdown#beyond-markdown---lets-fix-markdown-quirks--oddities-and-lets-fill-in--add-the-missing-parts-tables-footnotes-generic-blocks-etc' },
]

const badges = () =>
  h('div', { class: 'hero-badges' }, BADGES.map((b) =>
    h('a', { href: b.href, target: '_blank', rel: 'noopener' }, [
      h('img', { src: b.src, alt: b.alt, height: 20, referrerpolicy: 'no-referrer' }),
    ])))

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { 'home-hero-actions-after': badges }),
  enhanceApp({ router }) {
    if (typeof document === 'undefined') return
    // VitePress sets <html lang> to the site's `en` once the app mounts; a Chinese
    // twin puts its own back, whichever of the two writes it last.
    const fix = () => {
      const want = htmlLang(router.route.data.relativePath)
      if (document.documentElement.lang !== want) document.documentElement.lang = want
    }
    new MutationObserver(fix).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] })
    const after = router.onAfterRouteChange
    router.onAfterRouteChange = async (to) => {
      await after?.(to)
      fix()
    }
  },
} satisfies Theme

import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import { htmlLang } from '../lang'
import './custom.css'

export default {
  extends: DefaultTheme,
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

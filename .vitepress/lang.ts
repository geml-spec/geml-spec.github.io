// A Chinese twin is named <page>-cn.md (<post>_cn.md on the blog). One rule, read
// by the build (the page's <html lang>, its hreflang pair) and by the client theme,
// which puts the language back after VitePress resets it to the site's `en`.
export const isZh = (relativePath: string) => /[-_]cn\.md$/i.test(relativePath)
export const htmlLang = (relativePath: string) => (isZh(relativePath) ? 'zh-Hans' : 'en')

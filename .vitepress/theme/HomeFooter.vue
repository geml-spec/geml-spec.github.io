<script setup lang="ts">
import { useData } from 'vitepress'
import { VPImage, VPSocialLinks } from 'vitepress/theme'

// The home page's closing menu (theme/index.ts puts it under the page; index.md
// turns VitePress's one-line footer off there). Its links are the nav's, with
// the places the nav leaves out: the package, the extension, privacy and terms.
const { frontmatter, theme } = useData()

// The specification, profiles, guides and changelog are read in geml-spec/geml,
// as in config.mts.
const GH = 'https://github.com/geml-spec/geml/blob/main'
const GH_TREE = 'https://github.com/geml-spec/geml/tree/main'

type Link = { text: string; link: string; target?: '_blank' }

// The playground is a page under public/, not a VitePress route: a target keeps
// the router from looking it up, as the nav's does.
const columns: { title: string; links: Link[] }[] = [
  {
    title: 'Start',
    links: [
      { text: 'Get Started', link: '/get-started' },
      { text: 'Playground', link: '/playground/', target: '_blank' },
      { text: 'Cheat sheet', link: '/cheat-sheet' },
      { text: 'Illustrated syntax', link: '/illustrated/' },
      { text: 'Demos', link: '/demos' },
    ],
  },
  {
    title: 'Reference',
    links: [
      { text: 'Specification', link: `${GH}/spec/GEML-spec.md` },
      { text: '规范（中文）', link: `${GH}/spec/GEML-spec_CN.md` },
      { text: 'Profiles', link: `${GH_TREE}/spec/profiles` },
      { text: 'Proposals (GEPs)', link: `${GH_TREE}/spec/proposals` },
      { text: 'Changelog', link: `${GH}/CHANGELOG.md` },
    ],
  },
  {
    title: 'Guide',
    links: [
      { text: 'Claude Code & MCP', link: `${GH}/docs/mcp-guide.md` },
      { text: 'Writing a parser', link: `${GH}/docs/WRITING-A-PARSER.md` },
      { text: 'Comparisons', link: '/compare/matrix' },
      { text: 'Benchmarks', link: '/benchmarks/' },
      { text: 'Manifesto', link: '/manifesto' },
    ],
  },
  {
    title: 'Project',
    links: [
      { text: 'Source', link: 'https://github.com/geml-spec/geml' },
      { text: '@geml/geml on npm', link: 'https://www.npmjs.com/package/@geml/geml' },
      { text: 'Chrome extension', link: 'https://chromewebstore.google.com/detail/opmhfphgoidpnipphfgkhhjhmnmaenie' },
      { text: 'Blog', link: '/blog/' },
    ],
  },
]

const isExternal = (l: Link) => /^https?:/.test(l.link)
</script>

<template>
  <footer v-if="frontmatter.layout === 'home'" class="home-footer">
    <div class="home-footer-main">
      <div class="home-footer-brand">
        <a class="home-footer-logo" href="/"><VPImage :image="theme.logo" alt="GEML" /></a>
        <p class="home-footer-tagline">{{ frontmatter.hero?.text }}</p>
        <VPSocialLinks class="home-footer-social" :links="theme.socialLinks" />
      </div>
      <nav class="home-footer-columns" aria-label="Site map">
        <div v-for="col in columns" :key="col.title" class="home-footer-col">
          <h2>{{ col.title }}</h2>
          <ul>
            <li v-for="l in col.links" :key="l.link">
              <a
                v-if="isExternal(l)"
                class="vp-external-link-icon"
                :href="l.link"
                target="_blank"
                rel="noopener"
              >{{ l.text }}</a>
              <a v-else :href="l.link" :target="l.target">{{ l.text }}</a>
            </li>
          </ul>
        </div>
      </nav>
    </div>
    <div class="home-footer-bar">
      <span v-if="theme.footer?.message">{{ theme.footer.message }}</span>
      <span class="home-footer-legal"><a href="/privacy">Privacy</a> · <a href="/terms">Terms</a></span>
    </div>
  </footer>
</template>

<style scoped>
.home-footer {
  border-top: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  padding: 56px 24px 0;
}

.home-footer-main,
.home-footer-bar {
  margin: 0 auto;
  max-width: 1152px;
}

.home-footer-main {
  display: grid;
  gap: 40px;
}

@media (min-width: 768px) {
  .home-footer { padding: 64px 32px 0; }
}

/* Wordmark and links side by side once the four columns fit beside it; below
   that the wordmark sits above them. */
@media (min-width: 1024px) {
  .home-footer { padding: 64px 64px 0; }
  .home-footer-main { grid-template-columns: minmax(200px, 1fr) auto; gap: 48px; }
}

/* The wordmark sits inside a quarter of padding on every side (custom.css, nav):
   letters 26px tall, the padding let out. */
.home-footer-logo { display: inline-block; margin: -13px; }
.home-footer-logo :deep(img) { display: block; height: 52px; width: auto; }

.home-footer-tagline {
  margin: 16px 0 12px;
  max-width: 260px;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.home-footer-social { justify-content: flex-start; margin-left: -8px; }

.home-footer-columns {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px 24px;
}

/* Four columns as wide as their longest link, one line each, the room between
   them shared out. */
@media (min-width: 768px) {
  .home-footer-columns {
    grid-template-columns: repeat(4, max-content);
    justify-content: space-between;
    column-gap: clamp(32px, 4vw, 64px);
  }
  .home-footer-col a { white-space: nowrap; }
}

.home-footer-col h2 {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.home-footer-col ul { margin: 0; padding: 0; list-style: none; }
.home-footer-col li { margin: 6px 0; }

.home-footer-col a,
.home-footer-legal a {
  font-size: 14px;
  line-height: 24px;
  color: var(--vp-c-text-2);
  transition: color 0.25s;
}

.home-footer-col a:hover,
.home-footer-legal a:hover { color: var(--vp-c-brand-1); }

.home-footer-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: 48px;
  border-top: 1px solid var(--vp-c-divider);
  padding: 20px 0 32px;
  font-size: 13px;
  line-height: 24px;
  color: var(--vp-c-text-2);
}

.home-footer-legal a { font-size: 13px; }
</style>

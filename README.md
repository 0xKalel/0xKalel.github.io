# 0xkalel.github.io

Portfolio and CV engine for [Khalil Hebachi](https://0xkalel.github.io) — a static Astro site where every number on the page traces back to a measured source, and the CV rebuilds itself per role.

## Stack

Astro 7 · Tailwind 4 (design tokens via `@theme`) · MDX content collections · TypeScript · Playwright (PDF pipeline) · GitHub Pages

## How it's put together

**Case studies as data.** Each project in `src/content/work/` is an MDX file with a typed frontmatter schema (metrics, videos, screenshots). Pages assemble themselves from it: metric grids, media galleries with scroll-snap slides, and small SVG visualisation components (`src/components/viz/`) instead of prose.

**One CV, many roles.** `src/data/cv.ts` holds every fact as a bullet tagged by audience (`lead`, `ai`, `founder`, `freelance`, …) with a weight. `src/lib/cv.ts` scores and picks bullets per role defined in `src/data/roles.ts`, so each role gets a different two-page CV from the same single source of truth — no copy drift between variants. The public page shows one default CV; role variants live at unlisted URLs with `?ref=` tracking on outbound links.

**CVs print themselves.** `scripts/pdf.mjs` boots the built site with Astro's preview server, opens each CV variant in headless Chromium via Playwright, and prints it with `page.pdf()` under a hard constraint: every variant must fit exactly two A4 pages. The PDFs ship with the site from the same build.

**Machine-readable on purpose.** The CV page extracts cleanly for ATS parsers (real text separators, not flex gaps), plus JSON-LD and `llms.txt` for agents reading the site.

**Interactions in one file.** `src/scripts/site.ts` wires reveals, galleries, theme, the command palette and view transitions — plain DOM, no framework runtime on the page.

## Run it

```bash
npm install
npm run dev      # astro dev
npm run build    # site + all CV PDFs into dist/
```

Deploys from `main` via GitHub Actions to GitHub Pages.

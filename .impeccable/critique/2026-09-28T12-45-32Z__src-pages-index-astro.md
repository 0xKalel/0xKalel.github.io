---
target: the whole portfolio (homepage, case study, blog, how-i-work, cv, 404)
total_score: 24
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 5
target_identity: "file:/home/khalil/projects/myportfolio/src/pages/index.astro"
target_fingerprint: "sha256:854cd68423f12d6cc1cbe5859a1e781c4d027e0b8e6983f3feb76d72d8871b3c"
target_path: /home/khalil/projects/myportfolio/src/pages/index.astro
timestamp: 2026-09-28T12-45-32Z
slug: src-pages-index-astro
---
Method: three isolated reviewers (A: design review, B: detector + browser audit, C: typography) plus a motion pass. HEAD 767ba50, 1440 and 390, both themes.

## Scores
Design health 24/36 (67%, Acceptable; #10 n/a): 1:3 2:2 3:3 4:2 5:3 6:3 7:3 8:2 9:3.
Audit 16/20 (Good): A11y 3, Perf 4, Responsive 3, Theming 3, Integrity 3. Lighthouse 98-100 all categories.

## Design specificity
Strongly authored (gates with real work, Level chips, HUD, exit door, 404 spike pit). Risk flipped from generic to gimmicky: potion marks on nav/CTAs, Drink me always on, unlabeled HUD triangles, infinite torch flicker. Detector: side-tab callout x5 real (.decision-note, .post-prompt-text, .post-incident, .post-outcome, .post-after); line-length 92-109 chars on blog; CV tiny text. False positives: low-contrast (pixel shadows, 2px gradient rule), organic clip-path (pixel arches), cream palette (Palace brief).

## What's working
1. Hero gates frame real work, accessible captions lift gates on focus.
2. Plain topic headings; hero states role, 14 years, AI workflow; metrics keep periods.
3. Blog short-version cards.

## Priority issues
- [P1] Pixel font misuse: Jersey 10 grid is 3/56em (upm 1400, 75-unit grid), crisp only at 18.667px multiples; 60px h2 15.9% fuzz vs 0% at 56px; sentence-case Jersey titles with -.05em tracking fuse (global.css:787); 20+ labels at 12-17px illegible; missing glyphs (→ ≈ ⌘) fall back in pixel stats. /impeccable typeset
- [P1] No type system: 80 font sizes, 39 clamps, 138 px vs 27 rem; work-title h3 130px > h2 60px; related title 42 > its h2 36; stats > h2; card h3 < body; four h1 treatments. /impeccable typeset
- [P1] Game competes with hiring: 10 red potion marks on nav, mobile menu, case CTAs; Drink me always on (global.css:484); first-visit flash; unlabeled triangles; infinite torch/potion motion. /impeccable quieter
- [P1] Proof order and availability: StoragePal leads with admin page counts (evidence.ts:11-12); +34% transport revenue and 9.1s to 0.884s buried; no open-to line. /impeccable clarify
- [P1] A11y: focus obscured by HUD and sticky header (WCAG 2.4.11), fix scroll-padding; px sizes ignore user font size (body 16px global.css:121); label-in-name mismatch (Potion.astro:16, Nav.astro:44). /impeccable harden
- [P2] CV PDF: 9 Type 3 fonts, no embedded TrueType (variable Geist via Chromium). Use static Geist. /impeccable harden
- [P2] Length and endings: selected work 3,356px, SPS dead column, 4 links per case study, 7 mailto, case studies end on a text link, prose 82-95 chars. /impeccable layout
- [P2] Theme leftovers: ExitDoor 17 hard-coded hex (dark in Palace), CV green accent, duplicated light block, theme-color x4, side-stripe x5, unstyled chips. /impeccable polish

## Typography
Geist 29KB preloaded; Geist Mono 23KB not preloaded but above fold; Jersey 13KB preloaded, also on /cv (unused); Space Grotesk dead dependency. ui-monospace/ui-sans-serif Safari-only; no size-adjust fallbacks; CLS 0.0008 only thanks to preloads. Recommended tokens: --fp, --pixel-poster 149.333/93.333, --pixel-title 130.667/56, --pixel-h2 56/37.333, --pixel-data 56/37.333, --pixel-label 18.667, Geist --text-h1..meta in rem, --label-compact Geist Mono 12px.

## Motion
55 hover rules, 1 hover-gated; 4 :active rules; keyword ease-out x40 vs var(--ease-out); scale(0) on weekday grid (global.css:598); infinite torch flicker; 25 .fx reveals.

## Persona red flags
Recruiter mobile: name 21% of screen, proof below fold, Drink me prominent, red menu marks, no availability. Founder: weak StoragePal lead, SPS dead column, flat case-study ending. Keyboard: focus hidden under HUD; game rules announced once.

## Minor
Jargon remains; Ask voice mix; Palace torch toggle looks like a pine tree; HUD title truncates at 320; Recommendations h3 under Experience; main overflow-x clip.

## Questions
Which first: typography system, hiring message, or a11y + CV PDF? How visible should the game be? Scope?

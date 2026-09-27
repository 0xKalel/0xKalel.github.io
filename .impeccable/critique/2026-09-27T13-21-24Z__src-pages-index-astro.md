---
target: the homepage
total_score: 25
max_score: 36
na_heuristics: 10
p0_count: 0
p1_count: 3
target_identity: "file:/home/khalil/projects/myportfolio/src/pages/index.astro"
target_fingerprint: "sha256:a648d47465296149beb0d42cb1f2a16bed9580ee6a522e37ac14191d76c17da0"
target_path: /home/khalil/projects/myportfolio/src/pages/index.astro
timestamp: 2026-09-27T13-21-24Z
slug: src-pages-index-astro
---
Method: dual-agent (A: design review, B: detector and browser evidence)

## User checks
- No em dashes: PASS (0 in rendered text, HTML, and sources)
- No big text blocks: PASS (longest paragraph 34 words, longest quote 42)
- Readable: PASS (all contrast pairs pass both themes, lowest 5.03:1; body 16-18px; lines 57-71 chars)
- Scannable: PARTIAL (slogan headings, topic in 12px label)
- Not vibe coded: PARTIAL (top half authored, middle four sections generic)

## Design health score (25/36, 69%, Acceptable; #10 n/a)
| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of status | 3 | Progress bar and numbered sections work |
| 2 | Match real world | 3 | Jargon: "backoffice pages on one shared list system", "moves between bays" |
| 3 | User control | 3 | Floating chat button cannot be dismissed, covers content |
| 4 | Consistency | 3 | Up-right arrow on internal links; domain bars open case study |
| 5 | Error prevention | 3 | Little can go wrong |
| 6 | Recognition over recall | 2 | Slogan headings; topic in 12px label |
| 7 | Flexibility | 3 | Cmd+K, skip link, theme toggle |
| 8 | Minimal design | 2 | 8 sections, 15 first-screen controls, 42 chips, 9 reviews, 26 arrows |
| 9 | Error recovery | 3 | Chat has email fallback; 9 dead controls without JS |
| 10 | Help | n/a | Portfolio |

## Design specificity
Top half authored (paper/ink/lime discipline, Work section, SPS weekday grid). Middle four sections (How I work, Stack, Ask, Writing) are category template.
Tells: stack bento with icon per cell and 42 chips; identical 7x section template (lime number chip, 72px slogan, grey note); terminal prompt with endless blinking cursor; two chatbot entry points; 9-card testimonial wall; arrow on every link; hero preview duplicates Work in different order.
Detector: .astro scan clean; global.css 9 findings (side-tab .work-decision :401, layout-transition padding :406 :514). Overlay 26 desktop / 23 mobile: all-caps-body 14, kicker-above-heading 7, heading-rhythm 3, extreme-negative-tracking 1, layout-transition 1. False positives: Geist overused-font (pinned by brief), short mono caps labels, work-title heading rhythm (intentional grouping).

## What's working
1. SPS 120/120 weekday grid (viz/Weekdays.astro)
2. Proof system: decision callouts, honest role labels, measurement periods
3. Experience timeline one-line results

## Priority issues
- [P1] Hero is generic (index.astro:53-54): no AI-native, years, roles, availability; best proof in 15px caption; 161px name takes a quarter of the fold. Fix: specific statement, roles/availability line, proof moved up, smaller name. Command: /impeccable clarify + /impeccable layout
- [P1] Page too long in the middle: 8 sections, 11,181px desktop / 14,633px mobile; How I work, Stack, Ask, Writing ~4 desktop screens. Fix: Hero, Work, Experience + 3 reviews, Contact. Command: /impeccable distill
- [P1] Slogan headings and inverted size hierarchy (index.astro:138,159,196): h3 work titles 115px > h2 72px > proof numbers 34px. Fix: plain topic headings 44-52px. Command: /impeccable typeset
- [P2] Too many links/arrows: case studies linked 3-4x, email 5x, 26 arrows, fake external domain bars. Fix: one link per project, up-right arrow external only, domain bars to live sites. Command: /impeccable clarify
- [P2] Mobile friction: chat button covers preview link; 21 tap targets under 44px; reviews ~4 screens; phone screenshots ~95px wide. Command: /impeccable adapt

## Persona red flags
- Recruiter: no roles/availability; "14 years" only as "Building since 2012" 8 screens down; contact addresses "your business"
- Mobile: 17 screens; header Email hidden under 560px; chat bubble covers content
- Stress tester: 200% zoom name fills first screen; dark-mode stack lead cell off-white slab; 9 dead controls without JS
- Hiring founder: list opens with StoragePal's weakest metrics; no live product links; SPS never spelled out

## Minor observations
- "StoragePal catalogue" alt text (ProjectPreview.astro:12), British spelling
- Hedge "For anything serious, email me." (index.astro:179)
- "600+ daily users" without period (Timeline.astro:9)
- "Everything above runs on it" wrong in grid (index.astro:38)
- Rule-of-three copy: hero sub, contact line, AI note
- Hero preview biggest text is an OpenAI headline
- French review untranslated
- Hyphen ranges are compliant

## Questions to consider
- What if the first screen said the one thing a founder should remember, and the name got smaller?
- Does the homepage need How I work, Stack, Ask and Writing, or do case studies and CV cover them?
- What if every section heading were scannable on its own, like the timeline rows?

---
title: "Ravenclip: a self-publishing AI newsroom"
description: "The engineering behind an unattended news-to-video SaaS: a status-driven DAG, 28 agents on laravel/ai, prompt design as a discipline, six layers against bad LLM output, provider failover, and a cost ledger where every dollar has a row."
date: 2026-09-25
tags: [ravenclip, ai-engineering, laravel, llm]
---

*Ravenclip turns fresh news into short vertical videos and publishes them unattended. I built it end to end and I operate it. This is the deep version; the short story is on the [case study page](/work/ravenclip/).*

## At a glance

| | |
|---|---|
| Product | [ravenclip.com](https://ravenclip.com) — news-to-video autopilot for TikTok, YouTube Shorts and Instagram Reels |
| Role | Founder-engineer: product, backend, frontend, AI, infra, ops |
| Timeline | First commit May 24, 2026 → paying customers by September 2026 (~1,450 commits) |
| Backend | Laravel 13 / PHP 8.5, laravel/ai, Horizon, MariaDB, Redis — ~130k lines across 845 classes |
| Frontend | Inertia + React 19, Tailwind v4 — ~500 TypeScript files, 5 languages (en/fr/de/es/nl) |
| Render stack | Custom Node/Skia overlay renderer (~10k lines) + ffmpeg compositing, 1080×1920 |
| AI layer | 28 LLM agents, 10+ external providers, every call priced in a cost ledger |
| Tests | ~1,300 Pest tests, including guard tests that scan the source itself |
| Infra | Debian VPS, Caddy, systemd, Cloudflare R2 — no Kubernetes, no cloud bill surprises |

## The story

I am a developer. I wanted to follow AI news without reading twenty tabs a day — a short, good video of the stories that mattered to me would have been enough. So I built one for myself: a script that watched feeds, picked the story worth telling, and rendered a vertical video I would actually watch.

Friends asked for their own topics — sports, gaming, crypto, markets. Then they asked for it to post on its own, in their language, on their schedule. That is when a personal tool became a SaaS. And while selling it I found the real customer wasn't people like me at all: it was businesses — agencies, consultancies, coaches — who need consistent, high-quality short video on their YouTube and TikTok but don't have a video team. Within weeks of launch Ravenclip had its first paying customers, spread across exactly that profile.

Today it is a newsroom that runs itself: it reads the wire, picks the story, writes, voices, designs, renders and publishes. The rule from day one has not changed — every story starts from a named source, and every fact traces back to it.

## Pipeline architecture: a status-driven DAG, not a job chain

```
ingest → enrich → select + script ──┬─→ audio → transcript ──┐
                                    └─→ direction → assets ──┤→ render → review → publish
                                          (metadata alongside)
```

After the script stage the pipeline forks into two parallel branches — voice (TTS, then word-level transcription via AssemblyAI) and visuals (scene direction, then asset generation) — that rejoin at render. The deliberate decision: **stages are not `Bus::chain`ed**. Each `Script` carries per-stage status columns, and an autopilot runner walks them, advancing whatever is ready. That makes every stage independently retryable, resumable after a deploy, and re-runnable when a user edits one scene — a chain would have to be rebuilt from scratch each time.

Details that only show up in production:

- A shared `ClaimsStageStatus` trait claims each stage in one row-locked transaction, so a duplicate queue delivery can never run a stage twice.
- Waiting for a per-minute cron to notice a finished stage added dead time, so stage jobs call an advancement "kick" on completion — it closed a measured 13–60 second gap at the voice/visuals rejoin.
- Horizon runs one supervisor per stage with an explicit timeout stack (job timeout < supervisor timeout < queue `retry_after`), and killed renders recover in layers: queue redelivery, a stuck-render reaper, then a failed-run retry that re-renders from existing assets.

## The AI layer: 28 agents on laravel/ai

Ravenclip runs on Laravel's official AI SDK (`laravel/ai`). Twenty-eight agent classes cover triage, enrichment, blueprinting, hook crafting, narration, scene direction, delivery markup, metadata and more; twenty-six return structured output validated against `Illuminate\JsonSchema` schemas.

The schemas are not just validation — they are part of the prompt. Each narrator beat is `{adds, contentText}`, with `adds` deliberately declared *before* the text: the model must name the new thing a beat teaches before it writes the beat. That field is discarded at persist time. It exists purely to shape generation, and it is the strongest anti-repetition device in the system.

Other things the SDK layer handles: per-stage Gemini thinking levels (triage runs `minimal`, the writer `medium` — the default was the dominant latency), and cost math verified against the SDK's own gateway source, because Gemini reports reasoning tokens separately while Groq folds cached tokens into the prompt count. Get that wrong and your unit economics are fiction.

## Prompt design as an engineering discipline

The prompts are governed by a written design doc whose opening premise is: *"Every structural choice below was paid for with a real failure observed in production output."* The method, condensed:

**Laws, not rule piles.** The scriptwriter prompt once accumulated nine sections of bans, and fixing it was whack-a-mole: banning "remains to be seen" produced "We will see if this pays off"; banning the question form produced a different appended question. It was replaced by an identity and three laws — **TRUE** (only what the source states), **DENSE** (every sentence teaches something new), **SPOKEN** (one voice; the last line is the strongest concrete fact, stated, not asked). A model can reason *from* a law; it cannot reason from rule #27. The rewrite also cut the prompt to ~60% of its old size — about 25% fewer input tokens and ~3 seconds per call.

**One prototype exemplar per banned family — exactly one.** Zero examples get rules-lawyered around; a long list invites it too. When the first pure-laws script invented a crowd ("Gamers are hyped…"), one added line — *an invented crowd is fabrication, not color* — fixed the family, and the next three generations were clean.

**State the artifact's truths, never the pipeline's architecture.** A leaked developer note like "a second pass adds every visual" became "Every character you write is spoken aloud — write nothing that is not speech," because TTS speaks the text verbatim. The test for every prompt sentence: would removing it change what the model writes?

**The maintenance rule** sits in the agent's docblock: when output degrades, *sharpen the law it violates or remove the content pushing toward it — never append a ban.* Antagonists hide everywhere: one enum's description ("reactions and outlook last") was quietly pushing half of all scripts toward the exact filler ending the laws banned.

**Prompts are pinned by tests.** Earned exemplars are asserted verbatim; another test renders every editorial stage × industry combination and rejects duplicated passages. And because measurement showed provider-side prompt caching never fired at our call cadence (`cache_read_tokens = 0`, re-verified on back-to-back renders), prompt *size* is treated as the real cost lever — with the static/dynamic split already in place so caching can be switched on when volume justifies it.

## When the model returns a bad thing

The pipeline assumes every LLM answer may be wrong, and defends in layers:

1. **Deterministic gates on every draft** — grounding against the source, hook shape (a 3–14-word first breath), payoff, ending, length. Attempts are scored lexicographically, most-fatal defect first, and the best draft wins.
2. **Retries that learn.** A failed attempt's gate details are appended to the retry prompt as an explicit revision target — retrying the identical prompt merely rolls the dice.
3. **A verbatim round-trip guard.** The second pass that types scenes must preserve the narrator's words exactly; if it doesn't, the system falls back to the vetted lines, so the audio is always exactly what the gates checked.
4. **A critic pass that can't make things worse.** A retention critic may rewrite a gate-clean winner once; the rewrite ships only if it is also gate-clean *and* scores strictly higher.
5. **Deterministic post-processing.** On-screen text that isn't contained in the source is dropped; near-duplicate scene backdrops are detected by embedding and rewritten; scores, standings and prices are injected after the call so the model never invents figures.
6. **Graceful degradation.** Each news/sports/gaming vertical has a rich curated director; if its call exhausts every key, a generic director takes over so a (less rich) video still ships. Binary fit gates fail open on provider outage so channels never idle.

The honest number that drives this architecture: even after the laws named a failure mode, roughly 1 in 4 generations still produced it. The lever at that point is a deterministic check — not more prompt text.

## Multi-provider, multi-key resilience

Every external call goes through one shared failover loop used by LLM, TTS, transcription, image, and embedding calls alike. Keys live in comma-separated `.env` pools per provider; providers form an ordered chain.

| Domain | Chain |
|---|---|
| LLM | Gemini → OpenRouter (DeepSeek) |
| Voice | Gemini TTS → previous-gen Gemini → Google Chirp 3 HD → ElevenLabs (same-speaker rescue only — voice consistency forbids cross-voice fallback) |
| AI images | Runware → Pollinations → Hugging Face (tier-preserving — failover never silently downgrades quality) |
| Embeddings | Cloudflare → Gemini (chosen once per call so vector spaces never mix) |
| Stock / transcription | Pexels → Pixabay · AssemblyAI |

The loop's rules were each paid for by an incident: keys start at a shuffled index so free-tier keys share load evenly (capacity scales ~linearly with keys added); transient 429/5xx get a same-key retry with backoff; at most two connection timeouts per provider before failing over — never burn six keys × a 60-second hang; an optional wall-clock budget makes long stages fail cleanly instead of being killed. A provider judged out-of-credit rests on a shared 30-minute cooldown (born from 112 wasted "insufficient credits" attempts in one month), and any successful call ends the rest immediately.

## The system emails me before customers notice

The motivating incident: a fallback provider once ran dry and stayed dry for 25 days, visible only in the ledger's failure rows — while every call silently failed over to a lane 3× the price. Never again. Two layers now watch every provider:

- **Reactive:** every failover attempt feeds a health monitor that classifies failures (billing / auth / transient / unreachable) and alerts on real incidents — two billing refusals in 30 minutes, or sustained full exhaustion — with an atomic 24-hour latch so one incident is never mailed twice.
- **Proactive:** 13 provider probes run every 30 minutes, reading real balances where an API exists and alerting below thresholds. For Gemini's prepaid credit there is *no* balance endpoint — so the system estimates it from its own cost ledger: credit topped up minus recorded spend, a 7-day burn rate, "≈ $X left, about N days left," with top-ups auto-detected when a billing outage ends.

The alert emails are written to be acted on half-asleep: *"Replace the rejected key in the matching `*_API_KEYS` pool in `.env`. Restart Horizon."* A daily probe run bypasses the queue entirely, so the alert still leaves even when the queue worker is the thing that is down.

## Every dollar has a row

The cost ledger's rule: one row per billable call, written **at the moment the provider charges** — before any shape check, because a junk answer was still paid for. Each row snapshots the rate at insert; money rows are never deleted, only superseded, so retries and re-rolls stay counted. A failed ledger write loses a cost data point, not a video.

On top of it: a single unit-economics formula — (direct spend + shared pool + prorated infra) ÷ videos rendered, waste included — backing an admin dashboard with per-plan margins and break-even; a daily audit that flags unpriced models, $0 rows from paid providers, and provider-reported charges drifting >25% from the pinned rate; and my favorite test in the codebase, a **source-scan guard**: it greps the app for every agent class and every paid API hostname and fails the suite if any of them lacks a registered cost-recording site. A new external call that nobody ledgered cannot reach production.

## The SaaS around it

A custom Inertia admin runs the operation: a per-stage pipeline lab (regenerate any stage of any video), user management with bonus-credit grants, cost and unit-economics dashboards, a provider-health board with on-demand probes, and an RSS registry with per-desk coverage health. Billing runs on Whop; an append-only credit ledger with a cached wallet balance meters the free tier — one credit is one video *edition*, consumed idempotently at first successful render, with re-renders free. Autopilot is a per-channel state machine: scheduled slots or article-driven triggers, posting days, a review window during which the owner is emailed and can edit or discard, and a breaking-news interrupt that can pre-empt an unposted video. Publishing is live on TikTok and YouTube, with Instagram wired behind Meta's app review.

## Why one pair of hands can maintain it

The codebase optimizes for rules with one home. Writing laws live in one shared trait used by both writer agents; the beat timeline that paces clips *and* graphics is one planner; the per-video cost formula is one class; a word-length target is read by the prompt and its gate from the same config key, so instruction and tripwire never diverge. Extension points are explicit seams — new verticals subclass the curated director, new free tools go through one capped, ledgered runner. Every pipeline stage has a docs page treated as source of truth, incidents are recorded in code comments with dates, and destructive migrations are blocked outright in dev. ~1,300 tests hold it together — including the ones that test the source code itself.

## Outcome

Ravenclip is live, bootstrapped, and earning: paying customers across marketing, AI consulting and coaching, 19 industry verticals, five languages, videos publishing daily without a human in the loop — and when something breaks at 3 a.m., the system has usually failed over, alerted, and priced the incident before anyone notices. If you read one thing to see how I think, read the failover and cost-ledger sections again: the discipline is the product.

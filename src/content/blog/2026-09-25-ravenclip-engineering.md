---
title: "How I built RavenClip"
description: "Resumable video generation, AI output checks and cost tracking."
date: 2026-09-25
tags: [ravenclip, ai-engineering, laravel, llm]
---

RavenClip turns news into videos and publishes them automatically. I built and run it with Laravel, React, a Node/Skia renderer and FFmpeg. The [case study](/work/ravenclip/) covers the product. These are the main engineering decisions.

## Save progress at every stage

A video passes through news selection, scripting, voice, visuals, rendering and publishing. Voice and visuals run in parallel.

I store each stage’s status in the database. A runner advances the stages that are ready. This lets a failed render resume without repeating the paid AI calls.

- A row-locked transaction prevents two workers from claiming the same stage.
- Finished jobs trigger the next stage immediately. This removed a measured 13–60 second wait.
- Each stage has its own worker supervisor and timeouts. Recovery jobs retry stuck renders using existing assets.

## Give models a clear output structure

The system uses 28 agent classes through `laravel/ai`. Twenty-six return structured output checked against schemas.

Each narration beat contains `{adds, contentText}`. The model must state what new information the beat adds before writing it. I discard `adds` after generation; its job is to reduce repetition.

I also set reasoning levels per stage. Simple triage does not need the same budget as scriptwriting.

## Keep prompts short

The scriptwriter once had nine sections of bans. Fixing one phrase often produced a different version of the same problem.

I replaced that list with three rules:

- **True:** use facts from the source.
- **Dense:** add information in every sentence.
- **Spoken:** write words that sound natural aloud.

I kept one example for each recurring failure. The rewrite reduced input tokens by about 25% and saved roughly three seconds per call.

Prompts still failed. One named failure appeared in roughly one in four generations. I added automated checks instead of more instructions.

## Check output before publishing

The pipeline checks drafts against the source, length limits and editorial rules. Failed checks become specific instructions for the next attempt.

Later stages must preserve the approved narration. A revision is accepted only if it passes the checks and scores higher. Scores, standings and prices come from data sources rather than model-generated figures.

These checks reduce errors. They do not make generated content infallible.

## Handle provider failures in one place

Language, voice, image and embedding calls use one shared fallback mechanism.

| Task | Providers |
| --- | --- |
| Script | Gemini → DeepSeek via OpenRouter |
| Voice | Gemini TTS → Chirp 3 HD → ElevenLabs |
| Images | Runware → Pollinations → Hugging Face |
| Embeddings | Cloudflare → Gemini |

Voice fallbacks must preserve the speaker. Image fallbacks must preserve the quality tier. Embedding calls use one provider at a time to avoid mixing vector spaces.

Temporary failures get a retry with backoff. Two connection timeouts trigger a switch. Providers with no credit are skipped for 30 minutes.

## Monitor the fallbacks too

One fallback provider ran out of credit for 25 days. Videos still worked, but calls moved to a service costing three times as much.

I added checks every 30 minutes, balance alerts and failure monitoring. When a balance API is unavailable, the system estimates credit from recorded spend.

Alerts say what to change and which service to restart. A daily check runs outside the queue so it can still report a failed worker.

## Count failed calls in the cost

Every billable call gets a ledger entry, including unusable responses and retries. Each entry stores the rate used at the time.

The dashboard calculates cost per video from API spend, shared costs and infrastructure. A daily audit flags missing prices and unexpected charges. A source-scanning test catches paid integrations without cost tracking.

## Keep it maintainable

I keep shared rules in one place: retry handling, cost calculations, narration rules and timing. Tests cover the rules, and incident notes explain why they exist.

The product has around 1,300 automated tests. Paying customers use it across 19 topics and five languages. TikTok and YouTube publishing are live; Instagram approval is pending.

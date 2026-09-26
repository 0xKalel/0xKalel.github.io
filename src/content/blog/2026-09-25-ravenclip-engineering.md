---
title: "Building RavenClip: recovery, AI checks, and costs"
description: "Why I chose persistent stages, what deterministic checks can prove, and what a hidden provider failure taught me."
date: 2026-09-25
updated: 2026-09-26
tags: [ravenclip, ai-engineering, laravel, reliability]
---

RavenClip turns news into videos and publishes them on a schedule. I built and operate it with Laravel, React, a Node/Skia renderer, and FFmpeg. The [case study](/work/ravenclip/) covers the product and its early customers. This article explains the technical choices and their limits.

## Persist progress where recovery matters

A video passes through story selection, scripting, voice, visuals, rendering, and publishing. Voice and visuals run in parallel before they rejoin at rendering.

Each stage stores its status in the database. A runner advances whatever is ready, and a row-locked transaction claims the stage. This helps prevent concurrent workers from starting the same stage and allows recovery without repeating all the paid generation work.

The workers have separate supervisors and an ordered timeout configuration: job timeout, then supervisor timeout, then queue redelivery. Recovery jobs can retry a stuck render using its existing assets. Publishing uses separate state checks and a unique database constraint to protect against duplicate posts.

This introduces state machines and recovery paths that need maintenance. For the shorter, fixed sequence after a user edits a scene, a bounded job chain is still the simpler choice. The full mechanism earns its place when generation runs unattended and publishes in public.

One measurement corrected my understanding of a queue improvement. Triggering advancement when stages finished reduced the observed median wait before rendering from nine seconds to two. The roughly one-minute tail remained. The result supports a median improvement, not a claim that the whole delay disappeared.

## Give models a structure, then check the result

The AI layer uses structured outputs checked against schemas. Each narration beat includes `{adds, contentText}`: the model names what new information a beat adds before writing it. The `adds` field is discarded before persistence; it exists to encourage information density.

I also choose reasoning budgets per stage. Simple triage does not need the same budget as scriptwriting.

The writer prompt once accumulated a long list of bans. Fixing one phrase often produced a different version of the same problem. I replaced the list with three principles:

- **True:** use facts from the source.
- **Dense:** add information in each sentence.
- **Spoken:** write words that work as narration.

One example remains for each recurring failure. The measured input-token reduction was 15–18% per call. Simpler instructions helped, but prompts still produced unwanted output.

## Be precise about what a check proves

Deterministic gates check subject grounding, hook shape, length, and endings. Failed attempts get specific revision instructions. The system ranks drafts by their defects, and a critic's rewrite is accepted only if it also passes the gates and scores higher.

Later scene-planning stages must preserve the approved narration. If they change it, the system falls back to the checked lines. On-screen scores, standings, and prices come from data sources rather than model-generated figures.

Passing these gates does not establish factual truth. A false claim assembled from words in the source can still pass. Spoken figures are not checked, and non-Latin narration skips the subject-grounding check. Customers therefore retain review controls, and warned videos wait for approval.

An automated score is useful within those boundaries. It is not an objective guarantee that a rewrite is better in every respect.

## Monitor the fallback path

External calls use a shared mechanism for retries, key rotation, and provider fallback. Transient errors get bounded retries with backoff. Two connection timeouts trigger a provider switch, and an exhausted balance gets a shared thirty-minute cooldown.

Different tasks have different compatibility requirements. Voice fallback should retain the speaker; image fallback should preserve the quality tier. Embedding providers must be handled consistently rather than mixing incompatible vector spaces.

A production incident exposed the limit of checking only whether videos finished. The enrichment provider ran out of credit for twenty-five days. Fallback kept working, and 8,162 calls moved to another service at about 3.16 times the per-call price. The extra recorded spend was modest, around $11–15; the missing visibility was the more useful lesson.

I added reactive failure classification and proactive provider probes every thirty minutes. Where a balance API exists, the system reads it. Where it does not, the system estimates remaining credit from recorded spend. A daily probe runs outside the queue so it can report a failed worker.

The monitors subsequently detected two prepaid-credit incidents within hours. That demonstrates detection, not prevention or a promise that operators will always hear before customers do.

## Record costs and understand the omissions

Billable calls are recorded before output validation because an unusable answer may still cost money. Entries retain the rate used at the time, and earlier cost rows remain available when an attempt is superseded.

A source-scanning test looks for paid integrations without a registered cost-recording site. It establishes that instrumentation exists; it does not prove the price is correct. A daily audit checks missing prices and differences from provider-reported charges.

For 1–25 September 2026, recorded direct API spend was $66.59 across 183 rendered videos, or about $0.36 per video. Including prorated infrastructure brought the estimate to about $0.45. Payment fees and my time are excluded, and same-key retries are not fully priced separately. These figures inform decisions; they are not proof of profitability.

Caching also needs a workload that makes it worthwhile. High-frequency enrichment calls had provider cache hits, while scene-direction calls were too sparse to keep the cache warm. I focused on prompt size there and deferred explicit caching until sustained volume could justify its cost.

## Building with AI and owning the mistakes

I use coding agents for implementation, investigation, and testing. I keep product scope, pricing, and architectural choices under my direction. Session records include corrections to both implementation and commercial proposals, including which features should belong in paid bundles.

On 2 September, an agent's regex-based bulk edit inserted code above the PHP opening tag. The tests it selected never loaded that file. It merged and deployed, and scene-asset jobs failed for about eighteen hours. Three videos stalled and recovered after the fix. A reviewer’s email exposed the problem before monitoring did.

I added a test that PHP files parse and a syntax sweep that aborts deployment before migrations run. I also began holding merges for a second review. Those are concrete safeguards; asking a tool to be more careful is not enough.

I had removed CI because it slowed my release loop. The full suite later accumulated twenty-three stale or leaking tests before I cleaned it on 25 September. I would keep a small syntax-and-smoke gate from the start next time. Adding the deployment syntax check does not mean a complete CI pipeline has been restored.

The product has about 1,300 test definitions, including dataset-driven cases. That count describes coverage infrastructure, not the absence of bugs. The useful evidence is which failure paths are checked and what happens when a check misses something.

## Keep the next improvement grounded

My next priorities include retaining measurement artifacts, keeping incident evidence beyond short log-retention windows, and closing cost-accounting gaps. RavenClip is an early product with three paying customers as of 26 September 2026. Operating it gives me concrete feedback about which abstractions help and which assumptions need revisiting.

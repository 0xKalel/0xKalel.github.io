---
title: "Building RavenClip: recovery, AI checks, and costs"
description: "Why I chose persistent stages, what automated checks can prove, and what a hidden provider failure taught me."
date: 2026-09-25
updated: 2026-09-26
tags: [ravenclip, ai-engineering, laravel, reliability]
---

RavenClip turns news into videos and publishes them on a schedule. I built and operate it with Laravel, React, a Node/Skia renderer, and FFmpeg. The [case study](/work/ravenclip/) covers the product and its early customers. This article covers the technical choices and their limits.

## Persist progress where recovery matters

A video goes through story selection, scripting, voice, visuals, rendering, and publishing. Voice and visuals run in parallel, then meet again at rendering.

Each stage saves its status in the database. A runner moves forward whatever is ready, and a row lock stops two workers from claiming the same stage. When something fails, the system can pick up where it stopped instead of repeating paid generation work.

The workers have separate supervisors and an ordered set of timeouts: job timeout, then supervisor timeout, then queue redelivery. Recovery jobs can retry a stuck render with the assets it already has. Publishing has its own state checks and a unique database constraint, so the same video cannot post twice.

This adds state and recovery paths that need maintenance. For the shorter, fixed sequence after a user edits a scene, a simple job chain is still the better choice. The full machinery is for generation that runs unattended and publishes in public.

One measurement corrected me here. Advancing stages the moment the previous one finished cut the median wait before rendering from nine seconds to two. The slowest waits, around one minute, stayed. The median improved; the whole delay did not disappear.

## Give models a structure, then check the result

The AI layer uses structured outputs checked against schemas. Each narration beat includes `{adds, contentText}`: the model must name what new information the beat adds before writing it. The `adds` field is thrown away after the check. Its only job is to push the model toward saying something new in every line.

I also set a thinking budget per stage. Simple sorting work does not need the same budget as scriptwriting.

The writer prompt once carried a long list of banned phrases. Fixing one phrase just produced a new version of the same problem. I replaced the list with three principles:

- **True:** use facts from the source.
- **Dense:** add information in each sentence.
- **Spoken:** write words that work read aloud.

One example remains for each recurring failure. Input tokens dropped 15-18% per call. Simpler instructions helped, but prompts alone still let some bad output through.

## Be precise about what a check proves

Automated gates check that the script stays on its subject, that the hook has the right shape, and that length and endings fit. Failed attempts get specific instructions on what to fix. The system ranks drafts by their defects, and a critic's rewrite is accepted only if it also passes the gates and scores higher.

Later stages must keep the approved narration. If they change it, the system falls back to the checked lines. On-screen scores, standings, and prices come from data sources, not from the model.

These gates cannot confirm that a claim is true. A false sentence built from words in the source can still pass. Spoken figures are not checked, and non-Latin scripts skip the subject check. So customers keep review controls, and flagged videos wait for approval.

## Monitor the fallback path

External calls share one mechanism for retries, key rotation, and switching providers. Temporary errors get a few retries with growing delays. Two connection timeouts in a row trigger a provider switch, and an empty balance gets a shared thirty-minute cooldown.

Different tasks have different switching rules. A voice fallback should keep the same speaker. An image fallback should keep the quality level. Embedding providers must never be mixed, because their outputs do not compare.

A production incident showed the limit of only checking whether videos finished. One provider ran out of credit for twenty-five days. Fallback kept everything running, and 8,162 calls quietly moved to another service at about 3.16 times the price per call. The extra spend was small, around $11-15. The lesson was the missing visibility, not the money.

I added failure classification and provider health checks every thirty minutes. Where a balance API exists, the system reads it. Where it does not, the system estimates remaining credit from recorded spend. A daily check runs outside the queue, so it can report even when a worker is down.

The monitors have since caught two prepaid-credit incidents within hours.

## Record costs and understand the omissions

Billable calls are recorded before the output is validated, because an unusable answer can still cost money. Each entry keeps the rate that applied at the time, and old cost rows stay available when an attempt is replaced.

A code-scanning test looks for paid integrations that have no cost recording. It proves the recording exists, not that the price is right. A daily audit checks for missing prices and for differences from what providers report.

From 1-25 September 2026, recorded API spend was $66.59 across 183 rendered videos, about $0.36 per video. With a share of the infrastructure added, the estimate is about $0.45. Payment fees and my time are not included, and retries on the same key are not fully priced apart.

Caching also needs enough traffic to pay off. Frequent enrichment calls got provider cache hits. Scene-direction calls were too rare to keep a cache warm, so I cut prompt size there instead and left caching until the volume justifies it.

## Building with AI and owning the mistakes

I use coding agents to build, investigate, and test. Product scope, pricing, and architecture stay under my direction. My session records include corrections to both code and business proposals, down to which features belong in paid plans.

On 2 September, an agent's bulk edit put code above the PHP opening tag. The tests it chose never loaded that file. The change merged and deployed, and scene-asset jobs failed for about eighteen hours. Three videos stalled and recovered after the fix. A reviewer's email surfaced the problem before my monitoring did.

I added a test that every PHP file parses, and a deploy step that stops before database changes if syntax is broken. I also started holding merges for a second review. Those are real safeguards. Asking a tool to be more careful is not.

I had removed CI because it slowed my releases. The full test suite then collected twenty-three stale or leaking tests before I cleaned it on 25 September. Next time I would keep a small syntax-and-smoke check from day one.

The product has about 1,300 test definitions. That number describes coverage, not the absence of bugs. The useful question is which failure paths are checked, and what happens when a check misses.

## Keep the next improvement grounded

My next priorities: keep the raw data behind each measurement, keep incident evidence past short log windows, and close the cost-accounting gaps.

RavenClip is an early product with three paying customers as of 26 September 2026. Running it shows me which abstractions help and which assumptions need another look.

---
layout: ../layouts/Prose.astro
title: How I work with AI agents
description: Agents write most of my code. Here is the setup that makes their output something I can sign my name under.
---

I have written software for 14 years. Today, most of my code is typed by AI agents, mainly **Claude Code** and sometimes **Codex**. That changed where my time goes, not what I am responsible for. A bug in agent-written code is my bug.

So the work moved upstream and downstream of the typing: deciding what to build and how, writing it down precisely enough that an agent cannot misread it, and reviewing what comes back until I would defend every line.

## The loop

**Specify.** Before any code, I write what must be true and what must never happen: the business rules, the edge cases, the files involved. A vague prompt gets vague code. A precise spec gets code I can review quickly.

**Delegate.** The agent implements in small steps inside the project's rules. Small steps keep each diff reviewable; a 2,000-line change is not reviewable, whoever wrote it.

**Review.** I read every diff. I look for three things: is it correct, does it duplicate something that already exists, and is it more complicated than the problem needs. DRY and KISS are review criteria, not slogans. Agents are good at producing plausible code and bad at noticing that a helper for this already exists two folders away.

**Verify.** Tests, static analysis and browser checks run against the real app. Then people test it: on StoragePal I direct two testers who verify every feature before release.

**Measure.** Releases are small, and afterwards I check production data to see whether the change did what it was meant to.

## The setup

Good prompts need a good setup. The same instructions repeated in every chat drift; rules written once in the repository do not.

- **Project rules.** Each repository has a rule file the agent loads every session: the stack, how to run things, the architecture, and the rules it must never break. For example, on the StoragePal platform: which invoice amounts may be summed together, and which permissions file every new endpoint must be registered in.
- **Hooks.** Scripts that run around the agent's actions. One blocks destructive commands (broad deletes, `DROP` and `TRUNCATE`, force-pushes to main, hard resets, production deploys). It matches text patterns, so it is a safety net, not security. Others lint or format every PHP file the agent edits the moment it is saved.
- **Browser tests the agent runs.** On the SPS warehouse app, 65 scenarios (move-in, move-out, inventory; happy paths and failures) that Claude Code runs in a real Chrome through the Chrome DevTools MCP server. It does not stop at the first failure: it records every problem in network requests, the console, the UI, the database and the logs, then writes a report.
- **Memory.** Notes the agent keeps between sessions: framework traps we hit once and should not hit twice, how an external API really behaves (checked live, not assumed), incident write-ups.
- **MCP servers.** Chrome DevTools for browser control, Context7 for current library documentation, Laravel Boost for application context, and Google Ads and Analytics for marketing data.
- **Skills.** Reusable instruction packs. I wrote one for analysing an ad account through Google's official MCP server, and use others for design review.

## What I do not delegate

- **Architecture.** On RavenClip, choosing a database-driven state machine over a chain of queued jobs, or one shared failover loop instead of six, were my calls. Agents implement decisions well; they do not make good ones unprompted.
- **Money and data.** Billing rules, payment retries, migrations on production data and anything that deletes are specified by me line by line and reviewed twice.
- **Incidents.** When 99% of orders in the warehouse app suddenly showed as cancelled, the agent helped me read logs faster, but finding four bugs compounding each other took understanding the system. [The full story is in the SPS case study.](/work/sps/)

## Why this matters for a team

The value of an engineer is shifting from producing code to judging it. I bring 14 years of judgment to a workflow where the code is cheap, and a setup that makes AI output consistent, reviewable and safe to ship.

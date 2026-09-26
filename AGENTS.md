## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Ask chat (worker/)

The "ask about my work" chat is a Cloudflare Worker in `worker/` (deployed separately from the site) plus `src/components/Ask.astro`. Its knowledge comes from the build-time endpoint `src/pages/ask/knowledge.txt.ts`, assembled by `src/lib/knowledge.ts` from the public data sources only — never from the gitignored evidence audits, which contain revenue.

- Local dev: `cd worker && npm run dev` (needs `worker/.dev.vars`, see `.dev.vars.example`); the widget calls `localhost:8787` automatically in dev.
- Deploy: `npx wrangler secret put GEMINI_API_KEY` once, then `npm run deploy` in `worker/`. Deploy the site first when the knowledge format changes.
- The system prompt (`worker/src/prompt.ts`) enforces the public-copy rules: SPS is "built end to end" (never "alone/solo/sole"), metrics keep their measurement periods, no revenue figures.
- After changing the prompt or `GEMINI_MODEL` (pinned; keep `thinkingConfig` in mind — thinking tokens count against `maxOutputTokens`), run the guardrail suite: `npm run eval` in `worker/` with both dev servers up.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

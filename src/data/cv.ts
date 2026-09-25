// Single source of truth for every CV variant and the portfolio.
// Write a fact once, tag it, and let each role profile (roles.ts) pick and order it.
// Inline **bold** is supported in bullet text.

export type Tag = 'lead' | 'ai' | 'founder' | 'freelance' | 'laravel' | 'frontend' | 'perf';

export interface Bullet {
  text: string;
  tags: Tag[];
  /** Tie-breaker between bullets with the same tag score. Higher = earlier. */
  weight?: number;
}

export interface Entry {
  id: string;
  title: string;
  org: string;
  url?: string;
  location: string;
  period: string;
  intro?: string;
  stack?: string;
  bullets: Bullet[];
}

export const profile = {
  name: 'Khalil Hebachi',
  location: 'Annaba, Algeria (GMT+1), remote',
  email: 'hebachikhalil@gmail.com',
  site: 'https://0xkalel.github.io',
  linkedin: 'https://www.linkedin.com/in/hebachi-khalil/',
  github: 'https://github.com/0xKalel',
  languages: 'English, French, Arabic',
};

export const experience: Entry[] = [
  {
    id: 'storagepal',
    title: 'Lead Developer',
    org: 'StoragePal',
    url: 'https://storagepal.fr',
    location: 'Paris, remote',
    period: 'Oct 2024 - present',
    intro:
      'Paris storage company where customers book collection, storage and return of their belongings online. I lead the platform that runs the whole business: pricing, bookings, warehouse stock, billing and payments.',
    stack: 'PHP (Neos Flow, Laravel), React, MariaDB, Redis, Stripe, Google Maps, GA4, Gemini, Docker, CI/CD',
    bullets: [
      {
        text: 'Set the technical roadmap and led **2 developers and 2 testers** across the booking platform, the warehouse app and the marketing site. Over this period orders grew **69% year over year** while ad spend per order fell **22%**.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 10,
      },
      {
        text: 'Built **SPS end to end**, the warehouse app staff use on their phones every working day (Laravel 13, React 19, Redis queues, PWA): **15,000+ barcode scans** and **8,800+ item moves** since April 2026, in use **120 of 120 weekdays**.',
        tags: ['lead', 'laravel', 'founder', 'frontend'],
        weight: 9,
      },
      {
        text: 'Built a transport pricing engine (real driving distance, vehicle and mover optimisation): quotes **32% cheaper**, truck bookings **up 24 to 40%**, transport revenue **up 34%**.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 8,
      },
      {
        text: 'Set up an AI-assisted development workflow: project rules and hooks for Claude Code, plus **65 browser test scenarios the agent runs** through Chrome DevTools MCP, reporting UI, network, database and log errors. Backed by **659 PHPUnit tests** and static analysis.',
        tags: ['ai', 'lead'],
        weight: 8,
      },
      {
        text: 'Shipped a **Gemini assistant** that turns a description or photos of belongings into a priced cart, checked against the real catalogue: **42%** of conversations end in a confirmed cart.',
        tags: ['ai', 'founder', 'frontend'],
        weight: 7,
      },
      {
        text: 'Designed the REST API between the booking platform and the warehouse app: orders, returns, order changes with Stripe repricing, retry handling designed to prevent duplicate charges. **835 orders** and **8,600+ status changes** processed.',
        tags: ['lead', 'laravel'],
        weight: 7,
      },
      {
        text: 'Found a billing fault that collected unpaid months twice, fixed it, and rebuilt payment retries and reminders; **77 failed payments recovered** in the first seven weeks.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 6,
      },
      {
        text: 'Traced a sync incident that marked **99% of orders cancelled** to four compounding bugs; fixed it with retries, safe deletion detection and a nightly reconciliation, covered by regression tests.',
        tags: ['lead', 'laravel'],
        weight: 5,
      },
      {
        text: 'Made the catalogue **10x faster**, measured against the code I inherited (warm load **9.1 s to 0.9 s**, page weight 3.1 MB to 376 KB), and reduced checkout from **7 steps to 3** (**700+ orders**).',
        tags: ['perf', 'frontend', 'freelance', 'lead'],
        weight: 5,
      },
      {
        text: 'Raised the share of orders visible in GA4 from **58% to 84%** (server-side tracking, Consent Mode v2, ad-click tracking through checkout), giving the team more complete data for advertising decisions.',
        tags: ['founder', 'freelance'],
        weight: 4,
      },
      {
        text: 'Led improvements to lead capture and HubSpot CRM sync: captured leads went from **31 to 270+ a month**.',
        tags: ['lead', 'founder'],
        weight: 3,
      },
    ],
  },
  {
    id: 'atlas',
    title: 'Senior Full-Stack Developer',
    org: 'Atlas Web Solutions',
    location: 'Morocco, remote',
    period: 'Jul 2023 - Aug 2024',
    bullets: [
      {
        text: 'Built and launched **5+ AI SaaS products**, including Autoreels.ai (Laravel, Inertia, Vue and React), serving **600+ daily active users**.',
        tags: ['ai', 'founder', 'freelance', 'laravel'],
        weight: 10,
      },
      {
        text: 'Built an FFmpeg video pipeline running **20+ concurrent jobs**, with generation time **under one minute**.',
        tags: ['ai', 'perf', 'laravel'],
        weight: 8,
      },
      {
        text: 'Integrated **8+ AI and media APIs** (OpenAI, ElevenLabs, AssemblyAI, Replicate, Stability) through queued Laravel jobs, with direct publishing to TikTok, YouTube and Instagram.',
        tags: ['ai', 'laravel'],
        weight: 7,
      },
      {
        text: 'Integrated Stripe, Lemon Squeezy and PayPal subscriptions with credit and quota systems.',
        tags: ['founder', 'freelance'],
        weight: 4,
      },
    ],
  },
  {
    id: 'singularity',
    title: 'Senior Full-Stack Developer',
    org: 'Singularity Creations',
    location: 'Estonia, remote',
    period: 'Dec 2022 - May 2023',
    bullets: [
      {
        text: 'Improved application performance **60%** through MySQL query optimisation and indexing.',
        tags: ['perf', 'lead', 'freelance', 'laravel'],
        weight: 8,
      },
      {
        text: 'Delivered **10 production features**, including dynamic PDF generation, and modernised a legacy codebase.',
        tags: ['freelance', 'laravel'],
        weight: 5,
      },
    ],
  },
  {
    id: 'aviadmin',
    title: 'Full-Stack Developer (contract)',
    org: 'Aviadmin',
    location: 'Denmark, remote',
    period: 'Jul 2020 - Jun 2022',
    bullets: [
      {
        text: 'Cut calendar load time from **34 s to 0.3 s**.',
        tags: ['perf', 'lead', 'freelance', 'frontend'],
        weight: 10,
      },
      {
        text: 'Migrated a PHP 5.4 codebase to PHP 7 and rebuilt the frontend in Vue with reusable components.',
        tags: ['freelance', 'frontend', 'lead'],
        weight: 6,
      },
      {
        text: 'Built document expiry controls and a learning content management system.',
        tags: ['freelance'],
        weight: 3,
      },
    ],
  },
  {
    id: 'blackyellow',
    title: 'Full-Stack Developer',
    org: 'Black and Yellow',
    location: 'United Kingdom, remote',
    period: 'Jan 2018 - Jun 2020',
    bullets: [
      {
        text: 'Shipped a ticketing system used by **major UK retailers**.',
        tags: ['freelance', 'founder', 'lead'],
        weight: 8,
      },
      {
        text: 'Built lightweight in-house PHP and JavaScript frameworks for secure enterprise apps.',
        tags: ['lead'],
        weight: 6,
      },
      {
        text: 'Introduced Docker and CI/CD pipelines across environments.',
        tags: ['lead', 'freelance'],
        weight: 5,
      },
    ],
  },
  {
    id: 'mawaki3',
    title: 'Founder and Technical Director',
    org: 'Mawaki3 Development Agency',
    location: 'Algeria',
    period: 'Jun 2012 - Jan 2018',
    bullets: [
      {
        text: 'Grew the agency from **2 to 7 developers** and delivered **100+ projects** for clients around the world, via freelancer.com and direct.',
        tags: ['founder', 'lead', 'freelance'],
        weight: 10,
      },
      {
        text: 'Set coding standards and QA processes, and mentored junior developers.',
        tags: ['lead'],
        weight: 5,
      },
    ],
  },
];

export const projects: Entry[] = [
  {
    id: 'ravenclip',
    title: 'Founder',
    org: 'RavenClip',
    url: 'https://ravenclip.com',
    location: 'Own product',
    period: 'May 2026 - present',
    intro:
      'AI video product for agencies, consultancies and coaches. It selects stories from news feeds, creates narrated videos and publishes to TikTok and YouTube. Instagram publishing is integrated and awaiting approval.',
    stack: 'PHP 8.5, Laravel 13 (laravel/ai), React 19, TypeScript, Redis, MariaDB, FFmpeg, Node (Skia), Gemini, ElevenLabs, AssemblyAI',
    bullets: [
      {
        text: 'Designed, built and launched it end to end: **paying customers within 4 months** of the first commit (~1,450 commits), across marketing, AI consulting and coaching.',
        tags: ['founder', 'freelance', 'ai', 'lead'],
        weight: 10,
      },
      {
        text: 'Modelled the pipeline as a **resumable state machine** in the database, orchestrating **28 AI agents** with key pools and **failover across 10+ providers**, so processing can recover when a provider fails.',
        tags: ['ai', 'lead', 'founder'],
        weight: 9,
      },
      {
        text: 'Logged every AI call with its cost per video, and checked on-screen facts against **live data sources** (sports, gaming and crypto APIs) to reduce unsupported claims in videos.',
        tags: ['ai', 'founder'],
        weight: 8,
      },
      {
        text: 'Built the video engine itself: a ~10k-line Node/Skia overlay renderer plus segment-parallel FFmpeg compositing, with **~1,300 automated tests** across the product.',
        tags: ['ai', 'perf'],
        weight: 5,
      },
      {
        text: 'Built the supporting product features: 2FA and passkeys, subscriptions, multi-platform publishing, blog and SEO, analytics.',
        tags: ['founder', 'freelance', 'frontend'],
        weight: 6,
      },
    ],
  },
];

export interface SkillGroup {
  id: 'ai' | 'backend' | 'frontend' | 'infra' | 'practice';
  label: string;
  items: string;
}

export const skills: SkillGroup[] = [
  {
    id: 'ai',
    label: 'AI engineering',
    items:
      'Claude Code, Codex, MCP servers, agent rules, skills and hooks, spec-driven development, LLM pipelines (Gemini, OpenRouter, OpenAI), TTS and STT, provider failover, cost tracking',
  },
  {
    id: 'backend',
    label: 'Backend',
    items: 'PHP 8, Laravel 8 to 13, Neos Flow, Symfony, Node.js, REST APIs, queues (Horizon), Stripe',
  },
  {
    id: 'frontend',
    label: 'Frontend',
    items: 'React 19, TypeScript, Inertia, Vue, Next.js, Astro, Tailwind, PWA',
  },
  {
    id: 'infra',
    label: 'Infrastructure',
    items: 'MySQL and MariaDB, Redis, PostgreSQL, Docker, CI/CD, AWS, Linux, Nginx, FFmpeg, GA4 and GTM',
  },
  {
    id: 'practice',
    label: 'Engineering',
    items: 'Architecture, code review, performance tuning, PHPUnit and Pest, static analysis, technical leadership',
  },
];

export const education = {
  degree: 'MSc in Computer Science',
  school: 'Badji Mokhtar University, Annaba',
  year: '2012',
  focus: 'Software engineering, distributed systems',
};

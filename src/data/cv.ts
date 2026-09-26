import { evidence } from './evidence';

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
      'Booking, warehouse and payment software for a Paris storage company.',
    stack: 'PHP (Neos Flow, Laravel), React, MariaDB, Redis, Stripe, Google Maps, GA4, Gemini, Docker, CI/CD',
    bullets: [
      {
        text: 'Lead development for a working storage business: set priorities, plan releases, review work, and build pricing, payments, and customer workflows.',
        tags: ['lead', 'founder', 'freelance'], weight: 10,
      },
      {
        text: `Built the **SPS warehouse app** (Laravel/React) end to end: **${evidence.sps.sessions} completed sessions**, with use on **all 120 weekdays** from 13 April to 25 September 2026.`,
        tags: ['lead', 'laravel', 'founder', 'frontend'], weight: 9,
      },
      {
        text: `Moved filtering and pagination into the database, batched exports, and consolidated **${evidence.storagepal.pages} backoffice pages** around shared list definitions.`,
        tags: ['lead', 'perf', 'freelance', 'laravel'], weight: 8,
      },
      {
        text: 'Built distance-based transport pricing with logistics input. Transport revenue was **34% higher** in the following twelve months; volume and customer mix also changed.',
        tags: ['founder', 'freelance'], weight: 7,
      },
      {
        text: 'Built a **Gemini shopping assistant** with catalog validation, quantity limits, server-owned pricing, and an editable customer proposal.',
        tags: ['ai', 'founder', 'frontend'], weight: 8,
      },
      {
        text: 'Made repeated warehouse completion requests return the original result after a lost response; added regression coverage for the incident.',
        tags: ['laravel', 'lead'], weight: 7,
      },
      {
        text: 'Rebuilt payment attempts around the current invoice, existing payment-intent checks, bounded reminders, and a review queue for blocked payments.',
        tags: ['lead', 'founder', 'freelance'], weight: 6,
      },
      {
        text: `Cached shared catalog data separately from personal carts. Median server response **${evidence.storagepal.responseBefore} → ${evidence.storagepal.responseAfter}** on a local benchmark (15 runs per version, same database).`,
        tags: ['perf', 'frontend', 'freelance'], weight: 7,
      },
      {
        text: 'Simplified payment from **three pages to one** and added validation around customer-facing AI proposals.',
        tags: ['frontend', 'ai'], weight: 5,
      },
      {
        text: 'Combined agent-assisted implementation with backend regression tests, static analysis, and documented browser/API verification scenarios.',
        tags: ['ai', 'lead'], weight: 6,
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
        text: 'Launched **5+ AI products**, including Autoreels.ai, serving **600+ daily active users**.',
        tags: ['ai', 'founder', 'freelance', 'laravel'],
        weight: 10,
      },
      {
        text: 'Built an FFmpeg video pipeline running **20+ concurrent jobs**, with generation time **under one minute**.',
        tags: ['ai', 'perf', 'laravel'],
        weight: 8,
      },
      {
        text: 'Integrated **8+ AI and media APIs** with Laravel queues and social publishing.',
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
        text: 'Improved application performance **60%** through MySQL query optimization and indexing.',
        tags: ['perf', 'lead', 'freelance', 'laravel'],
        weight: 8,
      },
      {
        text: 'Delivered **10 production features**, including dynamic PDF generation, and modernized a legacy codebase.',
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
        text: 'Grew the agency from **2 to 7 developers** and delivered **300 projects** for clients around the world via freelancer.com, plus direct client work.',
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
      'Turns news into narrated videos and publishes to TikTok and YouTube.',
    stack: 'Laravel, React, TypeScript, Redis, MariaDB, FFmpeg, Node/Skia, Gemini, speech and media APIs',
    bullets: [
      {
        text: `Built and launched the product. First external paying customer in **${evidence.ravenclip.daysToCustomer} days**; **${evidence.ravenclip.customers} paying customers** as of 26 September 2026.`,
        tags: ['founder', 'freelance', 'ai', 'lead'],
        weight: 10,
      },
      {
        text: 'Built a **resumable video pipeline** with persisted stages, claim locks, parallel voice and visual work, and provider fallbacks.',
        tags: ['ai', 'lead', 'founder'],
        weight: 9,
      },
      {
        text: 'Added structural output checks, source-backed numerical overlays, and per-video API cost records to investigate quality failures and provider costs.',
        tags: ['ai', 'founder'],
        weight: 8,
      },
      {
        text: 'Built a Node/Skia and FFmpeg renderer, with regression coverage for rendering, generation, and publishing workflows.',
        tags: ['ai', 'perf'],
        weight: 5,
      },
      {
        text: 'Built subscriptions, passkeys, social publishing and analytics.',
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
      'LLM workflows, output validation, resumable pipelines, provider fallbacks, cost tracking, TTS and STT, Claude Code and Codex',
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
    items: 'Product scoping, prioritization, architecture, caching, code review, PHPUnit and Pest, static analysis, technical leadership',
  },
];

export const education = {
  degree: 'MSc in Computer Science',
  school: 'Badji Mokhtar University, Annaba',
  year: '2012',
  focus: 'Software engineering, distributed systems',
};

import { evidence } from './evidence';

// Single source of truth for every CV variant and the portfolio.
// Write a fact once, tag it, and let each role profile (roles.ts) pick and order it.
// Inline **bold** is supported in bullet text.

export type Tag = 'lead' | 'ai' | 'founder' | 'freelance' | 'laravel' | 'frontend' | 'perf';

export interface Bullet {
  text: string;
  tags: Tag[];
  /** How strong the bullet is. Breaks ties when picking, and orders the picked bullets. Higher = earlier. */
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
  location: 'Annaba, Algeria (GMT+1)',
  workMode: 'Remote, or open to relocation to Europe, Canada, or the US',
  email: 'hebachikhalil@gmail.com',
  site: 'https://0xkalel.github.io',
  linkedin: 'https://www.linkedin.com/in/hebachi-khalil/',
  github: 'https://github.com/0xKalel',
  languages: 'Arabic (native), French (C2), English (C1)',
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
      'Booking, warehouse, and payment software for a Paris storage company.',
    stack: 'PHP (Neos Flow, Laravel), React, MariaDB, Redis, Stripe, Google Maps, GA4, Gemini, Docker, CI/CD',
    bullets: [
      {
        text: 'Own **end-to-end product development**: shape ideas and the roadmap, design the architecture, write and test code, deploy releases, and support production.',
        tags: ['lead', 'founder', 'freelance', 'laravel'], weight: 10,
      },
      {
        // The releases and the orders share a timeline; the bullet claims the timing, not the cause.
        text: `Shipped new transport pricing, a faster catalog, a one-page checkout, and an AI cart assistant (Sep 2025 - Jul 2026). Orders from Oct 2025 to Sep 2026 were **${evidence.storagepal.ordersUp} higher** than the year before I joined. Without luggage-only bookings, they were **${evidence.storagepal.ordersUpNonLuggage} higher**.`,
        tags: ['lead', 'founder', 'freelance'], weight: 9.5,
      },
      {
        text: `Built the **SPS warehouse app** (Laravel/React) end to end: **${evidence.sps.sessions} completed sessions**, with use on **all 120 weekdays** from April 13 to September 25, 2026.`,
        tags: ['lead', 'laravel', 'founder', 'frontend'], weight: 9,
      },
      {
        text: `Cut median catalog server response from **${evidence.storagepal.responseBefore} to ${evidence.storagepal.responseAfter}** by caching shared catalog data separately from customer carts (local benchmark, 15 runs per version, same database).`,
        tags: ['perf', 'lead', 'frontend', 'freelance'], weight: 8,
      },
      {
        text: `Moved filtering and pagination to the database, exported data in batches, and combined **${evidence.storagepal.pages} admin pages** into one shared list system.`,
        tags: ['lead', 'perf', 'freelance', 'laravel'], weight: 7,
      },
      {
        text: 'Reduced checkout from **three pages to one**. Made retries safe, prevented duplicate payment attempts, and added a review queue for blocked payments.',
        tags: ['frontend', 'lead', 'founder', 'freelance'], weight: 6,
      },
      {
        text: 'Built a **Gemini shopping assistant** that suggests an editable cart. The server checks items, limits quantities, and sets prices.',
        tags: ['ai', 'founder', 'frontend'], weight: 5,
      },
      {
        text: 'Replaced flat regional transport prices with rules for distance, vehicle, crew, and building access. Designed the rules with customer support and logistics.',
        tags: ['founder', 'freelance'], weight: 4,
      },
      {
        text: 'Checked AI-assisted code with backend regression tests, static analysis, and documented browser and API tests.',
        tags: ['ai', 'lead'], weight: 3,
      },
      {
        text: 'Made warehouse retries return the saved result after a lost response. Added regression tests for this behavior.',
        tags: ['laravel'], weight: 2,
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
        text: 'Integrated Stripe, Lemon Squeezy, and PayPal subscriptions with credit and quota systems.',
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
        text: 'Improved application performance by **60%** with faster MySQL queries and indexes.',
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
        text: 'Built document expiration controls and a learning content management system.',
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
        text: 'Grew the agency from **2 to 7 developers** and delivered **300 projects** for clients around the world through freelancer.com, plus direct client work.',
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
      'Turns news into narrated videos for TikTok and YouTube. I build and run it alongside full-time work.',
    stack: 'Laravel, React, TypeScript, Redis, MariaDB, FFmpeg, Node/Skia, Gemini, speech and media APIs',
    bullets: [
      {
        text: `Built and launched the product. First external paying customer in **${evidence.ravenclip.daysToCustomer} days**; **${evidence.ravenclip.customers} paying customers** as of September 26, 2026.`,
        tags: ['founder', 'freelance', 'ai', 'lead'],
        weight: 10,
      },
      {
        text: 'Built a **video pipeline that resumes after failures**, with saved stages, locks to prevent duplicate work, parallel voice and visuals, and backup providers.',
        tags: ['ai', 'lead', 'founder'],
        weight: 9,
      },
      {
        text: 'Added checks for AI output structure, on-screen numbers from data sources, and API cost tracking for each video.',
        tags: ['ai', 'founder'],
        weight: 8,
      },
      {
        text: 'Built a Node/Skia and FFmpeg renderer, with regression tests for rendering, generation, and publishing.',
        tags: ['ai', 'perf'],
        weight: 5,
      },
      {
        text: 'Built subscriptions, passkeys, social publishing, and analytics.',
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
      'LLM workflows, output checks, failure recovery, backup providers, cost tracking, text-to-speech, speech-to-text, Claude Code, Codex',
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

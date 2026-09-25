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
        text: 'Led **2 developers and 2 testers**. During this period, orders grew **69% year over year** and ad spend per order fell **22%**.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 10,
      },
      {
        text: 'Built the **SPS warehouse app** with Laravel and React: **15,000+ scans** and **8,800+ item moves** since April 2026.',
        tags: ['lead', 'laravel', 'founder', 'frontend'],
        weight: 9,
      },
      {
        text: 'Built a distance-based pricing engine. Transport revenue rose **34%** after launch.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 8,
      },
      {
        text: 'Set up AI-assisted development with **65 browser checks**, **659 PHPUnit tests** and static analysis.',
        tags: ['ai', 'lead'],
        weight: 8,
      },
      {
        text: 'Built a **Gemini shopping assistant** from text and photos. **42%** of conversations end in a confirmed cart.',
        tags: ['ai', 'founder', 'frontend'],
        weight: 7,
      },
      {
        text: 'Designed the booking-to-warehouse API: **835 orders** and **8,600+ status changes** processed, with duplicate-charge protection.',
        tags: ['lead', 'laravel'],
        weight: 7,
      },
      {
        text: 'Fixed duplicate billing and rebuilt payment recovery: **77 failed payments recovered** in seven weeks.',
        tags: ['lead', 'founder', 'freelance'],
        weight: 6,
      },
      {
        text: 'Fixed four sync bugs that incorrectly marked **99% of orders cancelled**. Added recovery checks and regression tests.',
        tags: ['lead', 'laravel'],
        weight: 5,
      },
      {
        text: 'Cut catalogue load time from **9.1 s to 0.9 s** and checkout from **7 steps to 3**.',
        tags: ['perf', 'frontend', 'freelance', 'lead'],
        weight: 5,
      },
      {
        text: 'Improved order tracking in GA4 from **58% to 84%** with server-side tracking and consent handling.',
        tags: ['founder', 'freelance'],
        weight: 4,
      },
      {
        text: 'Led lead-capture and CRM improvements: **31 to 270+ leads a month**.',
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
      'Turns news into narrated videos and publishes to TikTok and YouTube.',
    stack: 'PHP 8.5, Laravel 13 (laravel/ai), React 19, TypeScript, Redis, MariaDB, FFmpeg, Node (Skia), Gemini, ElevenLabs, AssemblyAI',
    bullets: [
      {
        text: 'Built and launched the product. Reached **paying customers within 4 months**.',
        tags: ['founder', 'freelance', 'ai', 'lead'],
        weight: 10,
      },
      {
        text: 'Built a resumable pipeline with **28 AI agents** and fallback handling across **10+ providers**.',
        tags: ['ai', 'lead', 'founder'],
        weight: 9,
      },
      {
        text: 'Tracked AI costs per video and checked on-screen facts against **live data sources**.',
        tags: ['ai', 'founder'],
        weight: 8,
      },
      {
        text: 'Built a Node/Skia and FFmpeg video renderer. Added **~1,300 tests** across the product.',
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

import { evidence } from './evidence';

// Single source of truth for every CV variant and the portfolio.
// Write a fact once, tag it, and let each role profile (roles.ts) pick and order it.
// Inline **bold** is supported in bullet text.

// 'customer': work done with the people who use the software (customers, customer care, ops).
export type Tag = 'lead' | 'ai' | 'founder' | 'freelance' | 'laravel' | 'frontend' | 'perf' | 'customer';

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
      'Storage company with collection and delivery by partner vans.',
    stack: 'PHP (Neos Flow, Laravel), React, MariaDB, Redis, Stripe, AWS, Cloudflare, Google Maps, GA4, Gemini, Docker, CI/CD',
    // Seven broad bullets of similar weight, each joining related work, so none repeats another; roles.ts picks five.
    bullets: [
      {
        text: "Own all of StoragePal's software (booking website, staff admin tool, warehouse app), from planning to production support.",
        tags: ['lead', 'founder', 'freelance', 'laravel'], weight: 10,
      },
      {
        // Forward-deployed CV only. Timing, not cause: see evidence.storagepal.arrivalCallsDown.
        text: `Work with customers, customer care, the operations team, and the CEO every day. After I rewrote our emails in August 2026, calls asking how to find the warehouse fell **${evidence.storagepal.arrivalCallsDown}** the next month.`,
        tags: ['customer'], weight: 9.8,
      },
      {
        // The releases and the orders share a timeline; the bullet claims the timing, not the cause.
        text: `Launched new collection pricing, a one-page checkout, and an AI shopping assistant (Sep 2025 - Jul 2026). Orders were **${evidence.storagepal.ordersUp} higher** from Oct 2025 to Sep 2026 than the year before I joined (${evidence.storagepal.ordersUpNonLuggage} excluding luggage storage).`,
        tags: ['lead', 'founder', 'freelance'], weight: 9.5,
      },
      {
        // November 2026. Wording rules: section 7 of the platform upgrade brief (kept outside this repo)
        // ("no maintenance window", never "zero downtime"; no order counts, no euros).
        text: 'Upgraded the platform from **PHP 7.2 to 8.5** and moved it to new AWS servers in November 2026, with **no maintenance window** and no lost orders. I used AI coding agents and reviewed every change.',
        tags: ['lead', 'laravel', 'perf', 'ai', 'founder', 'freelance'], weight: 9.3,
      },
      {
        text: 'Built the **warehouse app** end to end (Laravel, React) for checking in, finding, and returning boxes and furniture. Staff used it on **all 120 weekdays** from April 13 to September 25, 2026.',
        tags: ['lead', 'laravel', 'founder', 'frontend', 'freelance'], weight: 9,
      },
      {
        text: `Cut the catalog's median server response from **${evidence.storagepal.responseBefore} to ${evidence.storagepal.responseAfter}** (local benchmark). An invoice export that never finished now runs in **${evidence.storagepal.upgrade.invoiceExport}**.`,
        tags: ['perf', 'lead', 'freelance', 'laravel'], weight: 8,
      },
      {
        text: 'Kept the **AI shopping assistant** inside business rules: the server checks its suggested cart and sets the prices.',
        tags: ['ai', 'founder', 'frontend'], weight: 5,
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
        text: 'Integrated **8+ AI and media APIs** through Laravel queues, plus social publishing.',
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
        text: 'Improved application performance by **60%** through MySQL query and index tuning.',
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
    title: 'Co-founder and Technical Director',
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
        text: `Reached the first external paying customer **${evidence.ravenclip.daysToCustomer} days** after the first commit; **${evidence.ravenclip.customers} paying customers** as of September 26, 2026.`,
        tags: ['founder', 'freelance', 'ai', 'lead'],
        weight: 10,
      },
      {
        text: 'Built a **video pipeline that resumes after failures**, with saved stages, locks to prevent duplicate work, parallel voice and visuals, and backup providers.',
        tags: ['ai', 'lead', 'founder'],
        weight: 9,
      },
      {
        text: 'Added checks on AI output structure, pulled on-screen numbers from data sources, and tracked API cost per video.',
        tags: ['ai', 'founder'],
        weight: 8,
      },
      {
        text: 'Built a Node/Skia and FFmpeg renderer, with regression tests for rendering, generation, and publishing.',
        tags: ['ai', 'perf'],
        weight: 5,
      },
      {
        text: 'Added subscriptions, passkeys, social publishing, and analytics.',
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
    items: 'MySQL and MariaDB, Redis, PostgreSQL, Docker, CI/CD (Bitbucket Pipelines), AWS (EC2, RDS, S3, CloudFront), Cloudflare, Linux, Nginx, FFmpeg, GA4 and GTM',
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

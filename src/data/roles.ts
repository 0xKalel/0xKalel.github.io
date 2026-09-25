import type { SkillGroup, Tag } from './cv';

export type Section = 'experience' | 'projects' | 'skills' | 'education';

export interface RoleLink {
  label: string;
  href: string;
}

export interface Role {
  slug: string;
  /** Short name for the CV switcher. */
  label: string;
  headline: string;
  summary: string;
  /** Tags in priority order: earlier tags weigh more when ranking bullets. */
  focus: Tag[];
  /** Bullets kept per experience entry, by position (last value repeats). */
  bullets: number[];
  /** Bullets kept per project. */
  projectBullets: number;
  sections: Section[];
  skills: SkillGroup['id'][];
  /** Portfolio pages linked from this CV, in addition to the contact links. */
  links: RoleLink[];
}

export const roles: Role[] = [
  {
    slug: 'lead-fullstack',
    label: 'Lead full-stack',
    headline: 'Lead Full-Stack Engineer, Laravel and React',
    summary:
      'Lead full-stack engineer with 14 years shipping production web apps, remote for teams in France, the UK, Denmark and Estonia since 2018. At StoragePal I lead the platform that runs the business and built its warehouse app end to end. I work AI-native: agents write most of the code, I own the architecture, the review and the result.',
    focus: ['lead', 'laravel', 'perf', 'frontend'],
    bullets: [7, 3, 2, 2, 2, 2],
    projectBullets: 3,
    sections: ['experience', 'projects', 'skills', 'education'],
    skills: ['backend', 'frontend', 'infra', 'ai', 'practice'],
    links: [
      { label: 'Case study: SPS warehouse app', href: '/work/sps/' },
      { label: 'Case study: StoragePal platform', href: '/work/storagepal/' },
    ],
  },
  {
    slug: 'ai-engineer',
    label: 'AI engineer',
    headline: 'AI Product Engineer, LLM pipelines and agentic development',
    summary:
      'Full-stack engineer who builds AI products and builds with AI. I launched RavenClip, an autonomous news-to-video SaaS running 28 AI agents across 10+ providers, and shipped a Gemini shopping assistant in production. Day to day I direct Claude Code and Codex with specs, project rules and agent-run tests, and review every change for correctness and simplicity.',
    focus: ['ai', 'lead', 'founder', 'laravel'],
    bullets: [6, 3, 2, 1, 1, 1],
    projectBullets: 4,
    sections: ['projects', 'experience', 'skills', 'education'],
    skills: ['ai', 'backend', 'frontend', 'infra', 'practice'],
    links: [
      { label: 'RavenClip (live)', href: 'https://ravenclip.com' },
      { label: 'How I work with AI agents', href: '/how-i-work/' },
      { label: 'Case study: RavenClip', href: '/work/ravenclip/' },
    ],
  },
  {
    slug: 'founding-engineer',
    label: 'Founding engineer',
    headline: 'Founding Engineer, from zero to paying users',
    summary:
      'Engineer who takes products from zero to paying users. I founded and ran a development agency for six years, took RavenClip from first commit to launch, and lead the platform behind a growing storage business. Comfortable owning product, code, infrastructure and analytics, and moving fast with AI agents without losing control of the codebase.',
    focus: ['founder', 'ai', 'lead', 'freelance'],
    bullets: [6, 3, 2, 1, 1, 2],
    projectBullets: 5,
    sections: ['projects', 'experience', 'skills', 'education'],
    skills: ['backend', 'frontend', 'ai', 'infra', 'practice'],
    links: [
      { label: 'RavenClip (live)', href: 'https://ravenclip.com' },
      { label: 'Case study: RavenClip', href: '/work/ravenclip/' },
      { label: 'Case study: StoragePal platform', href: '/work/storagepal/' },
    ],
  },
  {
    slug: 'freelance',
    label: 'Freelance',
    headline: 'Senior Full-Stack Developer, Laravel and React, available for contracts',
    summary:
      'Senior full-stack developer with 14 years delivering for clients and teams in the US, France, the UK, Denmark and Estonia. I ship fast with an AI-assisted workflow and I measure the result: calendar loads from 34 s to 0.3 s, catalogue server time from 250 ms to 53 ms, a pricing engine that raised transport revenue 34%.',
    focus: ['freelance', 'perf', 'laravel', 'frontend'],
    bullets: [5, 3, 2, 2, 2, 1],
    projectBullets: 3,
    sections: ['experience', 'projects', 'skills', 'education'],
    skills: ['backend', 'frontend', 'infra', 'ai', 'practice'],
    links: [
      { label: 'Selected work', href: '/#work' },
      { label: 'How I work', href: '/how-i-work/' },
    ],
  },
];

export const defaultRole = roles[0];

export function getRole(slug: string): Role | undefined {
  return roles.find((r) => r.slug === slug);
}

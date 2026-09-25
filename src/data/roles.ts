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
      'Lead full-stack engineer with 14 years of experience building web applications for clients around the world since 2012. At StoragePal, I lead two developers and two testers on the booking platform and built the warehouse app from design to deployment. I combine hands-on development with technical planning, code review and an AI-assisted workflow.',
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
    headline: 'AI Product Engineer, Laravel and LLM applications',
    summary:
      'Full-stack engineer building AI products that people use in production. I founded RavenClip, which turns news into videos using 28 AI agents across 10+ providers, and built a Gemini shopping assistant for StoragePal. My work covers model integration, reliability, cost tracking and testing. I also use Claude Code and Codex in development and review each change.',
    focus: ['ai', 'lead', 'founder', 'laravel'],
    bullets: [6, 3, 2, 1, 1, 1],
    projectBullets: 4,
    sections: ['projects', 'experience', 'skills', 'education'],
    skills: ['ai', 'backend', 'frontend', 'infra', 'practice'],
    links: [
      { label: 'RavenClip (live)', href: 'https://ravenclip.com' },
      { label: 'How I work', href: '/how-i-work/' },
      { label: 'Case study: RavenClip', href: '/work/ravenclip/' },
    ],
  },
  {
    slug: 'founding-engineer',
    label: 'Founding engineer',
    headline: 'Founding Engineer, product development and launch',
    summary:
      'Engineer with experience taking products from an idea to paying customers. I founded and ran a development agency for six years, built and launched RavenClip, and lead development at StoragePal. I work across product decisions, application development, infrastructure and analytics, and stay involved after launch.',
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
      'Senior full-stack developer with 14 years of experience delivering projects for clients around the world, including full-time roles in the UK, Denmark and Estonia. I build Laravel and React applications, modernise older systems and improve performance. Results include reducing a calendar load from 34 s to 0.3 s and making a catalogue 10x faster (9.1 s to 0.9 s, measured).',
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

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
      'Lead full-stack engineer building software since 2012. At StoragePal, I handle the platform day to day, from deciding what to build to fixing production, and I built the SPS warehouse app for its staff. I get up to speed quickly on unfamiliar code, whether legacy, new, or written with AI.',
    focus: ['lead', 'laravel', 'perf', 'frontend'],
    bullets: [6, 3, 2, 3, 3, 2],
    projectBullets: 4,
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
      'I build AI products with Laravel and React, including RavenClip, which I started because I wanted an easier way to follow the news. My work covers user workflows, failure recovery, and output checks. I make product and architecture decisions and review code written with AI.',
    focus: ['ai', 'lead', 'founder', 'laravel'],
    bullets: [6, 3, 2, 3, 3, 2],
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
      'I build products that solve business problems. I co-founded a development agency, launched RavenClip, and own product development at StoragePal. I release improvements in small steps and learn from how people use them.',
    focus: ['founder', 'ai', 'lead', 'freelance'],
    bullets: [6, 3, 2, 3, 3, 2],
    projectBullets: 4,
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
    headline: 'Senior Full-Stack Developer, Laravel and React',
    summary:
      'I build Laravel and React apps, update older systems, and fix performance problems. I have worked with clients worldwide since 2012.',
    focus: ['freelance', 'perf', 'laravel', 'frontend'],
    bullets: [6, 3, 2, 3, 3, 2],
    projectBullets: 4,
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

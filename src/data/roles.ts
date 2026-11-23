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
      "I've built software since 2012. At StoragePal I took over a live platform and built the warehouse app its staff use every day.",
    focus: ['lead', 'laravel', 'perf', 'frontend'],
    bullets: [5, 3, 2, 3, 3, 2],
    projectBullets: 4,
    sections: ['experience', 'projects', 'skills', 'education'],
    skills: ['backend', 'frontend', 'infra', 'ai', 'practice'],
    links: [
      { label: 'Case study: warehouse app', href: '/work/sps/' },
      { label: 'Case study: StoragePal platform', href: '/work/storagepal/' },
    ],
  },
  {
    slug: 'ai-engineer',
    label: 'AI engineer',
    headline: 'AI Product Engineer, Laravel and LLM applications',
    summary:
      'I build AI products with Laravel and React, including RavenClip, which turns news into videos. I spend most of my time on the parts around the model: recovering from failures and checking its output.',
    focus: ['ai', 'lead', 'founder', 'laravel'],
    bullets: [5, 3, 2, 3, 3, 2],
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
      'I co-founded a development agency in 2012 and launched RavenClip in 2026. I ship small and decide what comes next from how people use it.',
    focus: ['founder', 'ai', 'lead', 'freelance'],
    bullets: [5, 3, 2, 3, 3, 2],
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
      "I build Laravel and React apps and modernize slow, old systems. I've worked with clients worldwide since 2012.",
    focus: ['freelance', 'perf', 'laravel', 'frontend'],
    bullets: [5, 3, 2, 3, 3, 2],
    projectBullets: 4,
    sections: ['experience', 'projects', 'skills', 'education'],
    skills: ['backend', 'frontend', 'infra', 'ai', 'practice'],
    links: [
      { label: 'Selected work', href: '/#work' },
      { label: 'How I work', href: '/how-i-work/' },
    ],
  },
  {
    slug: 'forward-deployed',
    label: 'Forward deployed',
    headline: 'Forward Deployed Engineer, PHP, TypeScript, SQL',
    summary:
      'Full-stack engineer who works next to the people using the software. At StoragePal, I start most changes by talking with one of them.',
    // Three focus tags: the customer bullet ties with ownership, orders, the upgrade and the warehouse app, and the weights order them.
    focus: ['customer', 'founder', 'lead'],
    bullets: [5, 3, 2, 3, 3, 2],
    projectBullets: 4,
    sections: ['experience', 'projects', 'skills', 'education'],
    skills: ['practice', 'backend', 'frontend', 'ai', 'infra'],
    links: [
      { label: 'Case study: StoragePal platform', href: '/work/storagepal/#work-from-what-people-ask-for' },
      { label: 'Case study: warehouse app', href: '/work/sps/' },
      { label: 'How I work', href: '/how-i-work/' },
    ],
  },
];

export const defaultRole = roles[0];

export function getRole(slug: string): Role | undefined {
  return roles.find((r) => r.slug === slug);
}

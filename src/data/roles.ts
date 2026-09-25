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
      'Full-stack engineer with 14 years of experience. I lead two developers and two testers at StoragePal, build web applications and improve performance.',
    focus: ['lead', 'laravel', 'perf', 'frontend'],
    bullets: [4, 2, 1, 2, 1, 1],
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
      'I build AI products with Laravel and React. Founded RavenClip and built a Gemini shopping assistant. Focus: reliable workflows, testing and cost tracking.',
    focus: ['ai', 'lead', 'founder', 'laravel'],
    bullets: [4, 2, 1, 2, 1, 1],
    projectBullets: 3,
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
      'I take products from idea to paying customers. Co-founded a development agency, launched RavenClip and lead development at StoragePal.',
    focus: ['founder', 'ai', 'lead', 'freelance'],
    bullets: [4, 2, 1, 2, 1, 1],
    projectBullets: 3,
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
      'I build Laravel and React apps, modernise older systems and fix performance problems. Fourteen years of experience working with clients worldwide.',
    focus: ['freelance', 'perf', 'laravel', 'frontend'],
    bullets: [4, 2, 1, 2, 1, 1],
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

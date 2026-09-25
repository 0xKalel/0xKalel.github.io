import { experience, projects, skills, type Bullet, type Entry } from '../data/cv';
import type { Role } from '../data/roles';

/** Earlier tags in the role's focus list weigh more. */
function score(bullet: Bullet, focus: Role['focus']): number {
  return bullet.tags.reduce((sum, tag) => {
    const i = focus.indexOf(tag);
    return i === -1 ? sum : sum + (focus.length - i);
  }, 0);
}

/** Keep the most relevant bullets for this role, most relevant first. Never returns an empty list. */
function pick(entry: Entry, role: Role, limit: number): Entry {
  const ranked = entry.bullets
    .map((b) => ({ b, s: score(b, role.focus) }))
    .sort((x, y) => y.s - x.s || (y.b.weight ?? 0) - (x.b.weight ?? 0));
  const relevant = ranked.filter((r) => r.s > 0);
  const kept = (relevant.length ? relevant : ranked).slice(0, Math.max(1, limit));
  return { ...entry, bullets: kept.map((r) => r.b) };
}

/** Internal portfolio links carry the role, so analytics show which CV sent the visit. */
export function trackedHref(href: string, role: Role): string {
  if (!href.startsWith('/')) return href;
  const [path, hash] = href.split('#');
  return `${path}?ref=cv-${role.slug}${hash ? `#${hash}` : ''}`;
}

export function buildCv(role: Role) {
  const limitAt = (i: number) => role.bullets[Math.min(i, role.bullets.length - 1)];
  return {
    experience: experience.map((e, i) => pick(e, role, limitAt(i))),
    projects: projects.map((p) => pick(p, role, role.projectBullets)),
    skills: role.skills.map((id) => skills.find((s) => s.id === id)!),
  };
}

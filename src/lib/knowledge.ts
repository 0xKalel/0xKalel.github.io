import { getCollection } from 'astro:content';
import { profile, experience, projects, skills, education } from '../data/cv';
import { evidence } from '../data/evidence';
import { roles } from '../data/roles';
import { linkedinReviews, freelanceReviews } from '../data/reviews';
import { postHref } from './blog';

// Builds the public knowledge document at /ask/knowledge.txt for the ask-chat worker.
// Only already-public site content belongs here, never the gitignored evidence audits.

const SITE = profile.site;

/** Drops the **bold** markers that CV bullets and MDX prose may carry. */
const plain = (text: string) => text.replace(/\*\*/g, '');

/** Resolves `{evidence.sps.sessions}`-style MDX expressions against the data. */
const resolveExpressions = (text: string) =>
  text.replace(/\{evidence\.(\w+)\.(\w+)\}/g, (match, project, key) => {
    const value = (evidence as Record<string, Record<string, unknown>>)[project]?.[key];
    if (typeof value !== 'string') throw new Error(`knowledge: cannot resolve ${match}`);
    return value;
  });

/** Turns [text](href) into "text (absolute url)"; mailto links keep just the text. */
const resolveLinks = (text: string) =>
  text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label: string, href: string) => {
    if (href.startsWith('mailto:')) return label;
    const url = href.startsWith('/') ? new URL(href, SITE).href : href;
    return `${label} (${url})`;
  });

/** Strips MDX imports and component JSX; plain HTML tags lose their markup but keep their prose.
 *  Code fences are masked first so generics, imports, and bold markers inside them survive verbatim.
 *  headingShift demotes the body's headings so they nest under this document's own hierarchy. */
function stripMdx(source: string, name: string, headingShift = 0): string {
  const fences: string[] = [];
  const text = source
    .replace(/^---[\s\S]*?\n---/, '')
    .replace(/```[\s\S]*?```/g, (fence) => `\u0000${fences.push(fence) - 1}\u0000`)
    .replace(/^import\s.*$/gm, '')
    .replace(/<([A-Z]\w*)[\s\S]*?<\/\1>/g, '')
    .replace(/<[A-Z][\s\S]*?\/>/g, '')
    .replace(/<\/?[a-z][^>]*>/g, ' ');
  if (/^import\s/m.test(text) || /<[A-Z]/.test(text)) {
    throw new Error(`knowledge: unstripped MDX remains in ${name}`);
  }
  const shifted = headingShift
    ? text.replace(/^#{2,5}(?=\s)/gm, (hashes) => '#'.repeat(Math.min(6, hashes.length + headingShift)))
    : text;
  return plain(resolveLinks(resolveExpressions(shifted)))
    .replace(/[^\S\n]+$/gm, '')
    .replace(/(\S)[^\S\n]{2,}/g, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\u0000(\d+)\u0000/g, (_, index: string) => fences[Number(index)])
    .trim();
}

const entryLines = (entries: typeof experience) =>
  entries
    .map((entry) => {
      const head = `### ${entry.title}, ${entry.org} (${entry.period}; ${entry.location})`;
      const meta = [entry.url && `URL: ${entry.url}`, entry.intro, entry.stack && `Stack: ${entry.stack}`]
        .filter(Boolean)
        .join('\n');
      const bullets = entry.bullets.map((bullet) => `- ${plain(bullet.text)}`).join('\n');
      return [head, meta, bullets].filter(Boolean).join('\n');
    })
    .join('\n\n');

export async function buildKnowledge(): Promise<string> {
  const work = (await getCollection('work')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => +b.data.date - +a.data.date);
  const rawPages = import.meta.glob('../pages/how-i-work.mdx', { query: '?raw', import: 'default', eager: true });
  const howIWork = stripMdx(String(Object.values(rawPages)[0] ?? ''), 'how-i-work.mdx', 1);

  const caseStudies = work
    .map(({ id, data, body }) => {
      const head = [
        `### ${data.title}: ${data.headline}`,
        `Case study: ${SITE}/work/${id}/`,
        data.url && `Live: ${data.url}`,
        `Role: ${data.role}. Period: ${data.period}.`,
        `Stack: ${data.stack}`,
        plain(data.tagline),
      ]
        .filter(Boolean)
        .join('\n');
      return `${head}\n\n${stripMdx(body ?? '', `work/${id}`, 2)}`;
    })
    .join('\n\n');

  const metrics = Object.entries(evidence)
    .map(
      ([id, fact]) =>
        `### ${id}\n${fact.metrics.map((metric) => `- ${metric.value}: ${metric.label}`).join('\n')}\nMeasurement period: ${fact.period}`,
    )
    .join('\n\n');

  const writing = posts
    .map(
      ({ id, data, body }) =>
        `### ${data.title} (${data.date.toISOString().slice(0, 10)})\n${new URL(postHref(id), SITE).href}\n${data.description}\n\n${stripMdx(body ?? '', `blog/${id}`, 2)}`,
    )
    .join('\n\n');

  const testimonials = [
    ...linkedinReviews.map((review) => `- "${review.quote}" (${review.name}, ${review.role}; ${review.tag}, LinkedIn)`),
    ...freelanceReviews.map((review) => `- "${review.quote}" (${review.name}, freelancer.com client review)`),
  ].join('\n');

  const doc = `# Khalil Hebachi: knowledge document
Generated ${new Date().toISOString().slice(0, 10)}. Public content from ${SITE}. This document is the
source of truth for the "ask about my work" assistant on that site.

## Profile
Name: ${profile.name}
Title: Lead full-stack engineer, building since 2012
Location: ${profile.location}
Languages: ${profile.languages}
Email: ${profile.email}
Site: ${profile.site} · GitHub: ${profile.github} · LinkedIn: ${profile.linkedin}
Education: ${education.degree}, ${education.school}, ${education.year} (${education.focus})

## Target roles
${roles.map((role) => `- ${role.headline}: ${role.summary}`).join('\n')}

## Key dated metrics (counts are workflow events; each keeps its measurement period)
${metrics}

## Experience
${entryLines(experience)}

## Own product
${entryLines(projects)}

## Skills
${skills.map((group) => `- ${group.label}: ${group.items}`).join('\n')}

## Case studies
${caseStudies}

## How Khalil works
${howIWork}

## Writing
${writing}

## What colleagues and clients say
${testimonials}
`;

  if (doc.includes('€')) throw new Error('knowledge: a euro amount leaked into the public document');
  return doc;
}

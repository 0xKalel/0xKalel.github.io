import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      headline: z.string(),
      category: z.string(),
      decision: z.string(),
      decisionAnchor: z.string(),
      role: z.string(),
      period: z.string(),
      stack: z.string(),
      order: z.number(),
      url: z.string().url().optional(),
      shots: z.array(z.object({ src: image(), alt: z.string() })).default([]),
      video: z.object({ src: z.string(), poster: z.string() }).optional(),
      videos: z.array(z.object({ src: z.string(), poster: z.string(), caption: z.string() })).default([]),
    }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { work, blog };

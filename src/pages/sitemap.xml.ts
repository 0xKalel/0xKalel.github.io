import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postHref } from '../lib/blog';
import { escapeXml } from '../lib/xml';
export const GET: APIRoute = async ({ site }) => {
  const [work, posts] = await Promise.all([getCollection('work'), getCollection('blog')]);
  // Role CV variants stay out on purpose: they are unlisted URLs shared per application (see README).
  const paths: Array<{ path: string; lastmod?: string }> = [
    { path: '/' },
    { path: '/how-i-work/' },
    { path: '/blog/' },
    { path: '/cv/' },
    ...work.map((w) => ({ path: `/work/${w.id}/` })),
    ...posts.map((p) => ({ path: postHref(p.id), lastmod: (p.data.updated ?? p.data.date).toISOString().slice(0, 10) })),
  ];
  const urls = paths
    .map(({ path, lastmod }) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`)
    .join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postHref } from '../lib/blog';
import { escapeXml } from '../lib/xml';
import { roles } from '../data/roles';
export const GET: APIRoute = async ({ site }) => {
  const [work, posts] = await Promise.all([getCollection('work'), getCollection('blog')]);
  const paths = ['/', '/how-i-work/', '/blog/', '/cv/', ...roles.map((r) => `/cv/${r.slug}/`), ...work.map((w) => `/work/${w.id}/`), ...posts.map((p) => postHref(p.id))];
  const urls = paths.map((path) => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

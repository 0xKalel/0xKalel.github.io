import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postHref } from '../lib/blog';
import { escapeXml } from '../lib/xml';
import { profile } from '../data/cv';
export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection('blog')).sort((a, b) => +b.data.date - +a.data.date);
  const items = posts.map((post) => {
    const url = escapeXml(new URL(postHref(post.id), site).href);
    return `<item><title>${escapeXml(post.data.title)}</title><description>${escapeXml(post.data.description)}</description><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${post.data.date.toUTCString()}</pubDate></item>`;
  }).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Writing by ${escapeXml(profile.name)}</title><description>Engineering decisions and lessons from building software.</description><link>${escapeXml(new URL('/blog/', site).href)}</link><language>en</language><atom:link href="${escapeXml(new URL('/rss.xml', site).href)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};

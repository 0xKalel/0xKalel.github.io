import type { APIRoute } from 'astro';
import { buildKnowledge } from '../../lib/knowledge';

// Build-time knowledge document for the ask chat, fetched and cached by the worker.
export const GET: APIRoute = async () =>
  new Response(await buildKnowledge(), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });

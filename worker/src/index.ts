import { buildSystemPrompt } from './prompt';

interface Env {
  GEMINI_API_KEY: string;
  GEMINI_MODEL: string;
  KNOWLEDGE_URL: string;
  /** Comma-separated list of origins allowed to call this worker. */
  ALLOWED_ORIGINS: string;
  RATE_LIMITER: { limit(options: { key: string }): Promise<{ success: boolean }> };
}

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const MAX_QUESTION_CHARS = 500;
const MAX_HISTORY_MESSAGES = 16; // 8 turns
const MAX_MESSAGE_CHARS = 1000;
const MAX_BODY_BYTES = 8192;
const KNOWLEDGE_TTL_MS = 10 * 60 * 1000;

// Cached per isolate; the CDN cache on the fetch covers cold isolates.
let knowledgeCache: { text: string; fetchedAt: number } | undefined;

async function getKnowledge(env: Env): Promise<string> {
  if (knowledgeCache && Date.now() - knowledgeCache.fetchedAt < KNOWLEDGE_TTL_MS) {
    return knowledgeCache.text;
  }
  const response = await fetch(env.KNOWLEDGE_URL, {
    cf: { cacheTtl: 300, cacheEverything: true },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    if (knowledgeCache) return knowledgeCache.text; // serve stale over failing
    throw new Error(`knowledge fetch failed: ${response.status}`);
  }
  const text = await response.text();
  knowledgeCache = { text, fetchedAt: Date.now() };
  return text;
}

const cors = (origin: string): Record<string, string> => ({
  'Access-Control-Allow-Origin': origin,
  Vary: 'Origin',
});

const json = (status: number, body: Record<string, string>, origin: string) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...cors(origin), 'Content-Type': 'application/json' },
  });

const UNAVAILABLE =
  'The assistant is unavailable right now. Try again shortly, or email hebachikhalil@gmail.com.';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname !== '/chat') return new Response('Not found', { status: 404 });

    const origin = request.headers.get('Origin') ?? '';
    const allowed = env.ALLOWED_ORIGINS.split(',').map((entry) => entry.trim());
    if (!allowed.includes(origin)) return new Response('Forbidden', { status: 403 });

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          ...cors(origin),
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    if (request.method !== 'POST') return json(405, { error: 'method_not_allowed' }, origin);

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return json(
        429,
        { error: 'rate_limited', message: 'Too many messages. Wait a minute and try again.' },
        origin,
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json(400, { error: 'too_large' }, origin);
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return json(400, { error: 'bad_json' }, origin);
    }
    const body = parsed as { question?: unknown; history?: unknown };
    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question || question.length > MAX_QUESTION_CHARS) {
      return json(400, { error: 'bad_question' }, origin);
    }
    const candidate: ChatMessage[] = (Array.isArray(body.history) ? body.history : [])
      .filter(
        (message): message is ChatMessage =>
          !!message &&
          typeof message === 'object' &&
          ((message as ChatMessage).role === 'user' || (message as ChatMessage).role === 'model') &&
          typeof (message as ChatMessage).text === 'string',
      )
      .slice(-MAX_HISTORY_MESSAGES)
      .map((message) => ({ role: message.role, text: message.text.slice(0, MAX_MESSAGE_CHARS) }));
    // Client-supplied history is unverifiable; anything but clean user/model pairs is discarded.
    const paired =
      candidate.length % 2 === 0 &&
      candidate.every((message, index) => message.role === (index % 2 === 0 ? 'user' : 'model'));
    const history = paired ? candidate : [];

    let knowledge: string;
    try {
      knowledge = await getKnowledge(env);
    } catch (error) {
      console.error('knowledge fetch failed', error);
      return json(502, { error: 'upstream', message: UNAVAILABLE }, origin);
    }

    // The timer only covers the connect phase: fetch resolves on headers, and
    // aborting after that would cut an answer that is still streaming.
    const upstreamAbort = new AbortController();
    const connectTimer = setTimeout(() => upstreamAbort.abort(), 30_000);
    let upstream: Response;
    try {
      upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL}:streamGenerateContent?alt=sse`,
      {
        method: 'POST',
        headers: { 'x-goog-api-key': env.GEMINI_API_KEY, 'Content-Type': 'application/json' },
        signal: upstreamAbort.signal,
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: buildSystemPrompt(knowledge) }] },
          contents: [
            ...history.map((message) => ({ role: message.role, parts: [{ text: message.text }] })),
            { role: 'user', parts: [{ text: question }] },
          ],
          // Thinking off: reasoning tokens count against maxOutputTokens and truncate answers.
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.3,
            thinkingConfig: { thinkingBudget: 0 },
          },
          // Block thresholds default to Off on current Gemini models.
          safetySettings: [
            'HARM_CATEGORY_HARASSMENT',
            'HARM_CATEGORY_HATE_SPEECH',
            'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            'HARM_CATEGORY_DANGEROUS_CONTENT',
          ].map((category) => ({ category, threshold: 'BLOCK_MEDIUM_AND_ABOVE' })),
        }),
      },
      );
    } catch (error) {
      console.error('gemini fetch failed', error);
      return json(502, { error: 'upstream', message: UNAVAILABLE }, origin);
    } finally {
      clearTimeout(connectTimer);
    }
    if (!upstream.ok || !upstream.body) {
      console.error('gemini error', upstream.status, await upstream.text().catch(() => ''));
      return json(502, { error: 'upstream', message: UNAVAILABLE }, origin);
    }

    // Re-emit upstream SSE as minimal {"text"} events; Gemini metadata stays server-side.
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = '';
    const emit = (line: string, controller: TransformStreamDefaultController<Uint8Array>) => {
      if (!line.startsWith('data:')) return;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const event = JSON.parse(data) as {
          candidates?: { content?: { parts?: { text?: string }[] } }[];
        };
        for (const part of event.candidates?.[0]?.content?.parts ?? []) {
          if (part.text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: part.text })}\n\n`));
          }
        }
      } catch {}
    };
    const transform = new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        let newline: number;
        while ((newline = buffer.indexOf('\n')) !== -1) {
          emit(buffer.slice(0, newline).trim(), controller);
          buffer = buffer.slice(newline + 1);
        }
      },
      flush(controller) {
        emit((buffer + decoder.decode()).trim(), controller);
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      },
    });

    return new Response(upstream.body.pipeThrough(transform), {
      headers: { ...cors(origin), 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' },
    });
  },
};

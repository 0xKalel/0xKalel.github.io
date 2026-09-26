// Client helpers for the ask chat (src/components/Ask.astro); the endpoint is the worker in worker/.

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

// TODO: replace with the real workers.dev URL (or custom route) after `npm run deploy` in worker/.
export const ASK_ENDPOINT = import.meta.env.DEV
  ? 'http://localhost:8787/chat'
  : 'https://portfolio-ask.example.workers.dev/chat';

/** Keeps the widget out of production builds until the real endpoint is configured. */
export const ASK_READY = import.meta.env.DEV || !ASK_ENDPOINT.includes('.example.');

export const ASK_SUGGESTIONS = [
  'What did Khalil build for StoragePal?',
  'What measured results can he show?',
  'How does he use AI day to day?',
  'Is he available for new work?',
];

export const MAX_QUESTION_CHARS = 500;
const MAX_STORED_MESSAGES = 16; // display cap: 8 turns
const MAX_SENT_MESSAGES = 8; // context sent upstream: 4 turns
const MAX_SENT_CHARS = 800; // per message, keeping the body under the worker's 8KB cap
const STORAGE_KEY = 'ask:conversation';

/** Survives view transitions and page navigations; per-tab by design. */
export function loadConversation(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (message): message is ChatMessage =>
        !!message &&
        typeof message === 'object' &&
        (message.role === 'user' || message.role === 'model') &&
        typeof message.text === 'string',
    );
  } catch {
    return [];
  }
}

export function saveConversation(messages: ChatMessage[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  } catch {}
}

/** Last complete user/model pairs, trimmed to the worker's caps; the worker rejects unpaired history. */
function sendableHistory(messages: ChatMessage[]): ChatMessage[] {
  const pairs: ChatMessage[] = [];
  for (let i = messages.length - 1; i > 0; i -= 1) {
    if (messages[i].role === 'model' && messages[i - 1].role === 'user') {
      pairs.unshift(
        { role: 'user', text: messages[i - 1].text.slice(0, MAX_SENT_CHARS) },
        { role: 'model', text: messages[i].text.slice(0, MAX_SENT_CHARS) },
      );
      i -= 1;
    }
  }
  return pairs.slice(-MAX_SENT_MESSAGES);
}

export class AskError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** POSTs a question and yields answer text deltas from the worker's SSE stream. */
export async function* streamChat(
  question: string,
  history: ChatMessage[],
  signal: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch(ASK_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history: sendableHistory(history) }),
    signal,
  });
  if (!response.ok || !response.body) {
    let message = 'Something went wrong.';
    try {
      const body = (await response.json()) as { message?: string };
      if (body.message) message = body.message;
    } catch {}
    throw new AskError(response.status, message);
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) return;
    buffer += decoder.decode(value, { stream: true });
    let boundary: number;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const event = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const line = event.split('\n').find((entry) => entry.startsWith('data:'));
      if (!line) continue;
      const data = line.slice(5).trim();
      if (data === '[DONE]') return;
      try {
        const parsed = JSON.parse(data) as { text?: string };
        if (parsed.text) yield parsed.text;
      } catch {}
    }
  }
}

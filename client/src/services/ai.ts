/**
 * AI service — calls the Express backend, never Gemini directly.
 * The browser never sees GEMINI_API_KEY.
 */

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  references?: { file: string; line: number }[];
  model?: string;
  contextFilesUsed?: string[];
}

export interface AIChatPayload {
  repositoryId: string;
  message: string;
}

export async function postAIChat(payload: AIChatPayload): Promise<AIMessage> {
  const res = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? 'AI request failed');
  }

  return res.json();
}
